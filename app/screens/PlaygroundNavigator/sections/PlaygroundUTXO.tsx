import React, { useEffect, useState } from 'react'
import tailwind from 'tailwind-rn'
import { Text, View } from '../../../components'
import { usePlaygroundContext } from '../../../contexts/PlaygroundContext'
import { useWalletAPI } from '../../../hooks/wallet/WalletAPI'
import { WalletStatus } from '../../../store/wallet'
import { PlaygroundAction } from '../components/PlaygroundAction'
import { PlaygroundStatus } from '../components/PlaygroundStatus'

export function PlaygroundUTXO (): JSX.Element | null {
  const WalletAPI = useWalletAPI()
  const { api, rpc } = usePlaygroundContext()

  const [status, setStatus] = useState<string>('loading')

  useEffect(() => {
    api.playground.wallet().then(() => {
      setStatus('online')
    }).catch(() => {
      setStatus('error')
    })
  }, [])

  if (WalletAPI.getStatus() !== WalletStatus.LOADED_WALLET) {
    return null
  }

  const actions = status === 'online' ? (
    <PlaygroundAction
      testID='playground_wallet_top_up'
      title='Top up 10 DFI UTXO to Wallet'
      onPress={async () => {
        const address = await WalletAPI.getWallet().get(0).getAddress()
        await rpc.wallet.sendToAddress(address, 10)
      }}
    />
  ) : null

  return (
    <View>
      <View style={tailwind('flex-row flex items-center')}>
        <Text style={tailwind('text-xl font-bold')}>UTXO</Text>
        <View style={tailwind('ml-2')}>
          <PlaygroundStatus
            online={status === 'online'}
            loading={status === 'loading'}
            error={status === 'error'}
          />
        </View>
      </View>

      {actions}
    </View>
  )
}
