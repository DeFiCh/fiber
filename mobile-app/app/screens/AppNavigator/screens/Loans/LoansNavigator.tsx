import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { HeaderFont } from '@components/Text'
import { HeaderTitle } from '@components/HeaderTitle'
import { translate } from '@translations'
import { NetworkDetails } from '../Settings/screens/NetworkDetails'
import { LoansScreen } from './LoansScreen'
import { CreateVaultScreen } from './Screens/CreateVaultScreen'

export interface LoanParamList {
  LoansScreen: undefined
  CreateVaultConfirmationScreen: {
    loanScheme: LoanScheme
  }
  [key: string]: undefined | object
}

/**
 * TODO: remove after state and model is added
 */
export interface LoanScheme {
  id: string
  minColRatio: string
  interestRate: string
}

const LoansStack = createStackNavigator<LoanParamList>()

export function LoansNavigator (): JSX.Element {
  const headerContainerTestId = 'loans_header_container'

  return (
    <LoansStack.Navigator
      initialRouteName='CreateVaultScreen'
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
              text={translate('screens/LoansScreen', 'Loans') + ' (Beta)'}
              containerTestID={headerContainerTestId}
            />
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
              text={translate('screens/LoansScreen', 'Create vault') + ' (Beta)'}
            />
          )
        }}
      />
    </LoansStack.Navigator>
  )
}
