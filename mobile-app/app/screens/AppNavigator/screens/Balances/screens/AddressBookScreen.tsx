import { View } from '@components'
import { ThemedFlatList, ThemedIcon, ThemedText, ThemedTouchableOpacity, ThemedView } from '@components/themed'
import { StackScreenProps } from '@react-navigation/stack'
import { RootState, useAppDispatch } from '@store'
import { hasTxQueued } from '@store/transaction_queue'
import { hasTxQueued as hasBroadcastQueued } from '@store/ocean'
import { LocalAddress, selectAddressBookArray, selectLocalWalletAddressArray, setUserPreferences, userPreferences } from '@store/userPreferences'
import { tailwind } from '@tailwind'
import { translate } from '@translations'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Platform, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { BalanceParamList } from '../BalancesNavigator'
import { useNetworkContext } from '@shared-contexts/NetworkContext'
import { useThemeContext } from '@shared-contexts/ThemeProvider'
import { NoTokensLight } from '../assets/NoTokensLight'
import { NoTokensDark } from '../assets/NoTokensDark'
import { AddressListEditButton } from '../components/AddressListEditButton'
import { useWalletNodeContext } from '@shared-contexts/WalletNodeProvider'
import { useLogger } from '@shared-contexts/NativeLoggingProvider'
import { MnemonicStorage } from '@api/wallet/mnemonic_storage'
import { authentication, Authentication } from '@store/authentication'
import { Button } from '@components/Button'
import { useDeFiScanContext } from '@shared-contexts/DeFiScanContext'
import { debounce } from 'lodash'
import { openURL } from '@api/linking'
import { SearchInput } from '@components/SearchInput'
import { ButtonGroup } from '../../Dex/components/ButtonGroup'
import { DiscoverWalletAddress } from '../components/AddressControlScreen'
import { Logging } from '@api'
import { useWalletContext } from '@shared-contexts/WalletContext'

type Props = StackScreenProps<BalanceParamList, 'AddressBookScreen'>

export enum ButtonGroupTabKey {
  Whitelisted = 'WHITELISTED',
  YourAddress = 'YOUR_ADDRESS'
}

