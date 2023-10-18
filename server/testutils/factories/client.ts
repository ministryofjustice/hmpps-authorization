import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { Client } from '../../interfaces/baseClientApi/client'

export default Factory.define<Client>(() => ({
  baseClientId: faker.string.uuid(),
  clientId: faker.string.uuid(),
  created: faker.date.past(),
  accessed: faker.date.past(),
}))
