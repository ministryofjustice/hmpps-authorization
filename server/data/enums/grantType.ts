import { snake } from '../../utils/utils'

// eslint-disable-next-line no-shadow,import/prefer-default-export
export enum GrantType {
  ClientCredentials = 'client_credentials',
  AuthorizationCode = 'authorization_code',
}

export const toGrantType = (type: string): GrantType => {
  const value = snake(type)
  if (value === 'client_credentials') {
    return GrantType.ClientCredentials
  }
  if (value === 'authorization_code') {
    return GrantType.AuthorizationCode
  }
  throw new Error(`Invalid grant type: ${value}`)
}
