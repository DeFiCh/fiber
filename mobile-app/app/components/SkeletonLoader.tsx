import { DexSkeletonLoader } from './skeletonLoaders/DexSkeletonLoader'
import { MnemonicWordSkeletonLoader } from './skeletonLoaders/MnemonicWordSkeletonLoader'
import { TransactionSkeletonLoader } from './skeletonLoaders/TransactionSkeletonLoader'
import { LoanSkeletonLoader } from './skeletonLoaders/LoanSkeletonLoader'
import { AddressSkeletonLoader } from './skeletonLoaders/AddressSkeletonLoader'
import { BrowseAuctionsLoader } from './skeletonLoaders/BrowseAuctionsLoader'
import { VaultSkeletonLoader } from './skeletonLoaders/VaultSkeletonLoader'
import { PortfolioSkeletonLoader } from './skeletonLoaders/PortfolioSkeletonLoader'
import { VaultSchemesSkeletonLoader } from './skeletonLoaders/VaultSchemeSkeletonLoader'
import { DexPricesSkeletonLoader } from './skeletonLoaders/DexPricesSkeletonLoader'

interface SkeletonLoaderProp {
  row: number
  screen: SkeletonLoaderScreen
}

export enum SkeletonLoaderScreen {
  'Dex' = 'Dex',
  'DexPrices' = 'DexPrices',
  'Transaction' = 'Transaction',
  'MnemonicWord' = 'MnemonicWord',
  'Loan' = 'Loan',
  'Address' = 'Address',
  'BrowseAuction' = 'BrowseAuction',
  'Vault' = 'Vault',
  'Portfolio' = 'Portfolio',
  'VaultSchemes' = 'VaultSchemes'
}

export function SkeletonLoader (prop: SkeletonLoaderProp): JSX.Element {
  const skeletonRow = Array.from(Array(prop.row), (_v, i) => i + 1)
  switch (prop.screen) {
    case SkeletonLoaderScreen.Dex:
      return (
        <>
          {skeletonRow.map(i => (
            <DexSkeletonLoader key={i} />
          ))}
        </>
      )

      case SkeletonLoaderScreen.DexPrices:
      return (
        <>
          {skeletonRow.map(i => (
            <DexPricesSkeletonLoader key={i} />
          ))}
        </>
      )

    case SkeletonLoaderScreen.Transaction:
      return (
        <>
          {skeletonRow.map(i => (
            <TransactionSkeletonLoader key={i} />
          ))}
        </>
      )
    case SkeletonLoaderScreen.MnemonicWord:
      return (
        <>
          {skeletonRow.map(i => (
            <MnemonicWordSkeletonLoader key={i} />
          ))}
        </>
      )
    case SkeletonLoaderScreen.Loan:
      return (
        <>
          {skeletonRow.map(i => (
            <LoanSkeletonLoader key={i} />
          ))}
        </>
      )
    case SkeletonLoaderScreen.Address:
        return (
          <>
            {skeletonRow.map(i => (
              <AddressSkeletonLoader key={i} />
            ))}
          </>
        )
    case SkeletonLoaderScreen.BrowseAuction:
      return (
        <>
          {skeletonRow.map(i => (
            <BrowseAuctionsLoader key={i} />
          ))}
        </>
      )
    case SkeletonLoaderScreen.Vault:
      return (
        <>
          {skeletonRow.map(i => (
            <VaultSkeletonLoader key={i} />
          ))}
        </>
      )
    case SkeletonLoaderScreen.Portfolio:
      return (
        <>
          {skeletonRow.map(i => (
            <PortfolioSkeletonLoader key={i} />
          ))}
        </>
      )
    case SkeletonLoaderScreen.VaultSchemes:
      return (
        <>
          {skeletonRow.map(i => (
            <VaultSchemesSkeletonLoader key={i} />
          ))}
        </>
      )
  }
}