export function AddressBookScreen ({ route, navigation }: Props): JSX.Element {
  const { selectedAddress, onAddressSelect } = route.params
  const { network } = useNetworkContext()
  const dispatch = useAppDispatch()
  const hasPendingJob = useSelector((state: RootState) => hasTxQueued(state.transactionQueue))
  const [activeButtonGroup, setActiveButtonGroup] = useState<ButtonGroupTabKey>(ButtonGroupTabKey.Whitelisted)
  const hasPendingBroadcastJob = useSelector((state: RootState) => hasBroadcastQueued(state.ocean))
  const userPreferencesFromStore = useSelector((state: RootState) => state.userPreferences)
  const addressBook: LocalAddress[] = useSelector((state: RootState) => selectAddressBookArray(state.userPreferences))
  const walletAddress: LocalAddress[] = useSelector((state: RootState) => selectLocalWalletAddressArray(state.userPreferences))
  const [addresses, setAddresses] = useState<LocalAddress[]>(addressBook)
  const [isEditing, setIsEditing] = useState(false)
  const { getAddressUrl } = useDeFiScanContext()
  const [filteredAddresses, setFilteredAddresses] = useState<LocalAddress[]>(addressBook)
  const buttonGroup = [
    {
      id: ButtonGroupTabKey.Whitelisted,
      label: translate('screens/AddressBookScreen', 'Whitelisted'),
      handleOnPress: () => onButtonGroupChange(ButtonGroupTabKey.Whitelisted)
    },
    {
      id: ButtonGroupTabKey.YourAddress,
      label: translate('screens/AddressBookScreen', 'Your address(es)'),
      handleOnPress: () => onButtonGroupChange(ButtonGroupTabKey.YourAddress)
    }
  ]
  const {
    wallet,
    addressLength
  } = useWalletContext()

  const onButtonGroupChange = (buttonGroupTabKey: ButtonGroupTabKey): void => {
    setActiveButtonGroup(buttonGroupTabKey)
    setIsEditing(false)
    if (buttonGroupTabKey === ButtonGroupTabKey.Whitelisted) {
      setAddresses(addressBook)
    } else {
      void fetchWalletAddresses(wallet, addressLength).then(walletAddresses =>
        setAddresses(walletAddresses.map(address => {
          const storedWalletAddress = walletAddress.find(a => a.address === address)
          if (storedWalletAddress === undefined) {
            return {
              address,
              label: '',
              isMine: true
            }
          } else {
            return storedWalletAddress
          }
        }))
      )
    }
    // TODO need to add logic to switch between whitelisted address and your address listing
  }

  const fetchWalletAddresses = async (wallet: any, addressLength: number): Promise<string[]> => {
    const addresses: string[] = []
    for (let i = 0; i <= addressLength; i++) {
      const account = wallet.get(i)
      const address = await account.getAddress()
      addresses.push(address)
    }
    return addresses
  }

  // Search
  const [searchString, setSearchString] = useState('')
  const filterAddress = debounce((searchString: string): void => {
    if (searchString.trim().length === 0) {
      setFilteredAddresses(sortByFavourite(addresses))
    }

    setFilteredAddresses(sortByFavourite(addresses).filter(address =>
      address.label.includes(searchString.trim().toLowerCase()) ||
      address.label.toLowerCase().includes(searchString.trim().toLowerCase())
    ))
  }, 200)

  // disable address selection touchableopacity from settings page
  const disableAddressSelect = selectedAddress === undefined && onAddressSelect === undefined

  const onChangeAddress = (address: string): void => {
    if (hasPendingJob || hasPendingBroadcastJob) {
      return
    }
    // condition to make address component unclickable from settings page
    if (address !== undefined && onAddressSelect !== undefined) {
      onAddressSelect(address)
    }
  }

  // Favourite
  const onFavouriteAddress = async (localAddress: LocalAddress): Promise<void> => {
    const labeledAddress = {
      [localAddress.address]: {
        ...localAddress,
        isFavourite: typeof localAddress.isFavourite === 'boolean' ? !localAddress.isFavourite : true
      }
    }
    dispatch(userPreferences.actions.addToAddressBook(labeledAddress))
  }

  const sortByFavourite = (localAddresses: LocalAddress[]): LocalAddress[] => {
    return [...localAddresses].sort((curr, next) => {
      if (curr.isFavourite === true) {
        return -1
      }
      if (next.isFavourite === true) {
        return 1
      }
      return 0
    })
  }

  useEffect(() => {
    const updateLocalStorage = async (): Promise<void> => {
      await dispatch(setUserPreferences({ network, preferences: userPreferencesFromStore }))
    }
    updateLocalStorage().catch(Logging.error)
  }, [userPreferencesFromStore])

  useEffect(() => {
    // merge updated redux state to local state
    filterAddress(searchString)
  }, [addresses])

  useEffect(() => {
    // update on search
    filterAddress(searchString)
  }, [searchString])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (): JSX.Element => (
        <SearchInput
          value={searchString}
          placeholder={translate('screens/AddressBookScreen', 'Search for address')}
          showClearButton={searchString !== ''}
          onClearInput={() => setSearchString('')}
          onChangeText={(text: string) => {
            setSearchString(text)
          }}
          testID='address_search_input'
        />
      ),
      headerRight: (): JSX.Element => (
        <TouchableOpacity
          onPress={goToAddAddressForm}
          testID='add_address_button'
          disabled={activeButtonGroup === ButtonGroupTabKey.YourAddress}
        >
          <ThemedIcon
            size={28}
            name='plus'
            style={tailwind('mr-2')}
            light={tailwind(['text-primary-500', { 'text-gray-300': activeButtonGroup === ButtonGroupTabKey.YourAddress }])}
            dark={tailwind(['text-darkprimary-500', { 'text-gray-600': activeButtonGroup === ButtonGroupTabKey.YourAddress }])}
            iconType='MaterialCommunityIcons'
          />
        </TouchableOpacity>
      )
    })
  }, [searchString, addresses, activeButtonGroup])

  const AddressListItem = useCallback(({
    item,
    index
  }: { item: LocalAddress, index: number }): JSX.Element => {
    return (
      <ThemedTouchableOpacity
        key={item.address}
        style={tailwind('px-4 py-3 flex flex-row items-center justify-between')}
        onPress={async () => {
          if (!isEditing) {
            onChangeAddress(item.address)
          }
        }}
        testID={`address_row_${index}`}
        disabled={hasPendingJob || hasPendingBroadcastJob || isEditing || disableAddressSelect}
      >
        <View style={tailwind('flex flex-row items-center flex-grow', { 'flex-auto': Platform.OS === 'web' })}>
          <View style={tailwind('mr-2 flex-auto')}>
            {item.label != null && item.label !== '' &&
              (
                <View style={tailwind('flex flex-row')}>
                  <ThemedText style={tailwind('text-sm')} testID={`address_row_label_${item.address}`}>
                    {item.label}
                  </ThemedText>
                  {!isEditing && (
                    <ThemedIcon
                      size={16}
                      name='open-in-new'
                      iconType='MaterialIcons'
                      light={tailwind('text-primary-500')}
                      dark={tailwind('text-darkprimary-500')}
                      style={tailwind('pl-1 pt-0.5')}
                      onPress={async () => await openURL(getAddressUrl(item.address))}
                    />
                  )}
                </View>

              )}
            <ThemedText
              style={tailwind('text-sm w-full')}
              light={tailwind('text-gray-500')}
              dark={tailwind('text-gray-400')}
              ellipsizeMode='middle'
              numberOfLines={1}
              testID={`address_row_text_${item.address}`}
            >
              {item.address}
            </ThemedText>
          </View>
          {isEditing
            ? (
              <>
                <TouchableOpacity onPress={() => navigation.navigate({
                  name: 'AddOrEditAddressBookScreen',
                  params: {
                    title: 'Edit Address',
                    isAddNew: false,
                    address: item.address,
                    addressLabel: item,
                    onSaveButtonPress: () => {
                      setIsEditing(false)
                      setSearchString('')
                    }
                  },
                  merge: true
                })}
                >
                  <ThemedIcon
                    size={24}
                    name='edit'
                    iconType='MaterialIcons'
                    style={tailwind('mr-2 font-bold')}
                    light={tailwind('text-gray-600')}
                    dark={tailwind('text-gray-300')}
                    testID={`address_edit_indicator_${item.address}`}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => await onDelete(item.address)}>
                  <ThemedIcon
                    size={24}
                    name='delete'
                    iconType='MaterialIcons'
                    light={tailwind('text-gray-600')}
                    dark={tailwind('text-gray-300')}
                    testID={`address_delete_indicator_${item.address}`}
                  />
                </TouchableOpacity>
              </>
            )
            : item.address === selectedAddress
              ? (
                <ThemedIcon
                  size={24}
                  name='check'
                  iconType='MaterialIcons'
                  light={tailwind('text-success-600')}
                  dark={tailwind('text-darksuccess-600')}
                  testID={`address_active_indicator_${item.address}`}
                />
              )
              : activeButtonGroup === ButtonGroupTabKey.Whitelisted && (
                <TouchableOpacity
                  style={tailwind('pl-4')}
                  onPress={async () => await onFavouriteAddress(item)}
                >
                  <ThemedIcon
                    iconType='MaterialIcons'
                    name={item.isFavourite === true ? 'star' : 'star-outline'}
                    size={20}
                    light={tailwind(
                      item.isFavourite === true ? 'text-warning-500' : 'text-gray-600'
                    )}
                    dark={tailwind(
                      item.isFavourite === true ? 'text-darkwarning-500' : 'text-gray-300'
                    )}
                  />
                </TouchableOpacity>
              )}
        </View>
      </ThemedTouchableOpacity>
    )
  }, [filteredAddresses, isEditing, activeButtonGroup])

  const goToAddAddressForm = (): void => {
    navigation.navigate({
      name: 'AddOrEditAddressBookScreen',
      params: {
        title: 'Add New Address',
        isAddNew: true,
        onSaveButtonPress: (address?: string) => {
          if (onAddressSelect !== undefined && address !== undefined) {
            onAddressSelect(address)
          }
        }
      },
      merge: true
    })
  }

  const HeaderComponent = useMemo(() => {
    return (
      <ThemedView
        light={tailwind('bg-gray-50 border-gray-200')}
        dark={tailwind('bg-gray-900 border-gray-700')}
        style={tailwind('flex flex-col items-center px-4 pt-6 pb-2 border-b')}
      >
        <View style={tailwind('mb-4 w-full')}>
          <ButtonGroup
            buttons={buttonGroup}
            activeButtonGroupItem={activeButtonGroup}
            labelStyle={tailwind('font-medium text-xs text-center py-0.5')}
            testID='address_button_group'
          />
        </View>
        <View style={tailwind('flex flex-row items-center justify-between w-full')}>
          <View style={tailwind('flex flex-row items-center')}>
            <WalletCounterDisplay addressLength={filteredAddresses.length} />
            {activeButtonGroup === ButtonGroupTabKey.YourAddress && <DiscoverWalletAddress size={18} />}
          </View>
          {(addressBook.length > 0 && activeButtonGroup === ButtonGroupTabKey.Whitelisted) &&
            <AddressListEditButton isEditing={isEditing} handleOnPress={() => setIsEditing(!isEditing)} />}
        </View>
      </ThemedView>
    )
  }, [filteredAddresses, isEditing, activeButtonGroup])

  // Passcode prompt
  const { data: { type: encryptionType } } = useWalletNodeContext()
  const isEncrypted = encryptionType === 'MNEMONIC_ENCRYPTED'
  const logger = useLogger()
  const onDelete = useCallback(async (address: string): Promise<void> => {
    if (!isEncrypted) {
      return
    }

    const auth: Authentication<string[]> = {
      consume: async passphrase => await MnemonicStorage.get(passphrase),
      onAuthenticated: async () => {
        dispatch(userPreferences.actions.deleteFromAddressBook(address))
        setIsEditing(false)
        setSearchString('')
      },
      onError: e => logger.error(e),
      title: translate('screens/Settings', 'Sign to delete address'),
      message: translate('screens/Settings', 'Enter passcode to continue'),
      loading: translate('screens/Settings', 'Verifying access')
    }
    dispatch(authentication.actions.prompt(auth))
  }, [navigation, dispatch, isEncrypted])

  return (
    <ThemedFlatList
      light={tailwind('bg-gray-50')}
      keyExtractor={(item) => item.address}
      stickyHeaderIndices={[0]}
      data={filteredAddresses}
      renderItem={AddressListItem} // Address list
      ListHeaderComponent={HeaderComponent} // Address counter
      ListEmptyComponent={activeButtonGroup === ButtonGroupTabKey.Whitelisted && filteredAddresses.length === 0 ? <EmptyDisplay onPress={goToAddAddressForm} /> : <></>}
    />
  )
}

