import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { UpdateBaseClientRequest } from '../../interfaces/baseClientApi/baseClientRequestBody'
import { daysRemaining } from '../../utils/utils'

export default (baseClient: BaseClient): UpdateBaseClientRequest => {
  return {
    scopes: ['read', 'write'],
    authorities: ['ROLE_CLIENT_CREDENTIALS'],
    ips: [],
    jiraNumber: baseClient.audit,
    databaseUserName: baseClient.clientCredentials.databaseUserName,
    validDays: baseClient.config.expiryDate ? daysRemaining(baseClient.config.expiryDate) : null,
    accessTokenValidityMinutes: baseClient.accessTokenValidity ? baseClient.accessTokenValidity / 60 : null,
  }
}
