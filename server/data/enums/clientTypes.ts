import { snake } from '../../utils/utils'

// eslint-disable-next-line no-shadow,import/prefer-default-export
export enum ClientType {
  Personal = 'personal',
  Service = 'service',
  Blank = 'blank',
}

export const toClientType = (type: string): ClientType => {
  const value = snake(type)
  if (value === 'personal') {
    return ClientType.Personal
  }
  if (value === 'service') {
    return ClientType.Service
  }
  if (value === '' || value === 'blank') {
    return ClientType.Blank
  }
  throw new Error(`Invalid client type: ${value}`)
}
