import { JellyfishWallet, WalletAccount, WalletHdNode } from '@defichain/jellyfish-wallet'
import { generateMnemonic } from '@defichain/jellyfish-wallet-mnemonic'
import * as Random from 'expo-random'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../store'
import { wallet, WalletStatus } from '../../store/wallet'
import { MnemonicStorage } from './MnemonicStorage'
import { getMnemonicWallet, hasMnemonicWallet } from './MnemonicWallet'

let jellyfishWallet: JellyfishWallet<WalletAccount, WalletHdNode> | undefined

/**
 * IMPORTANT: Do not log anything in WalletAPI or any Wallet related features.
 * @deprecated
 */
const WalletAPI = {
  // TODO(fuxingloh): kinda awkward that dispatch is passed to WalletAPI.
  //  the actions could be written in reducers. might need to refactor this soon.
  //  however, `const WalletAPI = useWalletAPI()` this design might be cleaner
  //  since it's a hook and it is only enabled after loading the wallet.
  getStatus (): WalletStatus {
    return useSelector<RootState, WalletStatus>(state => state.wallet.status)
  },
  getWallet (): JellyfishWallet<WalletAccount, WalletHdNode> {
    if (jellyfishWallet === undefined) {
      throw new Error('JellyfishWallet not yet initialized')
    }
    return jellyfishWallet
  },
  clearWallet (dispatch: Dispatch<any>): void {
    dispatch(wallet.actions.setStatus(WalletStatus.LOADING))

    MnemonicStorage.clear().then(() => {
      dispatch(wallet.actions.setStatus(WalletStatus.INITIAL))
    }).catch(() => {
      dispatch(wallet.actions.setStatus(WalletStatus.ERROR))
    })
  },
  randomMnemonic (dispatch: Dispatch<any>): string[] {
    const words = generateMnemonic(24, numOfBytes => {
      const bytes = Random.getRandomBytes(numOfBytes)
      return Buffer.from(bytes)
    })

    WalletAPI.setMnemonic(dispatch, words)
    return words
  },
  setMnemonic (dispatch: Dispatch<any>, words: string[]): void {
    dispatch(wallet.actions.setStatus(WalletStatus.LOADING))

    MnemonicStorage.setMnemonic(words).then(() => {
      dispatch(wallet.actions.setStatus(WalletStatus.INITIAL))
    }).catch(() => {
      dispatch(wallet.actions.setStatus(WalletStatus.ERROR))
    })
  },
  setMnemonicAbandon23 (dispatch: Dispatch<any>): void {
    WalletAPI.setMnemonic(dispatch, [
      'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'abandon', 'art'
    ])
  }
}

/**
 * @deprecated
 */
export function useWalletAPI (): typeof WalletAPI {
  const status = useSelector<RootState, WalletStatus>(state => state.wallet.status)
  const dispatch = useDispatch()

  useEffect(() => {
    async function loadWallet (): Promise<void> {
      if (await hasMnemonicWallet()) {
        jellyfishWallet = await getMnemonicWallet()
        const address = await jellyfishWallet.get(0).getAddress()
        dispatch(wallet.actions.setAddress(address))
        dispatch(wallet.actions.setStatus(WalletStatus.LOADED_WALLET))
      } else {
        jellyfishWallet = undefined
        dispatch(wallet.actions.setStatus(WalletStatus.NO_WALLET))
      }
    }

    if (status === WalletStatus.INITIAL) {
      loadWallet().catch(() => {
        dispatch(wallet.actions.setStatus(WalletStatus.ERROR))
      })
    }
  })

  return WalletAPI
}
