import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { GetBaseClientResponse, ListBaseClientsResponse } from '../../../interfaces/baseClientApi/baseClientResponse'

export default Factory.define<GetBaseClientResponse>(() => ({
  clientId: faker.string.uuid(),
  scopes: ['read', 'write'],
  authorities: ['ROLE_CLIENT_CREDENTIALS'],
  ips: [],
  jiraNumber: 'jiraNumber',
  databaseUserName: 'databaseUserName',
  validDays: 1,
  accessTokenValidityMinutes: 60,
}))
