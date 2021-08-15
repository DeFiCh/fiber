import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { HeaderFont } from '../../components'
import { HeaderTitle } from '../../components/HeaderTitle'
import { PlaygroundProvider } from '../../contexts/PlaygroundContext'
import { PlaygroundScreen } from './PlaygroundScreen'

export interface PlaygroundParamList {
  PlaygroundScreen: undefined

  [key: string]: undefined | object
}

const PlaygroundStack = createStackNavigator<PlaygroundParamList>()

export function PlaygroundNavigator (): JSX.Element {
  return (
    <PlaygroundProvider>
      <PlaygroundStack.Navigator screenOptions={{ headerTitleStyle: HeaderFont, presentation: 'modal' }}>
        <PlaygroundStack.Screen
          name='PlaygroundScreen'
          component={PlaygroundScreen}
          options={{
            headerTitle: () => <HeaderTitle text='DeFi Testing' />,
            headerBackTitleVisible: false
          }}
        />
      </PlaygroundStack.Navigator>
    </PlaygroundProvider>
  )
}
