import BaseClientApiRestClient from '../data/baseClientApiClient'
import { RestClientBuilder } from '../data'
import { BaseClient, ClientSecrets } from '../interfaces/baseClientApi/baseClient'
import {
  mapAddBaseClientRequest,
  mapClientSecrets,
  mapGetBaseClientResponse,
  mapListBaseClientsResponse,
  mapUpdateBaseClientRequest,
} from '../mappers'

export default class BaseClientService {
  constructor(private readonly baseClientApiClientFactory: RestClientBuilder<BaseClientApiRestClient>) {}

  async listBaseClients(token: string): Promise<BaseClient[]> {
    const baseClientApiClient = this.baseClientApiClientFactory(token)
    const listBaseClientsResponse = await baseClientApiClient.listBaseClients()
    const baseClients = mapListBaseClientsResponse(listBaseClientsResponse)

    return baseClients.sort((a, b) => {
      if (a.baseClientId < b.baseClientId) {
        return -1
      }
      if (a.baseClientId > b.baseClientId) {
        return 1
      }
      return 0
    })
  }

  async getBaseClient(token: string, baseClientId: string): Promise<BaseClient> {
    const baseClientApiClient = this.baseClientApiClientFactory(token)
    const getBaseClientsResponse = await baseClientApiClient.getBaseClient(baseClientId)
    return mapGetBaseClientResponse(getBaseClientsResponse)
  }

  async addBaseClient(token: string, baseClient: BaseClient): Promise<ClientSecrets> {
    const baseClientApiClient = this.baseClientApiClientFactory(token)
    const request = mapAddBaseClientRequest(baseClient)
    const response = await baseClientApiClient.addBaseClient(request)
    return mapClientSecrets(response)
  }

  async updateBaseClient(token: string, baseClient: BaseClient): Promise<Response> {
    const baseClientApiClient = this.baseClientApiClientFactory(token)
    const request = mapUpdateBaseClientRequest(baseClient)
    return baseClientApiClient.updateBaseClient(baseClient.baseClientId, request)
  }
}