function EmptyDisplay ({ onPress }: { onPress: () => void }): JSX.Element {
  const { isLight } = useThemeContext()
  return (
    <ThemedView
      style={tailwind('px-8 pt-24 pb-2 text-center')}
      testID='empty_address_book'
    >
      <View style={tailwind('items-center pb-4')}>
        {
          isLight ? <NoTokensLight /> : <NoTokensDark />
        }
      </View>
      <ThemedText testID='empty_tokens_title' style={tailwind('text-2xl font-semibold text-center')}>
        {translate('screens/AddressBookScreen', 'No saved addresses')}
      </ThemedText>
      <ThemedText testID='empty_tokens_subtitle' style={tailwind('px-8 pb-4 text-center opacity-60')}>
        {translate('screens/AddressBookScreen', 'Add your preferred address')}
      </ThemedText>
      <Button
        label={translate('screens/AddressBookScreen', 'ADD ADDRESS')}
        onPress={onPress}
        testID='button_add_address'
        title='Add address'
        margin='m-0 mb-4'
      />
    </ThemedView>
  )
}

function WalletCounterDisplay ({ addressLength }: { addressLength: number }): JSX.Element {
  return (
    <ThemedText
      light={tailwind('text-gray-400')}
      dark={tailwind('text-gray-500')}
      style={tailwind('text-xs font-medium mr-1.5 my-0.5')}
      testID='address_detail_address_count'
    >
      {translate('screens/AddressBookScreen', '{{length}} ADDRESS(ES)', { length: addressLength })}
    </ThemedText>
  )
}
