import { ThemedScrollView, ThemedSectionTitle, ThemedText, ThemedView } from '@components/themed'
import { LoanScheme, LoanVaultActive } from '@defichain/whale-api-client/dist/api/loan'
import { tailwind } from '@tailwind'
import { translate } from '@translations'
import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useCollateralizationRatioColor } from '../hooks/CollateralizationRatio'
import { View } from '@components'
import { VaultSectionTextRow } from '../components/VaultSectionTextRow'
import { StackScreenProps } from '@react-navigation/stack'
import { LoanParamList } from '../LoansNavigator'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@store'
import { LoanSchemeOptions, WalletLoanScheme } from '../components/LoanSchemeOptions'
import { ascColRatioLoanScheme } from '@store/loans'
import { Button } from '@components/Button'
import { hasTxQueued } from '@store/transaction_queue'
import { hasTxQueued as hasBroadcastQueued } from '@store/ocean'
import { DFITokenSelector, DFIUtxoSelector } from '@store/wallet'
import { useWhaleApiClient } from '@shared-contexts/WhaleContext'
import { useLogger } from '@shared-contexts/NativeLoggingProvider'
import { queueConvertTransaction } from '@hooks/wallet/Conversion'
import { ConversionInfoText } from '@components/ConversionInfoText'

type Props = StackScreenProps<LoanParamList, 'EditLoanSchemeScreen'>

export function EditLoanSchemeScreen ({ route, navigation }: Props): JSX.Element {
  const { vaultId } = route.params
  const { vaults } = useSelector((state: RootState) => state.loans)
  const loanSchemes = useSelector((state: RootState) => ascColRatioLoanScheme(state.loans))
  const [activeVault, setActiveVault] = useState<LoanVaultActive>()
  const [filteredLoanSchemes, setFilteredLoanSchemes] = useState<WalletLoanScheme[]>()
  const [selectedLoanScheme, setSelectedLoanScheme] = useState<LoanScheme>()
  const dispatch = useDispatch()
  const logger = useLogger()

  // Conversion
  const client = useWhaleApiClient()
  const DFIUtxo = useSelector((state: RootState) => DFIUtxoSelector(state.wallet))
  const DFIToken = useSelector((state: RootState) => DFITokenSelector(state.wallet))
  const [fee, setFee] = useState<BigNumber>(new BigNumber(0.0001))
  const isConversionRequired = new BigNumber(fee).gt(DFIUtxo.amount)

  // Continue button
  const hasPendingJob = useSelector((state: RootState) => hasTxQueued(state.transactionQueue))
  const hasPendingBroadcastJob = useSelector((state: RootState) => hasBroadcastQueued(state.ocean))
  const onSubmit = (): void => {
    if (selectedLoanScheme === undefined || activeVault === undefined || hasPendingJob || hasPendingBroadcastJob) {
      return
    }

    if (isConversionRequired) {
      queueConvertTransaction({
        mode: 'accountToUtxos',
        amount: new BigNumber(fee).minus(DFIUtxo.amount)
      }, dispatch, () => {
        navigation.navigate({
          name: 'ConfirmEditLoanSchemeScreen',
          params: {
            vault: activeVault,
            loanScheme: selectedLoanScheme,
            fee: fee,
            conversion: {
              DFIUtxo,
              DFIToken,
              isConversionRequired,
              conversionAmount: new BigNumber(2).minus(DFIUtxo.amount)
            }
          }
        })
      }, logger)
    } else {
      navigation.navigate({
        name: 'ConfirmEditLoanSchemeScreen',
        params: {
          vault: activeVault,
          loanScheme: selectedLoanScheme,
          fee: fee
        }
      })
    }
  }

  useEffect(() => {
    const v = vaults.find((v) => v.vaultId === vaultId) as LoanVaultActive
    if (v === undefined) {
      return
    }
    setActiveVault(v)

    const l = loanSchemes.find(l => l.id === v.loanScheme.id)
    if (l === undefined || selectedLoanScheme !== undefined) {
      return
    }

    setSelectedLoanScheme(l)
  }, [vaults, loanSchemes])

  useEffect(() => {
    setFilteredLoanSchemes(loanSchemes.map(scheme => {
      const loanscheme: WalletLoanScheme = {
        disabled: new BigNumber(activeVault?.collateralRatio ?? NaN).isGreaterThan(0) && new BigNumber(activeVault?.collateralRatio ?? NaN).isLessThan(scheme.minColRatio),
        ...scheme
      }
      return loanscheme
    }))
  }, [activeVault])

  useEffect(() => {
    client.fee.estimate()
      .then((f) => setFee(new BigNumber(f)))
      .catch(logger.error)
  }, [])

  if (activeVault === undefined || filteredLoanSchemes === undefined) {
    return <></>
  }

  return (
    <ThemedScrollView
      contentContainerStyle={tailwind('px-4 pt-0 pb-8')}
    >
      <ThemedSectionTitle
        style={tailwind('text-xs pb-2 pt-4 font-medium')}
        text={translate('screens/EditVaultScreen', 'EDIT LOAN SCHEME OF VAULT')}
      />
      <VaultSection vault={activeVault} />
      <ThemedText
        light={tailwind('text-gray-500')}
        dark={tailwind('text-gray-500')}
        style={tailwind('text-xs mb-6')}
      >
        {translate('screens/EditVaultScreen', 'Make sure your collateralization ratio is still above your min. collateralization ratio')}
      </ThemedText>
      <LoanSchemeOptions
        loanSchemes={filteredLoanSchemes}
        selectedLoanScheme={selectedLoanScheme}
        onLoanSchemePress={(scheme: LoanScheme) => setSelectedLoanScheme(scheme)}
      />
      {isConversionRequired &&
        <View style={tailwind('mt-4')}>
          <ConversionInfoText />
        </View>}
      <Button
        disabled={selectedLoanScheme === undefined || selectedLoanScheme.id === activeVault.loanScheme.id || hasPendingJob || hasPendingBroadcastJob}
        label={translate('screens/EditVaultScreen', 'CONTINUE')}
        onPress={onSubmit}
        margin='mt-7 mb-2'
        testID='create_vault_submit_button'
      />
      <ThemedText
        light={tailwind('text-gray-500')}
        dark={tailwind('text-gray-400')}
        style={tailwind('text-center text-xs')}
      >
        {translate('screens/EditVaultScreen', 'Confirm your vault details in next screen')}
      </ThemedText>
    </ThemedScrollView>
  )
}

