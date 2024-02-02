import type { Request } from 'express'
import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { getAccessTokenValiditySeconds, getDayOfExpiry, multiSeparatorSplit, snake } from '../../utils/utils'
import { MfaType } from '../../data/enums/mfaTypes'

export default (request: Request): BaseClient => {
  // valid days is calculated from expiry date
  const data = request.body

  const { accessTokenValidity, customAccessTokenValidity } = data
  const accessTokenValiditySeconds = getAccessTokenValiditySeconds(accessTokenValidity, customAccessTokenValidity)
  const dayOfExpiry = data.expiry ? getDayOfExpiry(data.expiryDays) : null

  return {
    baseClientId: data.baseClientId,
    accessTokenValidity: accessTokenValiditySeconds,
    scopes: multiSeparatorSplit(data.approvedScopes, [',', '\r\n', '\n']),
    audit: data.audit,
    count: 1,
    lastAccessed: '',
    expired: false,
    grantType: snake(data.grant),
    clientCredentials: {
      authorities: multiSeparatorSplit(data.authorities, [',', '\r\n', '\n']),
      databaseUserName: data.databaseUserName,
    },
    authorisationCode: {
      registeredRedirectURIs: multiSeparatorSplit(data.redirectUris, [',', '\r\n', '\n']),
      jwtFields: data.jwtFields,
      azureAdLoginFlow: data.azureAdLoginFlow === 'redirect',
      mfa: MfaType.None,
      mfaRememberMe: false,
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
      clientType: '',
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
