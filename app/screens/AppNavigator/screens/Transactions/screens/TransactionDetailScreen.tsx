import { StackScreenProps } from '@react-navigation/stack'
import * as React from 'react'
import { Linking, View } from 'react-native'
import {
  ThemedIcon,
  ThemedScrollView,
  ThemedText,
  ThemedTouchableOpacity,
  ThemedView
} from '../../../../../components/themed'
import { useDeFiScanContext } from '../../../../../contexts/DeFiScanContext'
import { tailwind } from '../../../../../tailwind'
import { translate } from '../../../../../translations'
import { TransactionsParamList } from '../TransactionsNavigator'
import { formatBlockTime } from '../TransactionsScreen'

type Props = StackScreenProps<TransactionsParamList, 'TransactionDetailScreen'>

export function TransactionDetailScreen (props: Props): JSX.Element {
  const { tx } = props.route.params
  const { getTransactionUrl } = useDeFiScanContext()

  const RenderRow = (lhs: string, rhs: string): JSX.Element => {
    return (
      <ThemedScrollView testID={`transaction-detail-${lhs.toLowerCase()}`}>
        <ThemedView
          light='bg-white border-b border-gray-200'
          dark='bg-gray-800 border-b border-gray-700'
          style={tailwind('p-2 flex-row items-center w-full p-4 mt-4')}
        >
          <View style={tailwind('w-1/2 flex-1')}>
            <ThemedText style={tailwind('font-medium')}>{lhs}</ThemedText>
          </View>
          <View style={tailwind('w-1/2 flex-1')}>
            <ThemedText style={tailwind('font-medium text-right')}>{rhs}</ThemedText>
          </View>
        </ThemedView>
      </ThemedScrollView>
    )
  }

  const onTxidUrlPressed = React.useCallback(async () => {
    const url = getTransactionUrl(tx.txid)
    await Linking.openURL(url)
  }, [])

  return (
    <View>
      {RenderRow('Type', translate('screens/TransactionDetailScreen', tx.desc))}
      {/* TODO(@ivan-zynesis): handle different transaction type other than sent/receive */}
      {RenderRow('Amount', translate('screens/TransactionDetailScreen', tx.amount))}
      {RenderRow('Block', translate('screens/TransactionDetailScreen', `${tx.block}`))}
      {RenderRow('Date', translate('screens/TransactionDetailScreen', `${formatBlockTime(tx.medianTime)}`))}
      <ThemedTouchableOpacity
        testID='transaction-detail-explorer-url'
        style={tailwind('p-2 flex-row items-center w-full p-4 mt-4')}
        onPress={onTxidUrlPressed}
      >
        <View style={tailwind('flex-1 flex-row flex-initial')}>
          <View style={tailwind('flex-1')}>
            <ThemedText light='text-primary-500' dark='text-darkprimary-500' style={tailwind('font-medium text-sm')}>
              {tx.txid}
            </ThemedText>
          </View>
          <View style={tailwind('ml-2 flex-grow-0 justify-center')}>
            <ThemedIcon
              iconType='MaterialIcons' light='text-primary-500' dark='text-darkprimary-500' name='open-in-new'
              size={24}
            />
          </View>
        </View>
      </ThemedTouchableOpacity>
    </View>
  )
}