function VaultSection (props: { vault: LoanVaultActive }): JSX.Element {
  const { vault } = props
  const colRatio = new BigNumber(vault.collateralRatio)
  const minColRatio = new BigNumber(vault.loanScheme.minColRatio)
  const totalLoanValue = new BigNumber(vault.loanValue)
  const colors = useCollateralizationRatioColor({
    colRatio,
    minColRatio,
    totalLoanAmount: totalLoanValue
  })
  return (
    <ThemedView
      light={tailwind('bg-white border-gray-200')}
      dark={tailwind('bg-gray-800 border-gray-700')}
      style={tailwind('flex flex-col items-center border rounded px-4 py-3 mb-2')}
    >
      <View style={tailwind('w-full mb-2')}>
        <ThemedText
          style={tailwind('font-medium')}
          numberOfLines={1}
          ellipsizeMode='middle'
        >
          {vault.vaultId}
        </ThemedText>
      </View>
      <VaultSectionTextRow
        testID='text_total_collateral_value'
        value={new BigNumber(vault.collateralValue ?? 0).toFixed(2)}
        prefix='$'
        lhs={translate('screens/EditCollateralScreen', 'Total collateral (USD)')}
      />
      <VaultSectionTextRow
        testID='text_total_collateral_value' value={new BigNumber(vault.loanValue ?? 0).toFixed(2)}
        prefix='$'
        lhs={translate('screens/EditCollateralScreen', 'Total loans (USD)')}
      />
      <VaultSectionTextRow
        testID='text_total_collateral_value'
        value={BigNumber.maximum(new BigNumber(vault.collateralRatio ?? 0), 0).toFixed(2)}
        suffix='%'
        suffixType='text'
        lhs={translate('screens/EditCollateralScreen', 'Collateralization ratio')}
        rhsThemedProps={colors}
      />
      <VaultSectionTextRow
        testID='text_total_collateral_value'
        value={new BigNumber(vault.loanScheme.minColRatio ?? 0).toFixed(2)} suffix='%'
        suffixType='text'
        lhs={translate('screens/EditCollateralScreen', 'Min. collateral ratio')}
      />
    </ThemedView>
  )
}
