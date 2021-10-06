import { useThemeContext } from '@contexts/ThemeProvider'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { BalanceParamList } from '@screens/AppNavigator/screens/Balances/BalancesNavigator'
import { WalletToken } from '@store/wallet'
import { tailwind } from '@tailwind'
import { translate } from '@translations'
import BigNumber from 'bignumber.js'
import React from 'react'
import { ImageBackground, TouchableOpacity } from 'react-native'
import DFIBackground from '@assets/images/DFI_balance_background.png'
import DFIBackgroundDark from '@assets/images/DFI_balance_background_dark.png'
import { IconButton } from '@components/IconButton'
import { ThemedView, ThemedText, ThemedIcon } from '@components/themed'
import { View } from '@components'
import { getNativeIcon } from '@components/icons/assets'
import NumberFormat from 'react-number-format'

interface DFIBalanceCardProps {
  utxo: WalletToken
  token: WalletToken
}

export function DFIBalanceCard (props: DFIBalanceCardProps): JSX.Element {
  const DFIIcon = getNativeIcon('_UTXO')
  const { isLight } = useThemeContext()
  const totalDFI = new BigNumber(props.utxo.amount).plus(new BigNumber(props.token.amount)).toFixed(8)
  const navigation = useNavigation<NavigationProp<BalanceParamList>>()

  return (
    <ThemedView
      light={tailwind('bg-white border-gray-100')}
      dark={tailwind('bg-gray-800')}
      style={tailwind('mx-2 mt-4 rounded-lg flex-1')}
      testID='dfi_balance_card'
    >
      <ImageBackground
        source={isLight ? DFIBackground : DFIBackgroundDark}
        style={tailwind('flex-1 rounded-lg overflow-hidden')}
        resizeMode='cover'
        resizeMethod='scale'
      >
        <View style={tailwind('flex-col flex-1 mx-4 mt-5 mb-4')}>
          <View style={tailwind('flex-row pb-3 items-center')}>
            <DFIIcon width={24} height={24} style={tailwind('mr-2')} />
            <ThemedText style={tailwind('pr-9 text-lg font-bold')} testID='total_dfi_label'>DFI</ThemedText>
            <NumberFormat
              value={totalDFI}
              thousandSeparator
              decimalScale={8}
              displayType='text'
              renderText={value =>
                <ThemedText testID='total_dfi_amount'>{value} DFI</ThemedText>}
            />
          </View>

          <View style={tailwind('flex-row pb-1.5')}>
            <ThemedText
              light={tailwind('text-gray-500')}
              dark={tailwind('text-gray-400')}
              style={tailwind('pr-16 text-sm')}
              testID='dfi_utxo_label'
            >
              UTXO
            </ThemedText>
            <NumberFormat
              value={props.utxo.amount}
              thousandSeparator
              decimalScale={8}
              displayType='text'
              renderText={value =>
                <ThemedText
                  light={tailwind('text-gray-500')}
                  dark={tailwind('text-gray-400')}
                  style={tailwind('text-sm')}
                  testID='dfi_utxo_amount'
                >
                  {value}
                </ThemedText>}
            />
          </View>

          <View style={tailwind('flex-row items-center flex-1')}>
            <ThemedText
              light={tailwind('text-gray-500')}
              dark={tailwind('text-gray-400')}
              style={tailwind('pr-14 text-sm')}
              testID='dfi_token_label'
            >
              Token
            </ThemedText>
            <NumberFormat
              value={props.utxo.amount}
              thousandSeparator
              decimalScale={8}
              displayType='text'
              renderText={value =>
                <ThemedText
                  light={tailwind('text-gray-500')}
                  dark={tailwind('text-gray-400')}
                  style={tailwind('pl-1.5 text-sm')}
                  testID='dfi_token_amount'
                >
                  {value}
                </ThemedText>}
            />
          </View>

          <View style={tailwind('flex-row')}>
            <UtxoVsTokensInfo onPress={() => navigation.navigate('TokensVsUtxo')} />
            <View style={tailwind('flex-row flex-grow justify-end')}>
              <IconButton
                iconName='swap-vert'
                iconSize={24}
                iconType='MaterialIcons'
                onPress={() => navigation.navigate({
                  name: 'Convert',
                  params: { mode: 'utxosToAccount' },
                  merge: true
                })}
                testID='convert_dfi_button'
                style={tailwind('mr-2')}
              />
              <IconButton
                iconName='arrow-upward'
                iconSize={24}
                iconType='MaterialIcons'
                onPress={() => navigation.navigate({
                  name: 'Send',
                  params: { token: props.utxo },
                  merge: true
                })}
                testID='send_dfi_button'
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </ThemedView>
  )
}

function UtxoVsTokensInfo (props: {onPress: () => void}): JSX.Element {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={tailwind('flex-row items-end justify-start w-9/12')}
      testID='token_vs_utxo_info'
    >
      <ThemedIcon
        dark={tailwind('text-darkprimary-500')}
        iconType='MaterialIcons'
        light={tailwind('text-primary-500')}
        name='help'
        size={16}
      />

      <ThemedText
        dark={tailwind('text-darkprimary-500')}
        light={tailwind('text-primary-500')}
        style={tailwind('ml-1 text-xs font-medium px-1')}
      >
        {translate('screens/DFIBalanceCard', 'Learn more about UTXO and tokens')}
      </ThemedText>
    </TouchableOpacity>
  )
}
