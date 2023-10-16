import { Factory } from 'fishery'
import { UpdateBaseClientRequest } from '../../../interfaces/baseClientApi/baseClientRequestBody'

export default Factory.define<UpdateBaseClientRequest>(() => ({
  scopes: ['read', 'write'],
  authorities: ['ROLE_CLIENT_CREDENTIALS'],
  ips: [],
  jiraNumber: 'jiraNumber',
  databaseUserName: 'databaseUserName',
  validDays: 1,
  accessTokenValidityMinutes: 60,
}))
