import * as React from 'react'
import { tailwind } from '@tailwind'
import { ThemedView } from '@components/themed'
import { VaultCard } from '@screens/AppNavigator/screens/Loans/components/VaultCard'
import { useFeatureFlagContext } from '@contexts/FeatureFlagContext'
import { View } from 'react-native'
import { InfoText } from '@components/InfoText'
import { translate } from '@translations'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@store'
import { useEffect } from 'react'
import { fetchVaults } from '@store/loans'
import { useWhaleApiClient } from '@shared-contexts/WhaleContext'
import { useWalletContext } from '@shared-contexts/WalletContext'

export function Vaults (): JSX.Element {
  const dispatch = useDispatch()
  const client = useWhaleApiClient()
  const { address } = useWalletContext()
  const blockCount = useSelector((state: RootState) => state.block.count)
  const vaults = useSelector((state: RootState) => state.loans.vaults)

  useEffect(() => {
    dispatch(fetchVaults({ address, client }))
  }, [blockCount])
  const { isBetaFeature } = useFeatureFlagContext()

  return (
    <ThemedView style={tailwind('h-full m-4')}>
      {isBetaFeature('loan') && (
        <View style={tailwind('pb-4')}>
          <InfoText
            testID='beta_warning_info_text'
            text={translate('screens/FeatureFlagScreen', 'Feature is still in Beta. Use at your own risk.')}
          />
        </View>
      )}
      {vaults.map((vault, index) => {
        return <VaultCard testID={`vault_card_${index}`} key={index} vault={vault} />
      })}
    </ThemedView>
  )
}
