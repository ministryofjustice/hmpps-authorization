import { ListClientInstancesResponse } from '../../interfaces/baseClientApi/baseClientResponse'
import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { Client } from '../../interfaces/baseClientApi/client'

export default (baseClient: BaseClient, response: ListClientInstancesResponse): Client[] => {
  const { clients } = response
  if (!clients) {
    return []
  }
  return clients.map(
    client =>
      ({
        baseClientId: baseClient.baseClientId,
        clientId: client.clientId,
        created: client.created ? new Date(client.created) : undefined,
        accessed: client.lastAccessed ? new Date(client.lastAccessed) : undefined,
      }) as Client,
  )
}
