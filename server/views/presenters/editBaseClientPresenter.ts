import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { daysRemaining } from '../../utils/utils'

export default (baseClient: BaseClient) => {
  if (!baseClient) {
    return {
      accessTokenValidityDropdown: '',
      accessTokenValidityText: '',
      daysRemaining: 0,
      expiry: false,
    }
  }

  return {
    accessTokenValidityDropdown: getAccessTokenValidityDropdown(baseClient.accessTokenValidity),
    accessTokenValidityText: getAccessTokenValidityTextbox(baseClient.accessTokenValidity),
    daysRemaining: baseClient.config.expiryDate ? daysRemaining(baseClient.config.expiryDate) : '',
    expiry: baseClient.config.expiryDate,
  }
}

const getAccessTokenValidityDropdown = (accessTokenValidity: number) => {
  if ([1200, 3600, 43200].includes(accessTokenValidity)) {
    return `${accessTokenValidity}`
  }
  if (!accessTokenValidity) {
    return null
  }

  return 'custom'
}

const getAccessTokenValidityTextbox = (accessTokenValidity: number) => {
  if (getAccessTokenValidityDropdown(accessTokenValidity) === 'custom') {
    return `${accessTokenValidity}`
  }
  return ''
}
