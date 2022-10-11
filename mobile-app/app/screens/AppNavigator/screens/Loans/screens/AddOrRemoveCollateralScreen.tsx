import {
  ThemedProps,
  ThemedScrollViewV2,
  ThemedTextV2,
  ThemedViewV2,
} from "@components/themed";
import { StackScreenProps } from "@react-navigation/stack";
import { getColor, tailwind } from "@tailwind";
import { translate } from "@translations";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { TokenData } from "@defichain/whale-api-client/dist/api/tokens";
import { useThemeContext } from "@shared-contexts/ThemeProvider";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { hasTxQueued } from "@store/transaction_queue";
import { hasTxQueued as hasBroadcastQueued } from "@store/ocean";
import { DFITokenSelector, DFIUtxoSelector } from "@store/wallet";
import {
  getPrecisedCurrencyValue,
  getPrecisedTokenValue,
} from "@screens/AppNavigator/screens/Auctions/helpers/precision-token-value";
import { useFeatureFlagContext } from "@contexts/FeatureFlagContext";
import {
  AmountButtonTypes,
  TransactionCard,
} from "@components/TransactionCard";
import { useToast } from "react-native-toast-notifications";
import { useForm } from "react-hook-form";
import {
  TokenDropdownButton,
  TokenDropdownButtonStatus,
} from "@components/TokenDropdownButton";
import {
  BottomSheetNavScreen,
  BottomSheetWebWithNavV2,
  BottomSheetWithNavV2,
} from "@components/BottomSheetWithNavV2";
import { ButtonV2 } from "@components/ButtonV2";
import { useBottomSheet } from "@hooks/useBottomSheet";
import {
  BottomSheetTokenList,
  TokenType,
} from "@components/BottomSheetTokenList";
import { TextRowV2 } from "@components/TextRowV2";
import { NumberRowV2 } from "@components/NumberRowV2";
import * as Progress from "react-native-progress";
import { useWhaleApiClient } from "@shared-contexts/WhaleContext";
import { useLogger } from "@shared-contexts/NativeLoggingProvider";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { queueConvertTransaction } from "@hooks/wallet/Conversion";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { getActivePrice } from "../../Auctions/helpers/ActivePrice";
import { ActiveUSDValueV2 } from "../VaultDetail/components/ActiveUSDValueV2";
import { LoanParamList } from "../LoansNavigator";
import {
  useCollateralizationRatioColorV2,
  useResultingCollateralizationRatioByCollateral,
} from "../hooks/CollateralizationRatio";
import {
  getCollateralValue,
  getVaultShare,
  useValidCollateralRatio,
} from "../hooks/CollateralPrice";
import { CollateralItem } from "../screens/EditCollateralScreen";
import { ControlledTextInput } from "../components/ControlledTextInput";

type Props = StackScreenProps<LoanParamList, "AddOrRemoveCollateralScreen">;

export interface AddOrRemoveCollateralResponse {
  collateralItem: CollateralItem;
  amount: BigNumber;
  token: TokenData;
}

