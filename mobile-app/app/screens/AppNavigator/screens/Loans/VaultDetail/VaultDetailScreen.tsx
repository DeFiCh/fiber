import { View } from '@components'
import { ThemedIcon, ThemedScrollView, ThemedText, ThemedView } from '@components/themed'
import { StackScreenProps } from '@react-navigation/stack'
import { tailwind } from '@tailwind'
import { translate } from '@translations'
import React, { useEffect, useState } from 'react'
import { LoanParamList } from '../LoansNavigator'
import { TouchableOpacity } from 'react-native'
import { ScrollableButton, ScrollButton } from '../components/ScrollableButton'
import { VaultDetailTabSection } from './components/VaultDetailTabSection'
import { LoanVault } from '@store/loans'
import { useSelector } from 'react-redux'
import { RootState } from '@store'
import { LoanVaultState } from '@defichain/whale-api-client/dist/api/loan'
import { VaultSectionTextRow } from '../components/VaultSectionTextRow'
import BigNumber from 'bignumber.js'
import { useDeFiScanContext } from '@shared-contexts/DeFiScanContext'
import { openURL } from '@api/linking'
import { useVaultStatus, VaultStatusTag } from '@screens/AppNavigator/screens/Loans/components/VaultStatusTag'

type Props = StackScreenProps<LoanParamList, 'VaultDetailScreen'>

export function VaultDetailScreen ({
  route,
  navigation
}: Props): JSX.Element {
  const { vaultId } = route.params
  const [vault, setVault] = useState<LoanVault>()
  const vaults = useSelector((state: RootState) => state.loans.vaults)
  const vaultActionButtons: ScrollButton[] = [
    {
      label: 'EDIT COLLATERAL',
      disabled: vault?.state === LoanVaultState.IN_LIQUIDATION,
      handleOnPress: () => {
        if (vault === undefined) {
          return
        }

        navigation.navigate({
          name: 'EditCollateralScreen',
          params: {
            vaultId: vault.vaultId
          },
          merge: true
        })
      }
    }
  ]

  useEffect(() => {
    const _vault = vaults.find(v => v.vaultId === vaultId)
    if (_vault !== undefined) {
      setVault(_vault)
    }
  }, [vaults])

  if (vault === undefined) {
    return <></>
  }

  return (
    <ThemedScrollView
      light={tailwind('bg-gray-100')}
      dark={tailwind('bg-gray-900')}
    >
      <ThemedView
        light={tailwind('bg-white')}
        dark={tailwind('bg-gray-800')}
      >
        <View style={tailwind('p-4')}>
          <VaultIdSection vault={vault} />
          <VaultInfoSection vault={vault} />
        </View>
        <ThemedView
          light={tailwind('border-gray-200')}
          dark={tailwind('border-gray-700')}
          style={tailwind('pb-4 border-b')}
        >
          <ScrollableButton buttons={vaultActionButtons} containerStyle={tailwind('pl-4')} />
        </ThemedView>
      </ThemedView>
      <VaultDetailTabSection vault={vault} />
    </ThemedScrollView>
  )
}

function VaultIdSection ({ vault }: { vault: LoanVault }): JSX.Element {
  const { getVaultsUrl } = useDeFiScanContext()
  const colRatio = vault.state === LoanVaultState.IN_LIQUIDATION ? 0 : vault.collateralRatio
  const totalLoanAmount = vault.state === LoanVaultState.IN_LIQUIDATION ? 0 : vault.loanValue
  const vaultState = useVaultStatus(vault.state, new BigNumber(colRatio), new BigNumber(vault.loanScheme.minColRatio), new BigNumber((totalLoanAmount)))
  return (
    <ThemedView
      light={tailwind('bg-white')}
      dark={tailwind('bg-gray-800')}
      style={tailwind('flex flex-row items-center')}
    >
      <View
        style={tailwind('flex flex-1')}
      >
        <View style={tailwind('flex flex-row mb-2 items-center')}>
          <ThemedText
            light={tailwind('text-gray-400')}
            dark={tailwind('text-gray-500')}
            style={tailwind('text-xs mr-1')}
          >
            {translate('screens/VaultDetailScreen', 'Vault ID')}
          </ThemedText>
          <VaultStatusTag status={vaultState} />
        </View>
        <View
          style={tailwind('flex flex-row mb-2 items-center')}
        >
          <ThemedText
            style={tailwind('text-sm font-semibold w-8/12 flex-1 mr-2')}
          >
            {vault.vaultId}
          </ThemedText>
          <TouchableOpacity onPress={async () => await openURL(getVaultsUrl(vault.vaultId ?? ''))}>
            <ThemedIcon
              dark={tailwind('text-darkprimary-500')}
              iconType='MaterialIcons'
              light={tailwind('text-primary-500')}
              name='open-in-new'
              size={22}
              style={tailwind('-mr-1')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  )
}

function VaultInfoSection (props: { vault?: LoanVault }): JSX.Element | null {
  if (props.vault === undefined) {
    return null
  }

  if (props.vault.state === LoanVaultState.IN_LIQUIDATION) {
    return (
      <View style={tailwind('flex -mb-2')}>
        <VaultSectionTextRow
          value={props.vault.batchCount}
          lhs={translate('screens/VaultDetailScreen', 'Auction batches')}
          testID='text_auction_batches'
        />
      </View>
    )
  }

  return (
    <View style={tailwind('flex -mb-2')}>
      {props.vault.state === LoanVaultState.ACTIVE && props.vault.collateralValue === '0' && props.vault.loanValue === '0'
        ? (
          <>
            <VaultSectionTextRow
              value={props.vault.loanScheme.minColRatio}
              lhs={translate('screens/VaultDetailScreen', 'Min. collateralization ratio')}
              testID='text_min_col_ratio'
              suffixType='text'
              suffix='%'
            />
            <VaultSectionTextRow
              value={props.vault.loanScheme.interestRate}
              lhs={translate('screens/VaultDetailScreen', 'Vault interest (APR)')}
              testID='text_vault_interest'
              suffixType='text'
              suffix='%'
            />
          </>
        )
        : (
          <>
            <VaultSectionTextRow
              value={new BigNumber(props.vault.collateralValue).toFixed(2)}
              lhs={translate('screens/VaultDetailScreen', 'Total collateral (USD)')}
              testID='text_total_collateral_value'
              prefix='$'
            />
            <VaultSectionTextRow
              value={props.vault.loanValue}
              lhs={translate('screens/VaultDetailScreen', 'Total loan (USD)')}
              testID='text_total_loan_value'
              prefix='$'
            />
            <VaultSectionTextRow
              value={props.vault.loanScheme.interestRate}
              lhs={translate('screens/VaultDetailScreen', 'Vault interest (APR)')}
              testID='text_vault_interest'
              suffixType='text'
              suffix='%'
            />
          </>
        )}

    </View>
  )
}
