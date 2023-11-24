import {
  ClientSecretsResponse,
  GetBaseClientResponse,
  ListBaseClientsResponse,
  ListClientInstancesResponse,
} from '../../interfaces/baseClientApi/baseClientResponse'

export const listBaseClientsResponseMock: ListBaseClientsResponse = {
  clients: [
    {
      baseClientId: `base_client_id_1`,
      clientType: 'SERVICE',
      teamName: null,
      grantType: 'client_credentials',
      roles: 'ROLE_ONE, ROLE_TWO',
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
      roles: 'ROLE_TWO, ROLE_THREE',
      count: 1,
    },
  ],
}

export const getBaseClientResponseMock: GetBaseClientResponse = {
  clientId: 'base_client_id_1',
  scopes: ['read', 'write'],
  authorities: ['ROLE_CLIENT_CREDENTIALS'],
  ips: [],
  jiraNumber: 'jiraNumber',
  databaseUserName: 'databaseUserName',
  validDays: 1,
  accessTokenValidityMinutes: 60,
  deployment: {
    clientType: 'service',
    team: 'deployment team',
    teamContact: 'deployment team contact',
    teamSlack: 'deployment team slack',
    hosting: 'other',
    namespace: 'deployment namespace',
    deployment: 'deployment deployment',
    secretName: 'deployment secret name',
    clientIdKey: 'deployment client id key',
    secretKey: 'deployment secret key',
    deploymentInfo: 'deployment deployment info',
  },
}

export const getListClientInstancesResponseMock: ListClientInstancesResponse = {
  clients: [
    {
      clientId: 'base_client_id_1_01',
      created: '2020-01-01T00:00:00.000',
    },
    {
      clientId: 'base_client_id_1_02',
      created: '2020-01-01T00:00:00.000',
    },
  ],
  grantType: 'client_credentials',
}

export const getSecretsResponseMock: ClientSecretsResponse = {
  clientId: 'base_client_id_1_03',
  clientSecret: 'aaa',
  base64ClientId: 'bbb',
  base64ClientSecret: 'ccc',
}
