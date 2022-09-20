import { useRef } from "react";
import {
  ThemedFlatListV2,
  ThemedIcon,
  ThemedText,
  ThemedTextV2,
  ThemedViewV2,
} from "@components/themed";
import { tailwind } from "@tailwind";
import { translate } from "@translations";
import NumberFormat from "react-number-format";
import { View } from "react-native";
import { getNativeIcon } from "@components/icons/assets";
import {
  LoanToken,
  LoanVaultActive,
  LoanVaultState,
} from "@defichain/whale-api-client/dist/api/loan";
import {
  NavigationProp,
  useNavigation,
  useScrollToTop,
} from "@react-navigation/native";
import { ActivePrice } from "@defichain/whale-api-client/dist/api/prices";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { vaultsSelector } from "@store/loans";
import { getPrecisedTokenValue } from "@screens/AppNavigator/screens/Auctions/helpers/precision-token-value";
import { IconTooltip } from "@components/tooltip/IconTooltip";
import { getActivePrice } from "../../Auctions/helpers/ActivePrice";
import { LoanParamList } from "../LoansNavigator";
import { LoanActionButton } from "./LoanActionButton";

interface LoanCardsProps {
  loans: LoanToken[];
  testID?: string;
  vaultId?: string;
  vaultExist: boolean;
}

export interface LoanCardOptions {
  loanTokenId: string;
  symbol: string;
  displaySymbol: string;
  price?: ActivePrice;
  interestRate: string;
  onPress: () => void;
  testID: string;
  disabled: boolean;
}

export function LoanCardsV2(props: LoanCardsProps): JSX.Element {
  const ref = useRef(null);
  useScrollToTop(ref);
  const navigation = useNavigation<NavigationProp<LoanParamList>>();
  const vaults = useSelector((state: RootState) => vaultsSelector(state.loans));
  const activeVault = vaults.find(
    (v) =>
      v.vaultId === props.vaultId && v.state !== LoanVaultState.IN_LIQUIDATION
  ) as LoanVaultActive;
  return (
    <>
      <ThemedFlatListV2
        contentContainerStyle={tailwind("px-2 pt-4 pb-2")}
        data={props.loans}
        ref={ref}
        numColumns={2}
        renderItem={({
          item,
          index,
        }: {
          item: LoanToken;
          index: number;
        }): JSX.Element => {
          return (
            <View style={{ flexBasis: "50%" }}>
              <LoanCard
                symbol={item.token.symbol}
                displaySymbol={item.token.displaySymbol}
                interestRate={item.interest}
                price={item.activePrice}
                loanTokenId={item.tokenId}
                onPress={() => {
                  navigation.navigate({
                    name: "BorrowLoanTokenScreen",
                    params: {
                      loanToken: item,
                      vault: activeVault,
                    },
                    merge: true,
                  });
                }}
                testID={`loan_card_${index}`}
                disabled={!props.vaultExist}
              />
            </View>
          );
        }}
        keyExtractor={(_item, index) => index.toString()}
        testID={props.testID}
      />
    </>
  );
}

function LoanCard({
  symbol,
  displaySymbol,
  price,
  interestRate,
  onPress,
  testID,
  disabled,
}: LoanCardOptions): JSX.Element {
  const LoanIcon = getNativeIcon(displaySymbol);
  const currentPrice = getPrecisedTokenValue(getActivePrice(symbol, price));
  return (
    <ThemedViewV2
      testID={`loan_card_${displaySymbol}`}
      light={tailwind("bg-mono-light-v2-00")}
      dark={tailwind("bg-mono-dark-v2-00")}
      style={tailwind("p-4 mx-2 mb-4 rounded-lg-v2")}
    >
      <View style={tailwind("flex-row items-center pb-2 justify-between")}>
        <View
          style={tailwind("flex flex-row justify-between items-center w-full")}
        >
          <ThemedTextV2
            light={tailwind("text-mono-light-v2-700")}
            dark={tailwind("text-mono-dark-v2-700")}
            style={tailwind("font-medium font-normal-v2")}
            testID={`${testID}_display_symbol`}
          >
            {displaySymbol}
          </ThemedTextV2>
          <LoanIcon width={36} height={36} />
        </View>
      </View>
      <NumberFormat
        decimalScale={2}
        thousandSeparator
        displayType="text"
        renderText={(value) => (
          <View style={tailwind("flex flex-row items-center")}>
            <ThemedText
              testID={`${testID}_loan_amount`}
              style={tailwind("text-sm")}
            >
              <ThemedTextV2
                light={tailwind("text-mono-light-v2-900")}
                dark={tailwind("text-mono-dark-v2-900")}
                style={tailwind("font-semibold-v2")}
                testID={`${testID}_interest_rate`}
                // eslint-disable-next-line react-native/no-raw-text
              >
                ${value}
              </ThemedTextV2>
            </ThemedText>
          </View>
        )}
        value={currentPrice}
      />
      <NumberFormat
        decimalScale={2}
        thousandSeparator
        displayType="text"
        renderText={(value) => (
          <ThemedTextV2
            light={tailwind("text-mono-light-v2-700")}
            dark={tailwind("text-mono-dark-v2-700")}
            style={tailwind("text-xs font-normal-v2")}
            testID={`${testID}_interest_rate`}
          >
            {translate("components/LoanCard", "{{interestValue}} Interest", {
              interestValue: value,
            })}
          </ThemedTextV2>
        )}
        value={interestRate}
        suffix="%"
      />
      {!disabled && (
        <LoanActionButton
          label={translate("screens/LoanCard", "Borrow")}
          iconLeft={() => (
            <ThemedIcon
              size={16}
              name="arrow-down-circle"
              iconType="Feather"
              dark={tailwind("text-mono-dark-v2-900")}
              light={tailwind("text-mono-light-v2-900")}
              style={tailwind("mr-1")}
            />
          )}
          onPress={onPress}
          style={tailwind("mt-3")}
          testID="test"
        />
      )}
    </ThemedViewV2>
  );
}