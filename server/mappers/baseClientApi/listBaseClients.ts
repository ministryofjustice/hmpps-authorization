import { ListBaseClientsResponse } from '../../interfaces/baseClientApi/baseClientResponse'
import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { multiSeparatorSplit } from '../../utils/utils'

export default (response: ListBaseClientsResponse): BaseClient[] => {
  const { clients } = response
  return clients.map(
    client =>
      ({
        baseClientId: client.baseClientId,
        clientType: client.clientType,
        accessTokenValidity: 24000,
        scopes: [],
        grantType: client.grantType,
        audit: '',
        count: client.count ? client.count : 0,
        clientCredentials: {
          authorities: multiSeparatorSplit(client.roles, [' ', ',', '\n']),
          databaseUserName: '',
        },
        authorisationCode: {
          registeredRedirectURIs: [],
          jwtFields: '',
          azureAdLoginFlow: false,
        },
        service: {
          serviceName: client.teamName || '',
          description: '',
          authorisedRoles: multiSeparatorSplit(client.roles, [' ', ',', '\n']),
          url: '',
          contact: '',
          status: '',
        },
        deployment: {
          team: client.teamName || '',
          teamContact: '',
          teamSlack: '',
          hosting: '',
          namespace: '',
          deployment: '',
          secretName: '',
          clientIdKey: '',
        },
        config: {
          allowedIPs: [],
          expiryDate: null,
        },
      }) as BaseClient,
  )
}
