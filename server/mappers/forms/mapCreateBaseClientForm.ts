import type { Request } from 'express'
import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { multiSeparatorSplit } from '../../utils/utils'

function getDayOfExpiry(daysRemaining: string) {
  const daysRemainingInt = parseIntWithDefault(daysRemaining, 0)
  const timeOfExpiry: Date = new Date(Date.now() + daysRemainingInt * 24 * 60 * 60 * 1000)
  return timeOfExpiry.toISOString().split('T')[0]
}

function getAccessTokenValiditySeconds(accessTokenValidity: string, customAccessTokenValidity?: string) {
  if (accessTokenValidity === 'custom' && customAccessTokenValidity) {
    return parseIntWithDefault(customAccessTokenValidity, 0)
  }
  return parseIntWithDefault(accessTokenValidity, 0)
}

function parseIntWithDefault(value: string, defaultValue: number) {
  const parsed = parseInt(value, 10)
  return Number.isNaN(parsed) ? defaultValue : parsed
}

export default (request: Request): BaseClient => {
  // valid days is calculated from expiry date
  const data = request.body

  const { accessTokenValidity, customAccessTokenValidity } = data
  const accessTokenValiditySeconds = getAccessTokenValiditySeconds(accessTokenValidity, customAccessTokenValidity)
  const dayOfExpiry = data.expiry ? getDayOfExpiry(data.expiryDays) : null

  return {
    baseClientId: data.baseClientId,
    clientType: data.clientType,
    accessTokenValidity: accessTokenValiditySeconds,
    scopes: multiSeparatorSplit(data.approvedScopes, [',', '\r\n', '\n']),
    audit: data.audit,
    count: 1,
    grantType: data.grant,
    clientCredentials: {
      authorities: multiSeparatorSplit(data.authorities, [',', '\r\n', '\n']),
      databaseUserName: data.databaseUserName,
    },
    authorisationCode: {
      registeredRedirectURIs: [],
      jwtFields: '',
      azureAdLoginFlow: false,
    },
    service: {
      serviceName: '',
      description: '',
      authorisedRoles: [],
      url: '',
      contact: '',
      status: '',
    },
    deployment: {
      team: '',
      teamContact: '',
      teamSlack: '',
      hosting: '',
      namespace: '',
      deployment: '',
      secretName: '',
      clientIdKey: '',
      secretKey: '',
      deploymentInfo: '',
    },
    config: {
      allowedIPs: multiSeparatorSplit(data.allowedIPs, [',', '\r\n', '\n']),
      expiryDate: dayOfExpiry,
    },
  }
}
