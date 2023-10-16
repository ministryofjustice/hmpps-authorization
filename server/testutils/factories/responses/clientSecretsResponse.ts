import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { ClientSecretsResponse } from '../../../interfaces/baseClientApi/baseClientResponse'

export default Factory.define<ClientSecretsResponse>(() => ({
  clientId: faker.string.uuid(),
  clientSecret: faker.string.uuid(),
  base64ClientId: faker.string.uuid(),
  base64ClientSecret: faker.string.uuid(),
}))
