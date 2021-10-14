export const MAX_PASSCODE_ATTEMPT = 3 // allowed 2 failures
export const PASSCODE_LENGTH = 6
export const INVALID_HASH = 'invalid hash'
export const USER_CANCELED = 'USER_CANCELED'

export const DEFAULT_MESSAGES = {
  message: 'Enter passcode to continue',
  loadingMessage: 'Signing your transaction...',
  authorizedTransactionMessage: {
    title: 'Transaction authorized',
    description: 'Please wait as your transaction is prepared'
  },
  grantedAccessMessage: {
    title: 'Access granted',
    description: 'You may now proceed'
  }
}

export const SUCCESS_DISPLAY_TIMEOUT_IN_MS = 2000
export const CANCELED_ERROR = 'canceled error'

export enum TransactionStatus {
  INIT = 'INIT',
  IDLE = 'IDLE',
  BLOCK = 'BLOCK',
  PIN = 'PIN',
  SIGNING = 'SIGNING',
  AUTHORIZED = 'AUTHORIZED',
}

export interface PromptPromiseI {
  resolve: (pin: string) => void
  reject: (e: Error) => void
}
