import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { AddBaseClientRequest } from '../../../interfaces/baseClientApi/baseClientRequestBody'

export default Factory.define<AddBaseClientRequest>(() => ({
  clientId: faker.string.uuid(),
  scopes: ['read', 'write'],
  authorities: ['ROLE_CLIENT_CREDENTIALS'],
  ips: [],
  jiraNumber: 'jiraNumber',
  databaseUserName: 'databaseUserName',
  validDays: 1,
  accessTokenValidityMinutes: 60,
}))
