import type { Request } from 'express'
import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { getAccessTokenValiditySeconds, getDayOfExpiry, multiSeparatorSplit, snake } from '../../utils/utils'

export default (request: Request): BaseClient => {
  // valid days is calculated from expiry date
  const data = request.body

  const { accessTokenValidity, customAccessTokenValidity } = data
  const accessTokenValiditySeconds = getAccessTokenValiditySeconds(accessTokenValidity, customAccessTokenValidity)
  const dayOfExpiry = data.expiry ? getDayOfExpiry(data.expiryDays) : null

  return {
    baseClientId: data.baseClientId,
    clientType: snake(data.clientType),
    accessTokenValidity: accessTokenValiditySeconds,
    scopes: multiSeparatorSplit(data.approvedScopes, [',', '\r\n', '\n']),
    audit: data.audit,
    count: 1,
    grantType: snake(data.grant),
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