export function AddOrRemoveCollateralScreen({ route }: Props): JSX.Element {
  const { vault, collateralItem, collateralTokens, isAdd } = route.params;
  const [selectedCollateralItem, setSelectedCollateralItem] =
    useState<CollateralItem>(collateralItem);

  const { control, formState, setValue, trigger, watch } = useForm<{
    collateralAmount: string;
  }>({ mode: "onChange" });
  const { collateralAmount } = watch();

  const { isLight } = useThemeContext();
  const client = useWhaleApiClient();
  const logger = useLogger();

  const dispatch = useAppDispatch();
  const DFIUtxo = useSelector((state: RootState) =>
    DFIUtxoSelector(state.wallet)
  );
  const DFIToken = useSelector((state: RootState) =>
    DFITokenSelector(state.wallet)
  );

  const hasPendingJob = useSelector((state: RootState) =>
    hasTxQueued(state.transactionQueue)
  );
  const hasPendingBroadcastJob = useSelector((state: RootState) =>
    hasBroadcastQueued(state.ocean)
  );

  const navigation = useNavigation<NavigationProp<LoanParamList>>();
  const { isFeatureAvailable } = useFeatureFlagContext();

  const TOAST_DURATION = 2000;
  const toast = useToast();

  const [fee, setFee] = useState<BigNumber>(new BigNumber(0.0001));
  const [bottomSheetScreen, setBottomSheetScreen] = useState<
    BottomSheetNavScreen[]
  >([]);
  const {
    bottomSheetRef,
    containerRef,
    dismissModal,
    expandModal,
    isModalDisplayed,
  } = useBottomSheet();

  const isConversionRequired =
    isAdd && selectedCollateralItem.token.id === "0"
      ? new BigNumber(collateralAmount).isGreaterThan(DFIToken.amount) &&
        new BigNumber(collateralAmount).isLessThanOrEqualTo(
          selectedCollateralItem.available
        )
      : false;

  const collateralInputAmount = new BigNumber(collateralAmount).isNaN()
    ? 0
    : collateralAmount;
  const collateralInputValue = getCollateralValue(
    new BigNumber(collateralInputAmount),
    collateralItem
  );

  // Vault collaterals value
  const currentVaultCollateralValue =
    new BigNumber(vault.collateralValue) ?? new BigNumber(0);
  const totalVaultCollateralValue = isAdd
    ? new BigNumber(currentVaultCollateralValue).plus(collateralInputValue)
    : new BigNumber(currentVaultCollateralValue).minus(collateralInputValue);
  const totalVaultCollateralValueInUSD = new BigNumber(
    getPrecisedTokenValue(totalVaultCollateralValue)
  );

  // Collateral value for selected token
  const currentTokenBalance =
    vault?.collateralAmounts?.find((c) => c.id === collateralItem?.token.id)
      ?.amount ?? "0";
  const totalTokenBalance = isAdd
    ? new BigNumber(currentTokenBalance)?.plus(collateralInputAmount)
    : BigNumber.max(
        0,
        new BigNumber(currentTokenBalance)?.minus(collateralInputAmount)
      );
  const tokenCollateralValue = getCollateralValue(
    totalTokenBalance,
    collateralItem
  );
  const totalTokenValueInUSD = new BigNumber(
    getPrecisedTokenValue(tokenCollateralValue)
  );

  const activePrice = new BigNumber(
    getActivePrice(
      collateralItem.token.symbol,
      collateralItem.activePrice,
      collateralItem.factor,
      "ACTIVE",
      "COLLATERAL"
    )
  );
  const collateralVaultShare =
    getVaultShare(totalTokenBalance, activePrice, totalVaultCollateralValue) ??
    new BigNumber(0);

  const { resultingColRatio, normalizedColRatio } =
    useResultingCollateralizationRatioByCollateral({
      collateralValue: totalTokenBalance.toFixed(8),
      collateralRatio: new BigNumber(vault.informativeRatio ?? NaN),
      minCollateralRatio: new BigNumber(vault.loanScheme.minColRatio),
      totalLoanAmount: new BigNumber(vault.loanValue),
      totalCollateralValueInUSD: totalVaultCollateralValueInUSD,
    });

  const hasInvalidColRatio =
    resultingColRatio.isLessThanOrEqualTo(0) ||
    resultingColRatio.isNaN() ||
    !resultingColRatio.isFinite();

  const collateralizationColor = useCollateralizationRatioColorV2({
    colRatio: resultingColRatio,
    minColRatio: new BigNumber(vault.loanScheme.minColRatio ?? NaN),
    totalLoanAmount: new BigNumber(vault.loanValue ?? NaN),
    totalCollateralValue: totalVaultCollateralValueInUSD,
  });
  /** *******************************ENDS HERE */

  const {
    requiredVaultShareTokens,
    requiredTokensShare,
    minRequiredTokensShare,
    hasLoan,
  } = useValidCollateralRatio(
    vault?.collateralAmounts ?? [],
    totalVaultCollateralValue,
    new BigNumber(vault.loanValue),
    selectedCollateralItem.token.id,
    totalTokenBalance
  );
  const isValidCollateralRatio = requiredTokensShare?.gte(
    minRequiredTokensShare
  );

  useEffect(() => {
    client.fee
      .estimate()
      .then((f) => setFee(new BigNumber(f)))
      .catch(logger.error);
  }, []);

  async function onPercentageChange(
    amount: string,
    type: AmountButtonTypes
  ): Promise<void> {
    setValue("collateralAmount", amount);
    await trigger("collateralAmount");
    showToast(type);
  }

  function showToast(type: AmountButtonTypes): void {
    toast.hideAll();
    const toastOptionsOnAdd = {
      message:
        type === AmountButtonTypes.Max
          ? "Max available {{symbol}} entered"
          : "{{percent}} of available {{symbol}} entered",
      params:
        type === AmountButtonTypes.Max
          ? { symbol: selectedCollateralItem.token.symbol }
          : { percent: type, symbol: selectedCollateralItem.token.symbol },
    };
    const toastOptionsOnRemove = {
      message:
        type === AmountButtonTypes.Max
          ? "Max available collateral entered"
          : "{{percent}} of available collateral entered",
      params: type === AmountButtonTypes.Max ? {} : { percent: type },
    };
    toast.show(
      translate(
        "screens/AddOrRemoveCollateralScreen",
        isAdd ? toastOptionsOnAdd.message : toastOptionsOnRemove.message,
        isAdd ? toastOptionsOnAdd.params : toastOptionsOnRemove.params
      ),
      { type: "wallet_toast", placement: "top", duration: TOAST_DURATION }
    );
  }

  const onAddCollateral = async ({
    amount,
    token,
    collateralItem,
  }: AddOrRemoveCollateralResponse): Promise<void> => {
    const initialParams = {
      name: "ConfirmEditCollateralScreen",
      params: {
        vault,
        amount,
        token,
        fee,
        collateralItem,
        resultingColRatio,
        collateralizationColor,
        vaultShare: collateralVaultShare,
        conversion: undefined,
        isAdd: true,
      },
    };
    if (isConversionRequired) {
      const conversionAmount = new BigNumber(amount).minus(DFIToken.amount);
      initialParams.params.conversion = {
        DFIUtxo,
        DFIToken,
        isConversionRequired,
        conversionAmount: new BigNumber(amount).minus(DFIToken.amount),
      } as any;
      queueConvertTransaction(
        {
          mode: "utxosToAccount",
          amount: conversionAmount,
        },
        dispatch,
        () => {
          navigation.navigate(initialParams);
        },
        logger
      );
    } else {
      navigation.navigate(initialParams);
    }
  };

  const onRemoveCollateral = async ({
    amount,
    token,
    collateralItem,
  }: AddOrRemoveCollateralResponse): Promise<void> => {
    navigation.navigate({
      name: "ConfirmEditCollateralScreen",
      params: {
        vault,
        amount,
        token,
        fee,
        collateralItem,
        resultingColRatio,
        collateralizationColor,
        vaultShare: collateralVaultShare,
        conversion: undefined,
        isAdd: false,
      },
    });
  };

  const handleEditCollateral = async (): Promise<void> => {
    const collateralItem = collateralTokens.find(
      (col) => col.token.id === selectedCollateralItem.token.id
    );
    if (vault === undefined || collateralItem === undefined) {
      return;
    }

    const params = {
      collateralItem,
      amount: new BigNumber(collateralAmount),
      token: selectedCollateralItem.token,
    };
    if (isAdd) {
      onAddCollateral(params);
    } else {
      onRemoveCollateral(params);
    }
  };

  const lhsThemedProps = {
    light: tailwind("text-mono-light-v2-500"),
    dark: tailwind("text-mono-dark-v2-500"),
  };
  const rhsThemedProps = {
    light: tailwind("text-mono-light-v2-900"),
    dark: tailwind("text-mono-dark-v2-900"),
  };

  const disableSubmitButton =
    !formState.isValid ||
    hasPendingJob ||
    hasPendingBroadcastJob ||
    (isFeatureAvailable("dusd_vault_share") &&
      !isAdd &&
      !isValidCollateralRatio &&
      hasLoan);

  return (
    <ThemedScrollViewV2
      ref={containerRef}
      style={tailwind("flex-col flex-1")}
      testID="add_remove_collateral_screen"
      contentContainerStyle={tailwind(
        "flex-grow justify-between pt-8 px-5 pb-14"
      )}
    >
      <View>
        {/* Header Title */}
        <ThemedTextV2
          style={tailwind("mx-5 text-xs font-normal-v2")}
          light={tailwind("text-mono-light-v2-500")}
          dark={tailwind("text-mono-dark-v2-500")}
        >
          {translate(
            "screens/AddOrRemoveCollateralScreen",
            isAdd ? "I WANT TO ADD" : "I WANT TO REMOVE"
          )}
        </ThemedTextV2>

        {/* Quick Inputs and text input */}
        <TransactionCard
          maxValue={
            isAdd
              ? selectedCollateralItem.available
              : new BigNumber(currentTokenBalance)
          }
          onChange={onPercentageChange}
          disabled={selectedCollateralItem === undefined}
          componentStyle={{
            light: tailwind("bg-transparent"),
            dark: tailwind("bg-transparent"),
          }}
          containerStyle={{
            light: tailwind("bg-transparent"),
            dark: tailwind("bg-transparent"),
          }}
          amountButtonsStyle={{
            light: tailwind("bg-mono-light-v2-00"),
            dark: tailwind("bg-mono-dark-v2-00"),
            style: tailwind("mt-6 rounded-xl-v2"),
          }}
        >
          <View
            style={tailwind(
              "flex flex-row justify-between items-center mt-4 ml-5"
            )}
          >
            <View style={tailwind("w-6/12 mr-2")}>
              <ControlledTextInput
                name="collateralAmount"
                control={control}
                testID="text_input_collateral_amount"
                inputProps={{
                  keyboardType: "numeric",
                  placeholder: "0.00",
                  editable: selectedCollateralItem !== undefined,
                  onChangeText: async (amount: string) => {
                    amount = isNaN(+amount) ? "0" : amount;
                    setValue("collateralAmount", amount);
                    await trigger("collateralAmount");
                  },
                }}
                value={collateralAmount}
                rules={{
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                  validate: {
                    hasSufficientFunds: (value: string) =>
                      isAdd
                        ? selectedCollateralItem.available.gte(value)
                        : new BigNumber(currentTokenBalance).gte(value),
                  },
                }}
              />
              <ActiveUSDValueV2
                price={getCollateralValue(
                  new BigNumber(collateralAmount),
                  selectedCollateralItem
                )}
                testId="collateral_value_in_usd"
                containerStyle={tailwind("w-full break-words")}
              />
            </View>

            <TokenDropdownButton
              symbol={selectedCollateralItem.token.displaySymbol}
              testID="add_remove_collateral_quick_input"
              onPress={() => {
                setBottomSheetScreen([
                  {
                    stackScreenName: "TokenList",
                    component: BottomSheetTokenList({
                      tokens: collateralTokens,
                      tokenType: TokenType.CollateralItem,
                      vault: vault,
                      headerLabel: translate(
                        "screens/AddOrRemoveCollateralScreen",
                        "Select Collateral"
                      ),
                      onCloseButtonPress: dismissModal,
                      onTokenPress: async (token) => {
                        setSelectedCollateralItem(token as CollateralItem);
                        if (selectedCollateralItem?.tokenId !== token.tokenId) {
                          setValue("collateralAmount", "");
                          await trigger("collateralAmount");
                        }
                        dismissModal();
                      },
                    }),
                    option: {
                      header: () => null,
                      headerBackTitleVisible: false,
                    },
                  },
                ]);
                expandModal();
              }}
              status={TokenDropdownButtonStatus.Enabled}
            />
          </View>
        </TransactionCard>

        {/* Display available balance for selected token */}
        {(Object.keys(formState.errors).length <= 0 ||
          formState.errors.collateralAmount?.type === "required") &&
          !isConversionRequired && (
            <ThemedTextV2
              light={tailwind("text-mono-light-v2-500")}
              dark={tailwind("text-mono-dark-v2-500")}
              style={tailwind("text-xs pt-2 mx-5 font-normal-v2")}
              testID="available_balance_text"
            >
              {isAdd
                ? translate(
                    "screens/AddOrRemoveCollateralScreen",
                    "Available: {{amount}} {{symbol}}",
                    {
                      amount: selectedCollateralItem.available.toFixed(8),
                      symbol: selectedCollateralItem.token.symbol,
                    }
                  )
                : translate(
                    "screens/AddOrRemoveCollateralScreen",
                    "Available: {{amount}} {{symbol}} collateral",
                    {
                      amount: currentTokenBalance,
                      symbol: selectedCollateralItem.token.symbol,
                    }
                  )}
            </ThemedTextV2>
          )}

        {isConversionRequired && (
          <ThemedTextV2
            light={tailwind("text-orange-v2")}
            dark={tailwind("text-orange-v2")}
            style={tailwind("text-xs pt-2 mx-5 font-normal-v2")}
            testID="conversion_required_text"
          >
            {translate(
              "screens/AddOrRemoveCollateralScreen",
              "A small amount of UTXO is reserved for fees"
            )}
          </ThemedTextV2>
        )}

        {/* Display insufficient balance error */}
        {formState.errors.collateralAmount?.type === "hasSufficientFunds" && (
          <ThemedTextV2
            light={tailwind("text-red-v2")}
            dark={tailwind("text-red-v2")}
            style={tailwind("text-xs pt-2 mx-6 font-normal-v2")}
            testID="insufficient_balance_text"
          >
            {translate(
              "screens/AddOrRemoveCollateralScreen",
              "Insufficient Balance"
            )}
          </ThemedTextV2>
        )}
      </View>

      <ThemedViewV2
        light={tailwind("border-mono-light-v2-300")}
        dark={tailwind("border-mono-dark-v2-300")}
        style={tailwind("p-5 mt-8 border-0.5 rounded-lg-v2")}
      >
        <ThemedViewV2
          light={tailwind("border-mono-light-v2-300")}
          dark={tailwind("border-mono-dark-v2-300")}
        >
          <TextRowV2
            containerStyle={{
              style: tailwind("flex-row items-start w-full"),
              light: tailwind("bg-transparent"),
              dark: tailwind("bg-transparent"),
            }}
            lhs={{
              value: translate(
                "screens/AddOrRemoveCollateralScreen",
                "Vault ID"
              ),
              testID: "edit_col_vault_id_label",
              themedProps: lhsThemedProps,
            }}
            rhs={{
              value: vault.vaultId,
              testID: `edit_col_vault_id_value`,
              numberOfLines: 1,
              ellipsizeMode: "middle",
              themedProps: rhsThemedProps,
            }}
          />
          <NumberRowV2
            info={{
              title: "Vault Share",
              message:
                "Vault share indicates the percentage a token will represent based on the total collateral value.",
              iconStyle: {
                light: tailwind("text-mono-light-v2-500"),
                dark: tailwind("text-mono-dark-v2-500"),
              },
            }}
            containerStyle={{
              style: tailwind("flex-row items-start mt-5"),
            }}
            lhs={{
              value: translate(
                "screens/AddOrRemoveCollateralScreen",
                "Vault share"
              ),
              testID: "edit_col_vault_share_label",
              themedProps: lhsThemedProps,
            }}
            rhs={{
              value: collateralVaultShare.isNaN()
                ? 0
                : collateralVaultShare.toFixed(2),
              testID: "edit_col_vault_share_value",
              suffix: "%",
              themedProps: rhsThemedProps,
            }}
          />
          <NumberRowV2
            containerStyle={{
              style: tailwind("flex-row items-start w-full mt-5"),
            }}
            lhs={{
              value: translate(
                "screens/AddOrRemoveCollateralScreen",
                "Available loan"
              ),
              testID: "edit_col_loan_label",
              themedProps: lhsThemedProps,
            }}
            rhs={{
              value: getPrecisedCurrencyValue(vault.loanValue),
              testID: "edit_col_loan_value",
              prefix: "$",
              themedProps: rhsThemedProps,
            }}
          />
          <NumberRowV2
            containerStyle={{
              style: tailwind("flex-row items-start w-full mt-5"),
            }}
            lhs={{
              value: translate(
                "screens/AddOrRemoveCollateralScreen",
                "Total collateral"
              ),
              testID: "token_col_amount_label",
              themedProps: lhsThemedProps,
            }}
            rhs={{
              value: getPrecisedCurrencyValue(totalTokenBalance),
              testID: "token_col_amount_value",
              usdAmount: totalTokenValueInUSD,
              usdTextStyle: tailwind("text-sm"),
              usdContainerStyle: tailwind("pt-1 pb-0"),
              themedProps: rhsThemedProps,
            }}
          />
          <CollateralRatioRow
            type={hasInvalidColRatio ? "text" : "number"}
            value={
              hasInvalidColRatio
                ? translate("screens/AddOrRemoveCollateralScreen", "Empty")
                : resultingColRatio.toFixed(2)
            }
            rhsThemedProps={{
              light: tailwind(
                hasInvalidColRatio
                  ? "text-mono-light-v2-900"
                  : `text-${collateralizationColor}`
              ),
              dark: tailwind(
                hasInvalidColRatio
                  ? "text-mono-dark-v2-900"
                  : `text-${collateralizationColor}`
              ),
            }}
            testID="col_ratio"
          />
          <Progress.Bar
            style={tailwind("mt-3")}
            progress={normalizedColRatio.toNumber()}
            color={getColor(collateralizationColor)}
            unfilledColor={getColor(
              isLight ? "mono-light-v2-200" : "mono-dark-v2-200"
            )}
            borderWidth={0}
            width={null}
          />
        </ThemedViewV2>
      </ThemedViewV2>

      <View style={tailwind("pt-16 px-7")}>
        {/* TODO: Check if message below is still need for V2 removal */}
        {isFeatureAvailable("dusd_vault_share") &&
          !isAdd &&
          !isValidCollateralRatio &&
          requiredVaultShareTokens.includes(
            selectedCollateralItem.token.symbol
          ) &&
          hasLoan && (
            <ThemedTextV2
              dark={tailwind("text-error-500")}
              light={tailwind("text-error-500")}
              style={tailwind("text-sm text-center")}
              testID="vault_min_share_warning"
            >
              {translate(
                "screens/BorrowLoanTokenScreen",
                "Your vault needs at least 50% of DFI and/or DUSD as collateral"
              )}
            </ThemedTextV2>
          )}
        {!disableSubmitButton && (
          <ThemedTextV2
            light={tailwind("text-mono-light-v2-500")}
            dark={tailwind("text-mono-dark-v2-500")}
            style={tailwind("text-center text-xs font-normal-v2")}
          >
            {translate(
              "screens/AddOrRemoveCollateralScreen",
              isConversionRequired
                ? "By continuing, the required amount of DFI will be converted"
                : "Review full details in the next screen"
            )}
          </ThemedTextV2>
        )}

        <ButtonV2
          fillType="fill"
          label={translate("components/Button", "Continue")}
          disabled={disableSubmitButton}
          styleProps="mt-5"
          onPress={handleEditCollateral}
          testID="add_remove_collateral_button_submit"
        />
      </View>

      {Platform.OS === "web" && (
        <BottomSheetWebWithNavV2
          modalRef={containerRef}
          screenList={bottomSheetScreen}
          isModalDisplayed={isModalDisplayed}
          // eslint-disable-next-line react-native/no-inline-styles
          modalStyle={{
            position: "absolute",
            bottom: "0",
            height: "404px",
            width: "375px",
            zIndex: 50,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            overflow: "hidden",
          }}
        />
      )}

      {Platform.OS !== "web" && (
        <BottomSheetWithNavV2
          modalRef={bottomSheetRef}
          screenList={bottomSheetScreen}
          snapPoints={{
            ios: ["40%"],
            android: ["45%"],
          }}
        />
      )}
    </ThemedScrollViewV2>
  );
}

export function CollateralRatioRow(props: {
  type: "number" | "text";
  value: string | number;
  rhsThemedProps: ThemedProps;
  testID: string;
}): JSX.Element {
  const containerThemeOptions = {
    style: tailwind("flex-row items-start w-full mt-5"),
    light: tailwind("bg-transparent"),
    dark: tailwind("bg-transparent"),
  };

  const lhsProps = {
    value: translate("screens/AddOrRemoveCollateralScreen", "Collateral ratio"),
    testID: `${props.testID}_label`,
    themedProps: {
      light: tailwind("text-mono-light-v2-500"),
      dark: tailwind("text-mono-dark-v2-500"),
    },
  };

  return props.type === "number" ? (
    <NumberRowV2
      containerStyle={containerThemeOptions}
      lhs={lhsProps}
      rhs={{
        value: props.value,
        testID: `${props.testID}_value`,
        themedProps: props.rhsThemedProps,
        suffix: "%",
      }}
    />
  ) : (
    <TextRowV2
      containerStyle={containerThemeOptions}
      lhs={lhsProps}
      rhs={{
        value: props.value as string,
        testID: `${props.testID}_text`,
        themedProps: props.rhsThemedProps,
      }}
    />
  );
}
