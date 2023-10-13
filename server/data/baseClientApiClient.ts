import RestClient from './restClient'
import { BaseClient } from '../interfaces/baseClientApi/baseClient'
import { Client } from '../interfaces/baseClientApi/client'
import config from '../config'
import { ListBaseClientsResponse } from '../interfaces/baseClientApi/baseClientResponse'

export default class BaseClientApiClient extends RestClient {
  constructor(token: string) {
    super('HMPPS Authorization Server', config.apis.hmppsAuthorizationServer, token)
  }

  listBaseClients(): Promise<ListBaseClientsResponse> {
    return this.get({ path: `/base-clients` }) as Promise<ListBaseClientsResponse>
  }

  getBaseClient(baseClientId: string): Promise<BaseClient> {
    return this.get({ path: `/base-client/${baseClientId}` }) as Promise<BaseClient>
  }

  addBaseClient(baseClient: BaseClient): Promise<BaseClient> {
    return this.post({
      path: `/base-client`,
      data: baseClient as unknown as Record<string, unknown>,
    }) as Promise<BaseClient>
  }

  addClientInstance(baseClientId: string): Promise<Client> {
    return this.post({ path: `/base-client/${baseClientId}/clients` }) as Promise<Client>
  }
  //
  // async deleteClientInstance(baseClientId: string, clientId: string): Promise<void> {
  //   return Promise.resolve(undefined)
  // }
  //
  // async getClientInstances(baseClientId: string): Promise<Client[]> {
  //   return Promise.resolve([])
  // }
  //
  // async updateBaseClient(baseClient: BaseClient): Promise<BaseClient> {
  //   return Promise.resolve(undefined)
  // }
}
