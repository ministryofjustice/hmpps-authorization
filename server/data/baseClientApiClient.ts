import RestClient from './restClient'
import { Client } from '../interfaces/baseClientApi/client'
import config from '../config'
import {
  GetBaseClientResponse,
  ListBaseClientsResponse,
  ClientSecretsResponse,
} from '../interfaces/baseClientApi/baseClientResponse'
import { AddBaseClientRequest } from '../interfaces/baseClientApi/baseClientRequestBody'

export default class BaseClientApiClient extends RestClient {
  constructor(token: string) {
    super('HMPPS Authorization Server', config.apis.hmppsAuthorizationServer, token)
  }

  listBaseClients(): Promise<ListBaseClientsResponse> {
    return this.get({ path: `/base-clients` }) as Promise<ListBaseClientsResponse>
  }

  getBaseClient(baseClientId: string): Promise<GetBaseClientResponse> {
    return this.get({ path: `/base-clients/${baseClientId}` }) as Promise<GetBaseClientResponse>
  }

  addBaseClient(baseClientRequest: AddBaseClientRequest): Promise<ClientSecretsResponse> {
    return this.post({
      path: `/base-clients`,
      data: baseClientRequest as unknown as Record<string, unknown>,
    }) as Promise<ClientSecretsResponse>
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
