import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { HeaderFont } from '@components/Text'
import { HeaderTitle } from '@components/HeaderTitle'
import { LoanScheme, LoanToken, LoanVaultActive } from '@defichain/whale-api-client/dist/api/loan'
import { translate } from '@translations'
import { NetworkDetails } from '../Settings/screens/NetworkDetails'
import { LoadingState, LoansScreen } from './LoansScreen'
import { CreateVaultScreen } from './screens/CreateVaultScreen'
import { ConfirmCreateVaultScreen } from './screens/ConfirmCreateVaultScreen'
import BigNumber from 'bignumber.js'
import { VaultDetailScreen } from './VaultDetail/VaultDetailScreen'
import { AddCollateralScreen, Collateral } from './screens/AddCollateralScreen'
import { ConfirmAddCollateralScreen } from './screens/ConfirmAddCollateralScreen'
import { ChooseLoanTokenScreen } from './screens/ChooseLoanTokenScreen'
import { BorrowLoanTokenScreen } from './screens/BorrowLoanTokenScreen'
import { ConfirmBorrowLoanTokenScreen } from './screens/ConfirmBorrowLoanTokenScreen'
import { ConversionParam } from '@screens/AppNavigator/screens/Balances/BalancesNavigator'
import { TouchableOpacity } from 'react-native'
import { ThemedIcon } from '@components/themed'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { tailwind } from '@tailwind'

export interface LoanParamList {
  LoansScreen: {
    loadingState: LoadingState // TODO: remove hard-coded condition used for create vault flow
  }
  CreateVaultScreen: {
    loanScheme?: LoanScheme
  }
  ConfirmCreateVaultScreen: {
    loanScheme: LoanScheme
    fee: BigNumber
    conversion?: ConversionParam
  }
  VaultDetailScreen: {
    vaultId: string
    emptyActiveLoans?: boolean // TODO: remove hard-coded value
  }
  AddCollateralScreen: {
    vaultId: string
  }
  ConfirmAddCollateralScreen: {
    vaultId: string
    collaterals: Collateral[] // TODO: update type
    totalCollateralValue: BigNumber
    fee: BigNumber
  }
  BorrowLoanTokenScreen: {
    loanToken: LoanToken
    vault?: LoanVaultActive
  }
  ConfirmBorrowLoanTokenScreen: {
    loanToken: LoanToken
    vault: LoanVaultActive
    amountToBorrow: string
    totalInterestAmount: BigNumber
    totalLoanWithInterest: BigNumber
    fee: BigNumber
    conversion?: ConversionParam
  }
  [key: string]: undefined | object
}

const LoansStack = createStackNavigator<LoanParamList>()

export function LoansNavigator (): JSX.Element {
  const headerContainerTestId = 'loans_header_container'
  const navigation = useNavigation<NavigationProp<LoanParamList>>()

  return (
    <LoansStack.Navigator
      initialRouteName='LoansScreen'
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: HeaderFont,
        headerBackTitleVisible: false
      }}
    >
      <LoansStack.Screen
        component={LoansScreen}
        name='LoansScreen'
        options={{
          headerTitle: () => (
            <HeaderTitle
              text={translate('screens/LoansScreen', 'Loans') + ' (Beta)'} // TODO: remove beta from title
              containerTestID={headerContainerTestId}
            />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate({
              name: 'CreateVaultScreen',
              params: {},
              merge: true
            })} testID='create_vault_header_button'
            >
              <ThemedIcon
                size={28}
                style={tailwind('mr-2')} light={tailwind('text-primary-500')}
                dark={tailwind('text-primary-500')} iconType='MaterialCommunityIcons' name='plus'
              />
            </TouchableOpacity>
          )
        }}
      />
      <LoansStack.Screen
        component={NetworkDetails}
        name='NetworkDetails'
        options={{
          headerTitle: translate('screens/NetworkDetails', 'Wallet Network'),
          headerBackTitleVisible: false,
          headerBackTestID: 'network_details_header_back'
        }}
      />
      <LoansStack.Screen
        component={CreateVaultScreen}
        name='CreateVaultScreen'
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <HeaderTitle
              text={translate('screens/LoansScreen', 'Create Vault') + ' (Beta)'} // TODO: remove beta from title
            />
          )
        }}
      />
      <LoansStack.Screen
        component={ConfirmCreateVaultScreen}
        name='ConfirmCreateVaultScreen'
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <HeaderTitle
              text={translate('screens/LoansScreen', 'Confirm Create Vault') + ' (Beta)'} // TODO: remove beta from title
            />
          )
        }}
      />
      <LoansStack.Screen
        component={VaultDetailScreen}
        name='VaultDetailScreen'
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <HeaderTitle
              text={translate('screens/LoansScreen', 'Vault Detail') + ' (Beta)'} // TODO: remove beta from title
            />
          )
        }}
      />
      <LoansStack.Screen
        component={AddCollateralScreen}
        name='AddCollateralScreen'
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <HeaderTitle
              text={translate('screens/LoansScreen', 'Add Collateral') + ' (Beta)'} // TODO: remove beta from title
            />
          )
        }}
      />
      <LoansStack.Screen
        component={ConfirmAddCollateralScreen}
        name='ConfirmAddCollateralScreen'
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <HeaderTitle
              text={translate('screens/LoansScreen', 'Confirm Add Collateral') + ' (Beta)'} // TODO: remove beta from title
            />
          )
        }}
      />
      <LoansStack.Screen
        component={ChooseLoanTokenScreen}
        name='ChooseLoanTokenScreen'
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <HeaderTitle
              text={translate('screens/LoansScreen', 'Choose Loan Token to Borrow') + ' (Beta)'} // TODO: remove beta from title
            />
          )
        }}
      />
      <LoansStack.Screen
        component={BorrowLoanTokenScreen}
        name='BorrowLoanTokenScreen'
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <HeaderTitle
              text={translate('screens/LoansScreen', 'Borrow Loan Token') + ' (Beta)'} // TODO: remove beta from title
            />
          )
        }}
      />
      <LoansStack.Screen
        component={ConfirmBorrowLoanTokenScreen}
        name='ConfirmBorrowLoanTokenScreen'
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <HeaderTitle
              text={translate('screens/LoansScreen', 'Confirm Borrow Loan Token') + ' (Beta)'} // TODO: remove beta from title
            />
          )
        }}
      />
    </LoansStack.Navigator>
  )
}
