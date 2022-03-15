import { ThemedText, ThemedTouchableOpacity, ThemedView } from '@components/themed'
import { tailwind } from '@tailwind'
import { RandomAvatar } from './RandomAvatar'

interface AddressSelectionButtonProps {
  address: string
  addressLength: number
  onPress: () => void
}

export function AddressSelectionButton (props: AddressSelectionButtonProps): JSX.Element {
  return (
    <ThemedTouchableOpacity
      light={tailwind('bg-gray-50')}
      dark={tailwind('bg-gray-900')}
      style={tailwind('rounded-2xl p-1 flex flex-row items-center mr-2')}
      onPress={props.onPress}
      testID='switch_account_button'
    >
      <RandomAvatar name={props.address} size={24} />
      <ThemedText
        ellipsizeMode='middle'
        numberOfLines={1}
        style={tailwind('text-xs w-14 ml-1')}
        light={tailwind('text-black')}
        dark={tailwind('text-white')}
        testID='wallet_address'
      >
        {props.address}
      </ThemedText>
      {props.addressLength > 0 &&
        (
          <ThemedView
            light={tailwind('bg-warning-600')}
            dark={tailwind('bg-darkwarning-600')}
            style={tailwind('rounded-full w-4 h-4 mr-1')}
          >
            <ThemedText
              light={tailwind('text-white')}
              dark={tailwind('text-black')}
              style={tailwind('text-2xs leading-4 text-center font-medium')}
              testID='address_count_badge'
            >
              {props.addressLength > 9 ? '9+' : props.addressLength + 1}
            </ThemedText>
          </ThemedView>
        )}
    </ThemedTouchableOpacity>
  )
}
