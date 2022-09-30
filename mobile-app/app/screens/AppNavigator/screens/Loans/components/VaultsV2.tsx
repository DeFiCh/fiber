import { tailwind } from "@tailwind";
import {
  ThemedIcon,
  ThemedScrollViewV2,
  ThemedTextV2,
  ThemedTouchableOpacityV2,
} from "@components/themed";
import { VaultCard } from "@screens/AppNavigator/screens/Loans/components/VaultCard";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  fetchCollateralTokens,
  fetchVaults,
  LoanVault,
  vaultsSelector,
} from "@store/loans";
import { useWhaleApiClient } from "@shared-contexts/WhaleContext";
import { useWalletContext } from "@shared-contexts/WalletContext";
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { useAppDispatch } from "@hooks/useAppDispatch";
import {
  SkeletonLoader,
  SkeletonLoaderScreen,
} from "@components/SkeletonLoader";
import { SearchInputV2 } from "@components/SearchInputV2";
import { translate } from "@translations";
import { TextInput, View } from "react-native";
import { useDebounce } from "@hooks/useDebounce";
import { useThemeContext } from "@shared-contexts/ThemeProvider";
import { LoanParamList } from "@screens/AppNavigator/screens/Loans/LoansNavigator";
import { EmptyVaultV2 } from "./EmptyVaultV2";

interface VaultsProps {
  scrollRef?: React.Ref<any>;
}

export function VaultsV2(props: VaultsProps): JSX.Element {
  const dispatch = useAppDispatch();
  const client = useWhaleApiClient();
  const isFocused = useIsFocused();
  const { address } = useWalletContext();
  const { isLight } = useThemeContext();
  const navigation = useNavigation<NavigationProp<LoanParamList>>();
  const blockCount = useSelector((state: RootState) => state.block.count);
  const vaults = useSelector((state: RootState) => vaultsSelector(state.loans));
  const { hasFetchedVaultsData } = useSelector(
    (state: RootState) => state.loans
  );

  const [searchString, setSearchString] = useState("");
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  const debouncedSearchTerm = useDebounce(searchString, 250);
  const searchRef = useRef<TextInput>();

  useEffect(() => {
    if (isFocused) {
      dispatch(
        fetchVaults({
          address,
          client,
        })
      );
    }
  }, [blockCount, address, isFocused]);

  useEffect(() => {
    dispatch(fetchCollateralTokens({ client }));
  }, []);

  const filteredTokensWithBalance = useMemo(() => {
    return filterVaultsBySearchTerm(vaults, debouncedSearchTerm, isSearchFocus);
  }, [vaults, debouncedSearchTerm, isSearchFocus]);

  const inSearchMode = useMemo(() => {
    return isSearchFocus || debouncedSearchTerm !== "";
  }, [isSearchFocus, debouncedSearchTerm]);

  if (!hasFetchedVaultsData) {
    return (
      <View style={tailwind("mt-1")}>
        <SkeletonLoader row={3} screen={SkeletonLoaderScreen.Vault} />
      </View>
    );
  } else if (vaults?.length === 0) {
    return <EmptyVaultV2 handleRefresh={() => {}} isLoading={false} />;
  }

  return (
    <ThemedScrollViewV2
      contentContainerStyle={tailwind("px-5 py-8 w-full")}
      ref={props.scrollRef}
    >
      <View style={tailwind("flex-col w-full")}>
        <View style={tailwind("flex-row flex w-full mb-4 items-center")}>
          <SearchInputV2
            ref={searchRef}
            value={searchString}
            showClearButton={debouncedSearchTerm !== ""}
            placeholder={translate("screens/LoansScreen", "Search vault")}
            containerStyle={tailwind("flex-1", [
              "border-0.5",
              isSearchFocus
                ? {
                    "border-mono-light-v2-800": isLight,
                    "border-mono-dark-v2-800": !isLight,
                  }
                : {
                    "border-mono-light-v2-00": isLight,
                    "border-mono-dark-v2-00": !isLight,
                  },
            ])}
            onClearInput={() => {
              setSearchString("");
              searchRef?.current?.focus();
            }}
            onChangeText={(text: string) => {
              setSearchString(text);
            }}
            onFocus={() => {
              setIsSearchFocus(true);
            }}
            onBlur={() => {
              setIsSearchFocus(false);
            }}
          />
          {!inSearchMode && (
            <CreateVaultButton
              onPress={() =>
                navigation.navigate({
                  name: "CreateVaultScreen",
                  params: {},
                  merge: true,
                })
              }
            />
          )}
        </View>
        {inSearchMode && (
          <ThemedTextV2
            style={tailwind("text-xs pl-5 my-4 font-normal-v2")}
            light={tailwind("text-mono-light-v2-700")}
            dark={tailwind("text-mono-dark-v2-700")}
            testID="empty_search_result_text"
          >
            {debouncedSearchTerm.trim() === ""
              ? translate(
                  "screens/LoansScreen",
                  "Search with vault ID or tokens"
                )
              : translate(
                  "screens/LoansScreen",
                  "Search results for “{{searchTerm}}”",
                  { searchTerm: debouncedSearchTerm }
                )}
          </ThemedTextV2>
        )}
      </View>

      {filteredTokensWithBalance.map((vault, index) => {
        return (
          <VaultCard testID={`vault_card_${index}`} key={index} vault={vault} />
        );
      })}
    </ThemedScrollViewV2>
  );
}

function CreateVaultButton(props: { onPress: () => void }): JSX.Element {
  return (
    <ThemedTouchableOpacityV2
      style={tailwind(
        "w-10 h-10 ml-3 rounded-full items-center justify-center"
      )}
      light={tailwind("bg-mono-light-v2-900")}
      dark={tailwind("bg-mono-dark-v2-900")}
      onPress={props.onPress}
      testID="button_create_vault"
    >
      <ThemedIcon
        iconType="Feather"
        name="plus"
        size={24}
        light={tailwind("text-mono-light-v2-00")}
        dark={tailwind("text-mono-dark-v2-00")}
      />
    </ThemedTouchableOpacityV2>
  );
}

function filterVaultsBySearchTerm(
  vaults: LoanVault[],
  searchTerm: string,
  isFocused: boolean
): LoanVault[] {
  if (searchTerm === "") {
    return isFocused ? [] : vaults;
  }
  return vaults.filter((t) => {
    // TODO: Add tokens search in next release
    // const vault = t as LoanVaultActive;
    // const symbols =
    //   vault.collateralAmounts !== undefined
    //     ? vault.collateralAmounts.map((value) => value.displaySymbol)
    //     : [];
    return [t.vaultId].some((searchItem) =>
      searchItem.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  });
}