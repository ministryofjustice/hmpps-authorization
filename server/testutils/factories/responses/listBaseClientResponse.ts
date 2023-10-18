import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { ListBaseClientsResponse } from '../../../interfaces/baseClientApi/baseClientResponse'

export default Factory.define<ListBaseClientsResponse>(() => ({
  clients: [1, 2, 3].map(item => ({
    baseClientId: `base_client_id_${item}`,
    clientType: 'SERVICE',
    teamName: faker.company.name(),
    grantType: 'client_credentials',
    count: 1,
  })),
}))
