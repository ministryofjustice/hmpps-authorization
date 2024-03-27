import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { HostingType } from '../../data/enums/hostingTypes'
import { MfaType } from '../../data/enums/mfaTypes'

export default Factory.define<BaseClient>(() => ({
  baseClientId: faker.string.uuid(),
  accessTokenValidity: 3600,
  scopes: ['read', 'write'],
  grantType: 'client_credentials',
  audit: 'audit notes',
  lastAccessed: '2021-01-01T00:00:00.000Z',
  expired: false,
  count: 1,
  clientCredentials: {
    authorities: ['ROLE_CLIENT_CREDENTIALS'],
    databaseUserName: 'client_credentials',
  },
  authorisationCode: {
    registeredRedirectURIs: ['https://localhost:3000'],
    jwtFields: 'jwt fields',
    azureAdLoginFlow: false,
    mfaRememberMe: false,
    mfa: MfaType.None,
  },
  service: {
    serviceName: 'service name',
    description: 'service description',
    serviceRoles: ['ROLE_CLIENT_CREDENTIALS'],
    url: 'https://localhost:3000',
    contact: 'service contact',
    status: 'ACTIVE',
  },
  deployment: {
    clientType: 'SERVICE',
    team: `${faker.word.adjective()} ${faker.word.adverb()} ${faker.word.noun()}`,
    teamContact: `${faker.person.firstName()} ${faker.person.lastName()}`,
    teamSlack: `${faker.internet.url()}`,
    hosting: HostingType.Cloud,
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
