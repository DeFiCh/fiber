import { StackScreenProps } from '@react-navigation/stack'
import * as React from 'react'
import { useEffect } from 'react'
import { MnemonicUnprotected } from '../../../../api/wallet'
import { Button } from '../../../../components/Button'
import { CREATE_STEPS, CreateWalletStepIndicator } from '../../../../components/CreateWalletStepIndicator'
import { ThemedScrollView, ThemedText, ThemedView } from '../../../../components/themed'
import { WalletAlert } from '../../../../components/WalletAlert'
import { tailwind } from '../../../../tailwind'
import { translate } from '../../../../translations'
import { WalletParamList } from '../../WalletNavigator'

type Props = StackScreenProps<WalletParamList, 'CreateMnemonicWallet'>

export function CreateMnemonicWallet ({ navigation }: Props): JSX.Element {
  const words = MnemonicUnprotected.generateWords()

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault()
      WalletAlert({
        title: translate('screens/CreateMnemonicWallet', 'Exit screen'),
        message: translate('screens/CreateMnemonicWallet', 'If you leave this screen, you will be provided with a new set of 24 recovery words. Do you want to proceed?'),
        buttons: [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
            }
          },
          {
            text: 'Yes',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action)
          }
        ]
      })
    })
    return () => {
      navigation.removeListener('beforeRemove', () => {
      })
    }
  }, [navigation])

  function onContinue (): void {
    navigation.navigate({
      name: 'VerifyMnemonicWallet',
      params: {
        words
      },
      merge: true
    })
  }

  return (
    <ThemedScrollView light='bg-white' dark='bg-gray-900' style={tailwind('flex-1')}>
      <CreateWalletStepIndicator
        current={1}
        steps={CREATE_STEPS}
        style={tailwind('py-4 px-1')}
      />
      <ThemedText style={tailwind('font-semibold text-base p-4 text-center')}>
        {translate('screens/CreateMnemonicWallet', 'Take note of the words in their correct order')}
      </ThemedText>
      {words.map((word, index) => {
        return <RecoveryWordRow word={word} index={index} key={index} />
      })}
      <Button
        title='verify button' onPress={onContinue} testID='verify_button'
        label={translate('screens/CreateMnemonicWallet', 'VERIFY WORDS')}
      />
    </ThemedScrollView>
  )
}

function RecoveryWordRow (props: { index: number, word: string }): JSX.Element {
  return (
    <ThemedView
      light='bg-white border-b border-gray-200'
      dark='bg-gray-800 border-b border-gray-700' style={tailwind('p-4 flex-row')}
    >
      <ThemedText testID={`word_${props.index + 1}_number`} style={[tailwind('w-12 font-semibold')]}>
        {`${props.index + 1}.`}
      </ThemedText>
      <ThemedText testID={`word_${props.index + 1}`} style={tailwind('flex-grow font-semibold')}>
        {props.word}
      </ThemedText>
    </ThemedView>
  )
}
