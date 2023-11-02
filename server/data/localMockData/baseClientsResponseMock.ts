import { GetBaseClientResponse, ListBaseClientsResponse } from '../../interfaces/baseClientApi/baseClientResponse'

export const listBaseClientsResponseMock: ListBaseClientsResponse = {
  clients: [
    {
      baseClientId: `base_client_id_1`,
      clientType: 'SERVICE',
      teamName: null,
      grantType: 'client_credentials',
      count: 1,
    },
    {
      baseClientId: `base_client_id_2`,
      clientType: 'SERVICE',
      teamName: 'Team 1',
      grantType: 'client_credentials',
      count: 2,
    },
    {
      baseClientId: `base_client_id_3`,
      clientType: 'SERVICE',
      teamName: 'Team 2',
      grantType: 'client_credentials',
      count: 1,
    },
  ],
}

export const getBaseClientResponseMock: GetBaseClientResponse = {
  clientId: 'baseClientId1',
  scopes: ['read', 'write'],
  authorities: ['ROLE_CLIENT_CREDENTIALS'],
  ips: [],
  jiraNumber: 'jiraNumber',
  databaseUserName: 'databaseUserName',
  validDays: 1,
  accessTokenValidityMinutes: 60,
  deployment: {
    team: 'deployment team',
    teamContact: 'deployment team contact',
    teamSlack: 'deployment team slack',
    hosting: 'deployment hosting',
    namespace: 'deployment namespace',
    deployment: 'deployment deployment',
    secretName: 'deployment secret name',
    clientIdKey: 'deployment client id key',
    secretKey: 'deployment secret key',
    deploymentInfo: 'deployment deployment info',
  },
}
