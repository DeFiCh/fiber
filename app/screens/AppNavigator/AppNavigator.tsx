import { LinkingOptions, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as Linking from 'expo-linking'
import React, { useEffect } from 'react'
import { AppState } from 'react-native'
import { useDispatch } from 'react-redux'
import { DeFiChainTheme } from '../../constants/Theme'
import { authentication } from '../../store/authentication'
import { translate } from '../../translations'
import { PlaygroundNavigator } from '../PlaygroundNavigator/PlaygroundNavigator'
import { AppLinking, BottomTabNavigator } from './BottomTabNavigator'

const App = createStackNavigator<AppParamList>()

export interface AppParamList {
  App: undefined
  Playground: undefined
  NotFound: undefined

  [key: string]: undefined | object
}

export function AppNavigator (): JSX.Element {
  const dispatch = useDispatch()

  useEffect(() => {
    AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        dispatch(authentication.actions.prompt({
          message: translate('screens/PrivacyLock', 'Welcome back, is it you? (FIXME: copy writing)'),
          consume: async () => true, // no action, not consuming retrieved passphrase
          onAuthenticated: async () => {} // no action, <TransactionAuthorization /> do auto dismissed
        }))
      }
    })
  })

  return (
    <NavigationContainer linking={LinkingConfiguration} theme={DeFiChainTheme}>
      <App.Navigator screenOptions={{ headerShown: false }}>
        <App.Screen name='App' component={BottomTabNavigator} />
        <App.Screen name='Playground' component={PlaygroundNavigator} />
      </App.Navigator>
    </NavigationContainer>
  )
}

const LinkingConfiguration: LinkingOptions = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      App: {
        path: 'app',
        screens: AppLinking
      },
      Playground: {
        screens: {
          PlaygroundScreen: 'playground'
        }
      }
    }
  }
}
