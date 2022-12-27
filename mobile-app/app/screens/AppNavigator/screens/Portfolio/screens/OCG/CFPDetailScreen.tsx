import { useCallback, useState } from "react";
import { translate } from "@translations";
import { ThemedTextV2 } from "@components/themed";
import { tailwind } from "@tailwind";
import { ProposalURLInput } from "@screens/AppNavigator/screens/Portfolio/components/ProposalURLInput";
import { Platform, View } from "react-native";
import { WalletTextInputV2 } from "@components/WalletTextInputV2";
import { ButtonV2 } from "@components/ButtonV2";
import { useNetworkContext, useThemeContext } from "@waveshq/walletkit-ui";
import { BottomSheetInfoV2 } from "@components/BottomSheetInfoV2";
import { LoanAddRemoveActionButton } from "@screens/AppNavigator/screens/Loans/components/LoanActionButton";
import { AddressRow } from "@screens/AppNavigator/screens/Portfolio/screens/SendScreen";
import { useForm } from "react-hook-form";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { PortfolioParamList } from "@screens/AppNavigator/screens/Portfolio/PortfolioNavigator";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BigNumber from "bignumber.js";
import { useConversion } from "@hooks/wallet/Conversion";
import { PROPOSAL_FEE } from "@screens/AppNavigator/screens/Portfolio/screens/OCG/OCGProposalsScreen";

