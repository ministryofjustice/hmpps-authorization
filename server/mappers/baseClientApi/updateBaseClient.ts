import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { UpdateBaseClientRequest } from '../../interfaces/baseClientApi/baseClientRequestBody'
import { daysRemaining } from '../../utils/utils'

export default (baseClient: BaseClient): UpdateBaseClientRequest => {
  return {
    scopes: baseClient.scopes,
    authorities: baseClient.clientCredentials.authorities,
    ips: baseClient.config.allowedIPs,
    jiraNumber: baseClient.audit,
    databaseUserName: baseClient.clientCredentials.databaseUserName,
    validDays: baseClient.config.expiryDate ? daysRemaining(baseClient.config.expiryDate) : null,
    accessTokenValidityMinutes: baseClient.accessTokenValidity ? baseClient.accessTokenValidity / 60 : null,
    grantType: baseClient.grantType,
    mfa: baseClient.authorisationCode.mfa,
    mfaRememberMe: baseClient.authorisationCode.mfaRememberMe,
    jwtFields: baseClient.authorisationCode.jwtFields,
    redirectUris: baseClient.authorisationCode.registeredRedirectURIs.join(','),
  }
}
