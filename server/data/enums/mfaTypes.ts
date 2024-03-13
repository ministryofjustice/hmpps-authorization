import { snake } from '../../utils/utils'

// eslint-disable-next-line no-shadow,import/prefer-default-export
export enum MfaType {
  None = 'NONE',
  All = 'ALL',
  Untrusted = 'UNTRUSTED',
}

export const toMfaType = (type: string): MfaType => {
  const value = snake(type)
  if (value === 'none') {
    return MfaType.None
  }
  if (value === 'all') {
    return MfaType.All
  }
  if (value === 'untrusted') {
    return MfaType.Untrusted
  }
  throw new Error(`Invalid mfa type: ${value}`)
}
