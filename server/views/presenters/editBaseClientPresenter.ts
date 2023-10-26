import { BaseClient } from '../../interfaces/baseClientApi/baseClient'

export default (baseClient: BaseClient) => {
  return {
    accessTokenValidityDropdown: getAccessTokenValidityDropdown(baseClient.accessTokenValidity),
    accessTokenValidityText: getAccessTokenValidityTextbox(baseClient.accessTokenValidity),
    daysRemaining: baseClient.config.expiryDate ? calculateDaysRemaining(baseClient.config.expiryDate) : '',
    expiry: baseClient.config.expiryDate,
  }
}

const getAccessTokenValidityDropdown = (accessTokenValidity: number) => {
  if ([1200, 3600, 43200].includes(accessTokenValidity)) {
    return `${accessTokenValidity}`
  }
  return 'custom'
}

const getAccessTokenValidityTextbox = (accessTokenValidity: number) => {
  if (getAccessTokenValidityDropdown(accessTokenValidity) === 'custom') {
    return `${accessTokenValidity}`
  }
  return ''
}

const calculateDaysRemaining = (expiryDate?: string) => {
  if (!expiryDate) {
    return 0
  }
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diff = expiry.getTime() - now.getTime()
  if (diff < 0) {
    return 0
  }
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
