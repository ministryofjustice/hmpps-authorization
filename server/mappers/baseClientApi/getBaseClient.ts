import { GetBaseClientResponse } from '../../interfaces/baseClientApi/baseClientResponse'
import { BaseClient } from '../../interfaces/baseClientApi/baseClient'

export default (response: GetBaseClientResponse): BaseClient => {
  return {
    baseClientId: response.clientId,
    clientType: 'SERVICE',
    accessTokenValidity: response.accessTokenValidityMinutes ? response.accessTokenValidityMinutes * 60 : 0,
    scopes: response.scopes ? response.scopes : [],
    grantType: 'client_credentials',
    audit: response.jiraNumber ? response.jiraNumber : '',
    count: 1,
    clientCredentials: {
      authorities: response.authorities ? response.authorities : [],
      databaseUserName: response.databaseUserName ? response.databaseUserName : '',
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
    },
    config: {
      allowedIPs: response.ips ? response.ips : [],
      expiryDate: response.validDays
        ? new Date(Date.now() + response.validDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : null,
    },
  } as BaseClient
}
