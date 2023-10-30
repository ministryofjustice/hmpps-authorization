import type { Request } from 'express'
import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { getAccessTokenValiditySeconds, getDayOfExpiry, multiSeparatorSplit } from '../../utils/utils'

export default (baseClient: BaseClient, request: Request): BaseClient => {
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
    count: baseClient.count,
    grantType: data.grant,
    clientCredentials: {
      authorities: multiSeparatorSplit(data.authorities, [',', '\r\n', '\n']),
      databaseUserName: data.databaseUsername,
    },
    authorisationCode: {
      registeredRedirectURIs: [],
      jwtFields: '',
      azureAdLoginFlow: false,
    },
    service: baseClient.service,
    deployment: baseClient.deployment,
    config: {
      allowedIPs: multiSeparatorSplit(data.allowedIPs, [',', '\r\n', '\n']),
      expiryDate: dayOfExpiry,
    },
  }
}
