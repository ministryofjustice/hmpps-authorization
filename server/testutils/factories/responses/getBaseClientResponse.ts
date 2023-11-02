import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { GetBaseClientResponse } from '../../../interfaces/baseClientApi/baseClientResponse'

export default Factory.define<GetBaseClientResponse>(() => ({
  clientId: faker.string.uuid(),
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
}))
