import BigNumber from 'bignumber.js'
import { WalletToken } from '@store/wallet'
import React from 'react'
import { ConversionMode } from '@api/transaction/dfi_converter'
import { ThemedSectionTitle, ThemedText } from './themed'
import { translate } from '@translations'
import { NumberRow } from './NumberRow'
import { TextRow } from './TextRow'
import { tailwind } from '@tailwind'

interface ConversionBreakdownProps {
  dfiUtxo?: WalletToken
  dfiToken?: WalletToken
  amount?: BigNumber
  mode: ConversionMode
}

export function ConversionBreakdown (props: ConversionBreakdownProps): JSX.Element {
  const {
    amount = new BigNumber(0)
  } = props
  const conversionType = props.mode === 'accountToUtxos' ? 'Token → UTXO' : 'UTXO → Token'
  return (
    <>
      <ThemedSectionTitle
        testID='title_conversion_detail'
        text={translate('components/ConversionBreakdown', 'CONVERSION DETAILS')}
      />
      <TextRow
        lhs={translate('screens/ConversionBreakdown', 'Conversion type')}
        rhs={{
          value: conversionType,
          testID: 'conversion_type'
        }}
        textStyle={tailwind('text-sm font-normal')}
      />
      <NumberRow
        lhs={translate('components/ConversionBreakdown', 'Amount to convert')}
        rhs={{
          value: props.amount?.toFixed(8) ?? 0,
          testID: 'text_amount'
        }}
      />
      <NumberRow
        lhs={translate('components/ConversionBreakdown', 'Resulting UTXO')}
        rhs={{
          value: new BigNumber(props.dfiUtxo?.amount ?? 0).plus(props.mode === 'accountToUtxos' ? amount : amount.negated()).toFixed(8),
          testID: 'text_amount'
        }}
      />
      <NumberRow
        lhs={translate('components/ConversionBreakdown', 'Resulting Tokens')}
        rhs={{
          value: new BigNumber(props.dfiToken?.amount ?? 0).plus(props.mode === 'utxosToAccount' ? amount : amount.negated()).toFixed(8),
          testID: 'text_amount'
        }}
      />
      <ThemedText
        light={tailwind('text-gray-600')}
        dark={tailwind('text-gray-300')}
        style={tailwind('mt-2 mx-4 text-sm')}
      >
        {translate('components/ConversionBreakdown', 'Amount above are prior to transaction')}
      </ThemedText>
    </>
  )
}
