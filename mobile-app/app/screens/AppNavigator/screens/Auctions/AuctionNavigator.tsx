import { createStackNavigator } from "@react-navigation/stack";
import { HeaderTitle } from "@components/HeaderTitle";
import { translate } from "@translations";
import BigNumber from "bignumber.js";
import {
  LoanVaultLiquidated,
  LoanVaultLiquidationBatch,
} from "@defichain/whale-api-client/dist/api/loan";
import { HeaderNetworkStatus } from "@components/HeaderNetworkStatus";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useNavigatorScreenOptions } from "@hooks/useNavigatorScreenOptions";
import { tailwind } from "@tailwind";
import { ThemedTextV2 } from "@components/themed";
import { StyleProp, ViewStyle } from "react-native";
import { NetworkDetails } from "../Settings/screens/NetworkDetails";
import { AuctionsScreen } from "./AuctionScreen";
import { AuctionDetailScreen } from "./screens/AuctionDetailScreen";
import { PlaceBidScreen } from "./screens/PlaceBidScreen";
import { ConfirmPlaceBidScreen } from "./screens/ConfirmPlaceBidScreen";
import { AuctionsFaq } from "./screens/AuctionsFaq";
import { NetworkSelectionScreen } from "../Settings/screens/NetworkSelectionScreen";

export interface AuctionsParamList {
  AuctionsScreen: {};
  AuctionDetailScreen: {
    batch: LoanVaultLiquidationBatch;
    vault: LoanVaultLiquidated;
  };
  PlaceBidScreen: {
    batch: LoanVaultLiquidationBatch;
    vault: LoanVaultLiquidated;
  };
  ConfirmPlaceBidScreen: {
    batch: LoanVaultLiquidationBatch;
    vault: LoanVaultLiquidated;
    bidAmount: BigNumber;
    estimatedFees: BigNumber;
    totalAuctionValue: string;
  };
  [key: string]: undefined | object;
}

const AuctionsStack = createStackNavigator<AuctionsParamList>();

export function AuctionsNavigator(): JSX.Element {
  const headerContainerTestId = "auctions_header_container";
  const navigation = useNavigation<NavigationProp<AuctionsParamList>>();

  const screenOptions = useNavigatorScreenOptions();
  const goToNetworkSelect = (): void => {
    navigation.navigate("NetworkSelectionScreen");
  };
  return (
    <AuctionsStack.Navigator
      initialRouteName="AuctionsScreen"
      screenOptions={{
        ...screenOptions,
        headerRight: () => (
          <HeaderNetworkStatus
            onPress={goToNetworkSelect}
            testID="header_change_network"
          />
        ),
      }}
    >
      <AuctionsStack.Screen
        component={AuctionsScreen}
        name="AuctionScreen"
        options={{
          headerTitleAlign: "left",
          headerTitleContainerStyle: tailwind("ml-5"),
          headerLeftContainerStyle: null,
          headerTitle: () => (
            <ThemedTextV2
              style={[
                screenOptions.headerTitleStyle as Array<StyleProp<ViewStyle>>,
                tailwind("text-left text-3xl font-semibold-v2"),
                { fontSize: 28 },
              ]}
            >
              {translate("screens/AuctionScreen", "Auctions")}
            </ThemedTextV2>
          ),
        }}
      />

      <AuctionsStack.Screen
        component={AuctionDetailScreen}
        name="AuctionDetailScreen"
        options={{
          headerTitle: () => (
            <HeaderTitle
              text={translate("screens/AuctionScreen", "Auction details")}
              containerTestID={headerContainerTestId}
            />
          ),
        }}
      />

      <AuctionsStack.Screen
        component={NetworkSelectionScreen}
        name="NetworkSelectionScreen"
        options={{
          headerTitle: translate("screens/NetworkSelectionScreen", "Network"),
          headerRight: undefined,
        }}
      />

      <AuctionsStack.Screen
        component={NetworkDetails}
        name="NetworkDetails"
        options={{
          headerTitle: translate("screens/NetworkDetails", "Wallet Network"),
          headerBackTitleVisible: false,
          headerBackTestID: "network_details_header_back",
        }}
      />

      <AuctionsStack.Screen
        component={PlaceBidScreen}
        name="PlaceBidScreen"
        options={{
          headerTitle: () => (
            <HeaderTitle
              text={translate("screens/AuctionScreen", "Bid")}
              containerTestID={headerContainerTestId}
            />
          ),
        }}
      />

      <AuctionsStack.Screen
        component={AuctionsFaq}
        name="AuctionsFaq"
        options={{
          headerTitle: () => (
            <HeaderTitle
              text={translate("components/AuctionsFaq", "Auctions FAQ")}
              containerTestID={headerContainerTestId}
            />
          ),
          headerBackTitleVisible: false,
        }}
      />

      <AuctionsStack.Screen
        component={ConfirmPlaceBidScreen}
        name="ConfirmPlaceBidScreen"
        options={{
          headerTitle: () => (
            <HeaderTitle
              text={translate("screens/AuctionScreen", "Confirm Place Bid")}
              containerTestID={headerContainerTestId}
            />
          ),
        }}
      />
    </AuctionsStack.Navigator>
  );
}
