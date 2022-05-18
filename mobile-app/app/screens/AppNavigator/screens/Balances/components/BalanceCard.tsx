import {
  ThemedView,
  ThemedTouchableOpacity,
  ThemedIcon,
  ThemedText
} from '@components/themed'
import { BalanceParamList } from '../BalancesNavigator'
import { BalanceRowToken } from '../BalancesScreen'
import { StackNavigationProp } from '@react-navigation/stack'
import { View } from '@components'
import { translate } from '@translations'
import { tailwind } from '@tailwind'
import { ButtonGroup } from '../../Dex/components/ButtonGroup'
import { RootState } from '@store'
import { useSelector } from 'react-redux'
import { EmptyBalances } from './EmptyBalances'
import { TokenNameText } from '@screens/AppNavigator/screens/Balances/components/TokenNameText'
import { TokenAmountText } from '@screens/AppNavigator/screens/Balances/components/TokenAmountText'
import { useDisplayBalancesContext } from '@contexts/DisplayBalancesContext'
import { getNativeIcon } from '@components/icons/assets'
import { TouchableOpacity } from 'react-native'
import { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { TokenBreakdownPercentage } from './TokenBreakdownPercentage'
import { LockedBalance, useTokenLockedBalance } from '../hooks/TokenLockedBalance'
import { EmptyPortfolio } from './EmptyPortfolio'

export enum ButtonGroupTabKey {
  AllTokens = 'ALL_TOKENS',
  LPTokens = 'LP_TOKENS',
  Crypto = 'CRYPTO',
  dTokens = 'd_TOKENS'
}

interface BalanceCardProps {
  isZeroBalance: boolean
  filteredTokens: BalanceRowToken[]
  dstTokens: BalanceRowToken[]
  navigation: StackNavigationProp<BalanceParamList>
  buttonGroupOptions?: {
    onButtonGroupPress: (key: ButtonGroupTabKey) => void
    activeButtonGroup: string
    setActiveButtonGroup: (key: ButtonGroupTabKey) => void
  }
  denominationCurrency: string
}

export function BalanceCard ({
  isZeroBalance,
  filteredTokens,
  dstTokens,
  navigation,
  buttonGroupOptions,
  denominationCurrency
}: BalanceCardProps): JSX.Element {
  const buttonGroup = [
    {
      id: ButtonGroupTabKey.AllTokens,
      label: translate('screens/BalancesScreen', 'All tokens'),
      handleOnPress: () => onButtonGroupChange(ButtonGroupTabKey.AllTokens)
    },
    {
      id: ButtonGroupTabKey.LPTokens,
      label: translate('screens/BalancesScreen', 'LP tokens'),
      handleOnPress: () => onButtonGroupChange(ButtonGroupTabKey.LPTokens)
    },
    {
      id: ButtonGroupTabKey.Crypto,
      label: translate('screens/BalancesScreen', 'Crypto'),
      handleOnPress: () => onButtonGroupChange(ButtonGroupTabKey.Crypto)
    },
    {
      id: ButtonGroupTabKey.dTokens,
      label: translate('screens/BalancesScreen', 'dTokens'),
      handleOnPress: () => onButtonGroupChange(ButtonGroupTabKey.dTokens)
    }
  ]
  const [tabButtonLabel, setTabButtonLabel] = useState('')
  const { hasFetchedToken } = useSelector((state: RootState) => (state.wallet))
  const [isSorted, setIsSorted] = useState<boolean>(false)
  const onButtonGroupChange = (buttonGroupTabKey: ButtonGroupTabKey): void => {
    if (buttonGroupOptions !== undefined) {
      buttonGroupOptions.setActiveButtonGroup(buttonGroupTabKey)
      buttonGroupOptions.onButtonGroupPress(buttonGroupTabKey)
      setButtonLabel(buttonGroupTabKey)
    }
  }

  const setButtonLabel = (buttonGroupTabKey: ButtonGroupTabKey): void => {
    switch (buttonGroupTabKey) {
      case (ButtonGroupTabKey.LPTokens):
        return setTabButtonLabel('LP tokens')
      case (ButtonGroupTabKey.Crypto):
        return setTabButtonLabel('Crypto')
      case (ButtonGroupTabKey.dTokens):
        return setTabButtonLabel('dTokens')
    }
  }

  filteredTokens.sort((a, b) => {
    if (isSorted) {
      // display value in increasing order
      return a.usdAmount.minus(b.usdAmount).toNumber()
    } else {
      // display value in decreasing order
      return b.usdAmount.minus(a.usdAmount).toNumber()
    }
  })

  // return empty component if there are DFI but no other tokens
  if (!isZeroBalance && dstTokens.length === 0) {
    return <></>
  }

  // return empty portfolio if no DFI and other tokens
  if (isZeroBalance) {
    return <EmptyPortfolio />
  }

  return (
    <ThemedView>
      {
        // filter tab
        buttonGroupOptions !== undefined &&
        (
          <>
            <View style={tailwind('p-4')}>
              <ButtonGroup
                buttons={buttonGroup}
                activeButtonGroupItem={buttonGroupOptions.activeButtonGroup}
                modalStyle={tailwind('font-medium text-xs text-center py-0.5')}
                testID='balance_button_group'
              />
            </View>
            {/*  dropdown arrow (sorting) appears when there are other tokens */}
            {
              filteredTokens.length > 0 && hasFetchedToken &&
                <View testID='your_assets_dropdown_arrow'>
                  <SortTokens isSorted={isSorted} setIsSorted={setIsSorted} />
                </View>
            }
          </>
        )
      }
      <View testID='card_balance_row_container'>
        {filteredTokens.map((item) => (
          <View key={item.symbol} style={tailwind('p-4 pt-1.5 pb-1.5')}>
            <BalanceItemRow
              onPress={() => navigation.navigate({
                name: 'TokenDetail',
                params: { token: item },
                merge: true
              })}
              token={item}
              denominationCurrency={denominationCurrency}
            />
          </View>
        ))}
      </View>
      {
        // display empty balance component if tokens under selected tab does not exist
        filteredTokens.length === 0 && hasFetchedToken &&
          <EmptyBalances type={tabButtonLabel} />
      }
    </ThemedView>
  )
}

function BalanceItemRow ({
  token,
  onPress,
  denominationCurrency
}: { token: BalanceRowToken, onPress: () => void, denominationCurrency: string }): JSX.Element {
  const Icon = getNativeIcon(token.displaySymbol)
  const testID = `balances_row_${token.id}`
  const { isBalancesDisplayed } = useDisplayBalancesContext()
  const lockedToken = useTokenLockedBalance({ displaySymbol: token.displaySymbol, denominationCurrency }) as LockedBalance ?? { amount: new BigNumber(0), tokenValue: new BigNumber(0) }
  const collateralTokens = useSelector((state: RootState) => state.loans.collateralTokens)
  const loanTokens = useSelector((state: RootState) => state.loans.loanTokens)
  const hasLockedBalance = useMemo((): boolean => {
    return collateralTokens.some(collateralToken => collateralToken.token.displaySymbol === token.displaySymbol) ||
      loanTokens.some(loanToken => loanToken.token.displaySymbol === token.displaySymbol)
  }, [token])

  return (
    <ThemedView
      dark={tailwind('bg-gray-800')}
      light={tailwind('bg-white')}
      style={tailwind('p-4 rounded-lg')}
    >
      <ThemedTouchableOpacity
        onPress={onPress}
        dark={tailwind('border-0')}
        light={tailwind('border-0')}
        testID={testID}
      >
        <View style={tailwind('flex-row items-center flex-grow')}>
          <Icon testID={`${testID}_icon`} />
          <TokenNameText displaySymbol={token.displaySymbol} name={token.name} testID={testID} />
          <TokenAmountText
            tokenAmount={token.amount}
            usdAmount={token.usdAmount}
            testID={testID}
            isBalancesDisplayed={isBalancesDisplayed}
            denominationCurrency={denominationCurrency}
          />
        </View>
        {hasLockedBalance && !lockedToken.amount.isZero() &&
          (
            <TokenBreakdownPercentage
              displaySymbol={token.displaySymbol}
              symbol={token.symbol}
              lockedAmount={lockedToken.amount}
              testID={token.displaySymbol}
            />
          )}
      </ThemedTouchableOpacity>
    </ThemedView>
  )
}

function SortTokens ({
  isSorted,
  setIsSorted
}: { isSorted: boolean, setIsSorted: (isSorted: boolean) => void }): JSX.Element {
  return (
    <View style={tailwind('px-4 flex flex-row items-center')}>
      <TouchableOpacity
        onPress={() => setIsSorted(!isSorted)}
        style={tailwind('flex flex-row')}
        testID='toggle_sorting_assets'
      >
        <ThemedText
          style={tailwind('text-xs text-gray-400 pr-1')}
        >
          {translate('screens/BalancesScreen', 'YOUR ASSETS')}
        </ThemedText>
        <ThemedText
          light={tailwind('text-gray-500')}
          dark={tailwind('text-gray-400')}
          style={tailwind('text-xs')}
        >
          {translate('screens/BalancesScreen', `(From ${!isSorted ? 'highest' : 'lowest'} value)`)}
        </ThemedText>
        <ThemedIcon
          style={tailwind('ml-1 pt-px')}
          light={tailwind('text-primary-500')}
          dark={tailwind('text-darkprimary-500')}
          iconType='MaterialCommunityIcons'
          name={!isSorted ? 'sort-ascending' : 'sort-descending'}
          size={16}
        />
      </TouchableOpacity>
    </View>
  )
}
