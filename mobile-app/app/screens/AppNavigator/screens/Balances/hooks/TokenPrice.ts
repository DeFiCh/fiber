import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { RootState } from '@store'
import { useSelector } from 'react-redux'

interface TokenPrice {
  getTokenPrice: (symbol: string, amount: BigNumber, isLPS?: boolean) => BigNumber
}

export function useTokenPrice (denominationTokenSymbol = 'USDT'): TokenPrice {
  const blockCount = useSelector((state: RootState) => state.block.count)
  const dexPrices = useSelector((state: RootState) => state.wallet.dexPrices)
  const pairs = useSelector((state: RootState) => state.wallet.poolpairs)

  /**
   * @param symbol {string} token symbol
   * @param amount {string} token amount
   * @param isLPS {boolean} is liquidity pool token
   * @return BigNumber
   */
  const getTokenPrice = useCallback((symbol: string, amount: BigNumber, isLPS: boolean = false): BigNumber => {
    if (new BigNumber(amount).isZero()) {
      return new BigNumber(0)
    }
    if (symbol === denominationTokenSymbol) {
      return new BigNumber(amount)
    }
    if (isLPS) {
      const pair = pairs.find(pair => pair.data.symbol === symbol)
      if (pair === undefined) {
        return new BigNumber('')
      }
      const ratioToTotal = new BigNumber(amount).div(pair.data.totalLiquidity.token)
      const tokenAAmount = ratioToTotal.times(pair.data.tokenA.reserve).decimalPlaces(8, BigNumber.ROUND_DOWN)
      const tokenBAmount = ratioToTotal.times(pair.data.tokenB.reserve).decimalPlaces(8, BigNumber.ROUND_DOWN)
      const usdTokenA = getTokenPrice(pair.data.tokenA.symbol, tokenAAmount)
      const usdTokenB = getTokenPrice(pair.data.tokenB.symbol, tokenBAmount)
      return usdTokenA.plus(usdTokenB)
    }
    const prices = dexPrices[denominationTokenSymbol] ?? {}
    return new BigNumber(prices[symbol]?.denominationPrice).multipliedBy(amount)
  }, [pairs, blockCount])

  return {
    getTokenPrice
  }
}
