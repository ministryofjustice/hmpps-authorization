import BaseClientApiRestClient from '../data/baseClientApiClient'
import { RestClientBuilder } from '../data'
import { BaseClient } from '../interfaces/baseClientApi/baseClient'
import mapListBaseClientsResponse from '../mappers/baseClientApi/listBaseClients'

export default class BaseClientService {
  constructor(private readonly baseClientApiClientFactory: RestClientBuilder<BaseClientApiRestClient>) {}

  async getBaseClients(token: string): Promise<Array<BaseClient>> {
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
}
