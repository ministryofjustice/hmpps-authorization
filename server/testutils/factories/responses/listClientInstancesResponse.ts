import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { ListClientInstancesResponse } from '../../../interfaces/baseClientApi/baseClientResponse'

export default Factory.define<ListClientInstancesResponse>(() => ({
  clients: [1, 2, 3].map(item => ({
    clientId: `base_client_id-${item}`,
    created: faker.date.past().toISOString(),
    lastAccessed: faker.date.past().toISOString(),
  })),
  grantType: 'client_credentials',
}))
