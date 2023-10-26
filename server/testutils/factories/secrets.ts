import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { ClientSecrets } from '../../interfaces/baseClientApi/baseClient'

export default Factory.define<ClientSecrets>(() => ({
  clientId: faker.string.uuid(),
  clientSecret: faker.string.uuid(),
  base64ClientId: faker.string.uuid(),
  base64ClientSecret: faker.string.uuid(),
}))
