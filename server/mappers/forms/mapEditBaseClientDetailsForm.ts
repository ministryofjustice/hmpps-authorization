import type { Request } from 'express'
import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { getAccessTokenValiditySeconds, getDayOfExpiry, multiSeparatorSplit, snake } from '../../utils/utils'
import { MfaType, toMfaType } from '../../data/enums/mfaTypes'

export default (baseClient: BaseClient, request: Request): BaseClient => {
  const data = request.body

  const { accessTokenValidity, customAccessTokenValidity } = data
  const accessTokenValiditySeconds = getAccessTokenValiditySeconds(accessTokenValidity, customAccessTokenValidity)
  const dayOfExpiry = data.expiry ? getDayOfExpiry(data.expiryDays) : null

  return {
    ...baseClient,
    accessTokenValidity: accessTokenValiditySeconds,
    scopes: multiSeparatorSplit(data.approvedScopes, [',', '\r\n', '\n']),
    audit: data.audit,
    grantType: snake(data.grantType),
    clientCredentials: {
      authorities: multiSeparatorSplit(data.authorities, [',', '\r\n', '\n']),
      databaseUserName: data.databaseUsername,
    },
    authorisationCode: {
      registeredRedirectURIs: multiSeparatorSplit(data.redirectUris, [',', '\r\n', '\n']),
      jwtFields: data.jwtFields,
      azureAdLoginFlow: data.azureAdLoginFlow === 'redirect',
      mfa: data.mfa ? toMfaType(data.mfa) : MfaType.None,
      mfaRememberMe: data.mfaRememberMe === 'rememberMe',
    },
    config: {
      allowedIPs: multiSeparatorSplit(data.allowedIPs, [',', '\r\n', '\n']),
      expiryDate: dayOfExpiry,
    },
  }
}
