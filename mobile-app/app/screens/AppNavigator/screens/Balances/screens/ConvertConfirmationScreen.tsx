import { ThemedIcon, ThemedScrollView, ThemedSectionTitle, ThemedText } from '@components/themed'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import BigNumber from 'bignumber.js'
import React, { Dispatch, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Logging } from '@api'
import { SubmitButtonGroup } from '@components/SubmitButtonGroup'
import { SummaryTitle } from '@components/SummaryTitle'
import { RootState } from '@store'
import { hasTxQueued as hasBroadcastQueued } from '@store/ocean'
import { hasTxQueued, transactionQueue } from '@store/transaction_queue'
import { tailwind } from '@tailwind'
import { translate } from '@translations'
import { BalanceParamList } from '../BalancesNavigator'
import { ConversionMode } from './ConvertScreen'
import { EstimatedFeeInfo } from '@components/EstimatedFeeInfo'
import { TextRow } from '@components/TextRow'
import { NumberRow } from '@components/NumberRow'
import { onTransactionBroadcast } from '@api/transaction/transaction_commands'
import { dfiConversionCrafter } from '@api/transaction/dfi_converter'

type Props = StackScreenProps<BalanceParamList, 'ConvertConfirmationScreen'>

export function ConvertConfirmationScreen ({ route }: Props): JSX.Element {
  const {
    sourceUnit,
    sourceBalance,
    targetUnit,
    targetBalance,
    mode,
    amount,
    fee
  } = route.params
  const hasPendingJob = useSelector((state: RootState) => hasTxQueued(state.transactionQueue))
  const hasPendingBroadcastJob = useSelector((state: RootState) => hasBroadcastQueued(state.ocean))
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigation = useNavigation<NavigationProp<BalanceParamList>>()
  const [isOnPage, setIsOnPage] = useState<boolean>(true)

  useEffect(() => {
    setIsOnPage(true)
    return () => {
      setIsOnPage(false)
    }
  }, [])

  async function onSubmit (): Promise<void> {
    if (hasPendingJob || hasPendingBroadcastJob) {
      return
    }
    setIsSubmitting(true)
    await constructSignedConversionAndSend({
      mode,
      amount
    }, dispatch, () => {
      onTransactionBroadcast(isOnPage, navigation.dispatch)
    })
    setIsSubmitting(false)
  }

  function onCancel (): void {
    if (!isSubmitting) {
      navigation.navigate({
        name: 'Convert',
        params: {
          mode
        },
        merge: true
      })
    }
  }

  return (
    <ThemedScrollView style={tailwind('pb-4')}>
      <SummaryTitle
        amount={amount}
        suffix={mode === 'utxosToAccount' ? 'DFI (UTXO)' : 'DFI (Token)'}
        suffixType='component'
        testID='text_convert_amount'
        title={translate('screens/ConvertConfirmScreen', 'You are converting')}
      >
        <ThemedText
          light={tailwind('text-gray-500')}
          dark={tailwind('text-gray-400')}
          style={tailwind('text-sm')}
          testID='convert_amount_source_suffix'
        >
          {sourceUnit}
        </ThemedText>
        <ThemedIcon iconType='MaterialIcons' name='arrow-right-alt' size={24} style={tailwind('px-1')} />
        <ThemedText
          light={tailwind('text-gray-500')}
          dark={tailwind('text-gray-400')}
          style={tailwind('text-sm')}
          testID='convert_amount_target_suffix'
        >
          {targetUnit}
        </ThemedText>
      </SummaryTitle>

      <ThemedSectionTitle
        testID='title_conversion_transaction_detail'
        text={translate('screens/ConvertConfirmScreen', 'TRANSACTION DETAILS')}
      />

      <TextRow
        lhs={translate('screens/ConvertConfirmScreen', 'Transaction type')}
        rhs={{
          value: translate('screens/ConvertConfirmScreen', 'Convert'),
          testID: 'transaction_type'
        }}
        textStyle={tailwind('text-sm font-normal')}
      />

      <NumberRow
        lhs={translate('screens/ConvertConfirmScreen', '{{token}} to receive', { token: targetUnit })}
        rhs={{
          value: amount.toFixed(8),
          testID: 'token_to_receive_amount'
        }}
      />

      <EstimatedFeeInfo
        lhs={translate('screens/ConvertConfirmScreen', 'Estimated fee')}
        rhs={{
          value: fee.toFixed(8),
          testID: 'text_fee',
          suffix: 'DFI (UTXO)'
        }}
      />

      <ThemedSectionTitle
        testID='title_conversion_detail'
        text={translate('screens/ConvertConfirmScreen', 'AFTER CONVERSION, YOU WILL HAVE')}
      />

      <NumberRow
        lhs={translate('screens/ConvertConfirmScreen', sourceUnit)}
        rhs={{
          value: sourceBalance.toFixed(8),
          testID: 'source_amount'
        }}
      />
      <NumberRow
        lhs={translate('screens/ConvertConfirmScreen', targetUnit)}
        rhs={{
          value: targetBalance.toFixed(8),
          testID: 'target_amount'
        }}
      />

      <SubmitButtonGroup
        isDisabled={isSubmitting || hasPendingJob || hasPendingBroadcastJob}
        label={translate('screens/ConvertConfirmScreen', 'CONFIRM TRANSACTION')}
        isSubmitting={isSubmitting || hasPendingJob || hasPendingBroadcastJob}
        submittingLabel={translate('screens/ConvertConfirmScreen', 'CONVERTING')}
        onCancel={onCancel}
        onSubmit={onSubmit}
        title='convert'
      />
    </ThemedScrollView>
  )
}

async function constructSignedConversionAndSend ({
  mode,
  amount
}: { mode: ConversionMode, amount: BigNumber }, dispatch: Dispatch<any>, onBroadcast: () => void): Promise<void> {
  try {
    dispatch(transactionQueue.actions.push(dfiConversionCrafter(amount, mode, onBroadcast)))
  } catch (e) {
    Logging.error(e)
  }
}