export function CFPDetailScreen(): JSX.Element {
  const { isLight } = useThemeContext();
  const { networkName } = useNetworkContext();
  const { isConversionRequired } = useConversion({
    inputToken: {
      type: "utxo",
      amount: new BigNumber(PROPOSAL_FEE),
    },
  });
  const navigation = useNavigation<NavigationProp<PortfolioParamList>>();
  const [isUrlValid, setUrlValid] = useState<boolean>(false);

  // form
  const {
    control,
    setValue,
    getValues,
    trigger,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
  });

  const [url, setUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [cycle, setCycle] = useState<number>(1);
  const [minCycle, maxCycle] = [1, 100];

  const onAddressSelect = useCallback(
    async (savedAddress: string) => {
      setValue("address", savedAddress, { shouldDirty: true });
      navigation.goBack();
      await trigger("address");
    },
    [navigation]
  );

  function onContinuePress() {
    if (!isButtonEnabled()) {
      return;
    }

    if (isConversionRequired) {
      // todo convert and navigate
    } else {
      // todo navigate
    }
  }

  function isFieldEmpty(value: string | undefined): boolean {
    return value === undefined || value.trim() === "";
  }

  function isButtonEnabled(): boolean {
    return (
      !isFieldEmpty(url) &&
      !isFieldEmpty(title) &&
      !isFieldEmpty(amount) &&
      BigNumber(amount).gte(minCycle) &&
      BigNumber(amount).lte(maxCycle) &&
      cycle > 0 &&
      isValid
    );
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={tailwind("flex-grow px-5 pb-6 justify-between")}
      style={tailwind(
        `${isLight ? "bg-mono-light-v2-100" : "bg-mono-dark-v2-100"}`
      )}
    >
      <View>
        <ProposalURLInput urlValidity={setUrlValid} onChangeUrlInput={setUrl} />
        {isUrlValid && (
          <View style={tailwind("pt-6")}>
            <WalletTextInputV2
              inputType="default"
              multiline
              testID="input_title"
              value={title}
              onChangeText={setTitle}
              title={translate("screens/OCGDetailScreen", "PROPOSAL TITLE")}
              placeholder={translate("screens/OCGDetailScreen", "Title")}
              style={tailwind("w-3/5 flex-grow pb-1 font-normal-v2")}
              inlineText={{
                type: "helper",
                text: translate(
                  "screens/OCGDetailScreen",
                  "Make sure this matches the title from Github."
                ),
                style: tailwind("pl-5 text-mono-light-v2-500", {
                  "text-mono-dark-v2-500": !isLight,
                }),
              }}
            />
            <WalletTextInputV2
              inputType="numeric"
              testID="input_amount"
              value={amount}
              onChangeText={setAmount}
              title={translate(
                "screens/OCGDetailScreen",
                "AMOUNT REQUESTED IN DFI"
              )}
              placeholder={translate("screens/OCGDetailScreen", "0.00 DFI")}
              inputContainerStyle={tailwind("px-5 py-4.5")}
              titleStyle={tailwind("pt-4")}
            />
            <VotingCycles
              cycle={cycle}
              setCycle={setCycle}
              minCycle={minCycle}
              maxCycle={maxCycle}
            />
            <AddressRow
              control={control}
              networkName={networkName}
              title={translate("screens/OCGDetailScreen", "RECEIVING ADDRESS")}
              onContactButtonPress={() =>
                navigation.navigate({
                  name: "AddressBookScreen",
                  params: {
                    selectedAddress: getValues("address"),
                    onAddressSelect,
                  },
                  merge: true,
                })
              }
              onQrButtonPress={() =>
                navigation.navigate({
                  name: "BarCodeScanner",
                  params: {
                    onQrScanned: async (value: any) => {
                      setValue("address", value, { shouldDirty: true });
                      await trigger("address");
                    },
                  },
                  merge: true,
                })
              }
              onClearButtonPress={async () => {
                setValue("address", "");
                await trigger("address");
              }}
              onAddressChange={async (address) => {
                setValue("address", address, { shouldDirty: true });
                await trigger("address");
              }}
            />
          </View>
        )}
      </View>
      <View style={tailwind("justify-center pt-6")}>
        <ThemedTextV2
          style={tailwind("font-normal-v2 text-sm px-12 text-center")}
          light={tailwind("text-mono-light-v2-500")}
          dark={tailwind("text-mono-dark-v2-500")}
        >
          {translate(
            "screens/OCGDetailScreen",
            "Review full proposal details in the next screen"
          )}
        </ThemedTextV2>
        <ButtonV2
          label={translate("screens/OCGDetailScreen", "Continue")}
          styleProps="mt-5 mx-7"
          testID="proposal_continue_button"
          onPress={onContinuePress}
          disabled={!isButtonEnabled()}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

function VotingCycles({
  cycle,
  setCycle,
  minCycle,
  maxCycle,
}: {
  cycle: number;
  setCycle: (cycle: number) => void;
  minCycle: number;
  maxCycle: number;
}): JSX.Element {
  return (
    <View>
      <View
        style={tailwind("flex-row items-center justify-start pt-4 pl-5 pb-2")}
      >
        <ThemedTextV2
          style={tailwind("text-xs font-normal-v2")}
          light={tailwind("text-mono-light-v2-500")}
          dark={tailwind("text-mono-dark-v2-500")}
        >
          {translate("screens/OCGDetailScreen", "CYCLES")}
        </ThemedTextV2>
        <View
          style={tailwind("ml-1", {
            "mt-0.5": Platform.OS === "android",
          })}
        >
          <BottomSheetInfoV2
            alertInfo={{
              title: translate("screens/OCGDetailScreen", "Voting Cycles"),
              message: translate(
                "screens/OCGDetailScreen",
                "Explain here what voting cycles are and what is it for the users."
              ),
            }}
            name="voting_cycles"
            infoIconStyle={{
              light: tailwind("text-mono-light-v2-500"),
              dark: tailwind("text-mono-dark-v2-500"),
            }}
          />
        </View>
      </View>
      <WalletTextInputV2
        inputType="number-pad"
        inputContainerStyle={tailwind("pl-5 pr-4 py-2.5")}
        value={cycle.toString()}
        onChangeText={(text: string) => setCycle(Number(text))}
        valid={cycle >= minCycle && cycle <= maxCycle}
        inlineText={{
          type: "error",
          text: translate(
            "screens/OCGDetailScreen",
            "Cycles should be 1-100 only"
          ),
          style: tailwind("pl-5"),
        }}
      >
        <LoanAddRemoveActionButton
          token="cycle"
          onAdd={() => setCycle(Math.min(cycle + 1, maxCycle))}
          onRemove={() => setCycle(Math.max(cycle - 1, minCycle))}
          leftDisabled={cycle <= minCycle}
          rightDisabled={cycle >= maxCycle}
        />
      </WalletTextInputV2>
    </View>
  );
}
