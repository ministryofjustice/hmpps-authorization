import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { BaseClient } from '../../interfaces/baseClientApi/baseClient'

export default Factory.define<BaseClient>(() => ({
  baseClientId: faker.string.uuid(),
  clientType: 'SERVICE',
  accessTokenValidity: 3600,
  scopes: ['read', 'write'],
  grantType: 'client_credentials',
  audit: faker.lorem.lines(4),
  count: 1,
  clientCredentials: {
    authorities: ['ROLE_CLIENT_CREDENTIALS'],
    databaseUserName: 'client_credentials',
  },
  authorisationCode: {
    registeredRedirectURIs: ['https://localhost:3000'],
    jwtFields: 'jwt fields',
    azureAdLoginFlow: false,
  },
  service: {
    serviceName: 'service name',
    description: 'service description',
    authorisedRoles: ['ROLE_CLIENT_CREDENTIALS'],
    url: 'https://localhost:3000',
    contact: 'service contact',
    status: 'ACTIVE',
  },
  deployment: {
    team: `${faker.word.adjective()} ${faker.word.adverb()} ${faker.word.noun()}`,
    teamContact: `${faker.person.firstName()} ${faker.person.lastName()}`,
    teamSlack: `${faker.internet.url()}`,
    hosting: 'CLOUD PLATFORM',
    namespace: 'namespace',
    deployment: '',
    secretKey: 'secretKey',
    secretName: 'secretName',
    clientIdKey: 'clientIdKey',
    deploymentInfo: 'deploymentInfo',
  },
  config: {
    allowedIPs: ['1.0.0.127'],
  },
}))
