import { StackScreenProps } from '@react-navigation/stack'
import React, { useState } from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'
import { Logging } from '../../../../api'
import { MnemonicEncrypted } from '../../../../api/wallet'
import { Text, View } from '../../../../components'
import { CREATE_STEPS, CreateWalletStepIndicator } from '../../../../components/CreateWalletStepIndicator'
import { PinTextInput } from '../../../../components/PinTextInput'
import { useNetworkContext } from '../../../../contexts/NetworkContext'
import { tailwind } from '../../../../tailwind'
import { translate } from '../../../../translations'
import { WalletParamList } from '../../WalletNavigator'
import { NavigationProp, useNavigation } from '@react-navigation/native'

type Props = StackScreenProps<WalletParamList, 'PinConfirmation'>

export function PinConfirmation ({ route }: Props): JSX.Element {
  const navigation = useNavigation<NavigationProp<WalletParamList>>()
  const { network } = useNetworkContext()
  const { pin, words } = route.params
  const [newPin, setNewPin] = useState('')

  const [invalid, setInvalid] = useState<boolean>(false)
  const [spinnerMessage, setSpinnerMessage] = useState<string>()

  function verifyPin (input: string): void {
    if (input.length !== pin.length) return
    if (input !== pin) {
      setInvalid(true)
      return
    } else {
      setInvalid(false)
    }

    const copy = { words, network, pin }
    setSpinnerMessage(translate('screens/PinConfirmation', 'Encrypting wallet...'))
    setTimeout(() => {
      MnemonicEncrypted.toData(copy.words, copy.network, copy.pin)
        .then(async encrypted => {
          navigation.navigate('EnrollBiometric', { encrypted, pin })
        })
        .catch(e => Logging.error(e))
    }, 50) // allow UI render the spinner before async task
  }

  return (
    <ScrollView style={tailwind('w-full flex-1 flex-col bg-white')}>
      <CreateWalletStepIndicator
        current={3}
        steps={CREATE_STEPS}
        style={tailwind('py-4 px-1')}
      />
      <View style={tailwind('px-6 py-4 mb-6')}>
        <Text
          style={tailwind('text-center font-semibold')}
        >{translate('screens/PinConfirmation', 'Enter your passcode again to verify')}
        </Text>
      </View>
      <PinTextInput
        cellCount={6} testID='pin_confirm_input' value={newPin} onChange={(pin) => {
          setNewPin(pin)
          verifyPin(pin)
        }}
      />
      <View style={tailwind('flex-row justify-center mt-6')}>
        {
          (spinnerMessage !== undefined) ? (
            <>
              <ActivityIndicator color='#FF00AF' />
              <Text style={tailwind('ml-2 font-semibold text-sm')}>{spinnerMessage}</Text>
            </>
          ) : null
        }
        {
          invalid && (
            <Text style={tailwind('text-center text-error font-semibold text-sm')}>
              {translate('screens/PinConfirmation', 'Wrong passcode entered')}
            </Text>
          )
        }
      </View>
    </ScrollView>
  )
}
