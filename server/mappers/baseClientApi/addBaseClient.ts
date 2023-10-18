import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { AddBaseClientRequest } from '../../interfaces/baseClientApi/baseClientRequestBody'

export default (baseClient: BaseClient): AddBaseClientRequest => {
  // valid days is calculated from expiry date
  const expiryDate = baseClient.config.expiryDate ? new Date(baseClient.config.expiryDate) : null

  return {
    clientId: baseClient.baseClientId,
    scopes: ['read', 'write'],
    authorities: ['ROLE_CLIENT_CREDENTIALS'],
    ips: [],
    jiraNumber: baseClient.audit,
    databaseUserName: baseClient.clientCredentials.databaseUserName,
    validDays: expiryDate ? Math.ceil(expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24) : null,
    accessTokenValidityMinutes: baseClient.accessTokenValidity ? baseClient.accessTokenValidity / 60 : null,
  }
}
