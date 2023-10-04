import RestClient from './restClient'
import { BaseClientApiClient } from './interfaces/baseClientApiClient'
import { BaseClient } from '../interfaces/baseClientApi/baseClient'
import { Client } from '../interfaces/baseClientApi/client'
import config, { ApiConfig } from '../config'

export default class BaseClientApiRestClient implements BaseClientApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient(
      'baseClientApiRestClient',
      config.apis.hmppsAuthorizationServer as ApiConfig,
      token,
    )
  }

  private async get(args: object): Promise<unknown> {
    try {
      return await this.restClient.get(args)
    } catch (error) {
      return error
    }
  }

  private async post(args: object): Promise<unknown> {
    return this.restClient.post(args)
  }

  async getBaseClients(): Promise<BaseClient[]> {
    return (await this.get({ path: `/base-clients` })) as Promise<BaseClient[]>
  }

  async getBaseClient(baseClientId: string): Promise<BaseClient> {
    return (await this.get({ path: `/base-client/${baseClientId}` })) as Promise<BaseClient>
  }

  async addBaseClient(baseClient: BaseClient): Promise<BaseClient> {
    return (await this.post({ path: `/base-client`, data: baseClient })) as Promise<BaseClient>
  }

  async addClientInstance(baseClientId: string): Promise<Client> {
    return (await this.post({ path: `/base-client/${baseClientId}/clients` })) as Promise<Client>
  }

  async deleteClientInstance(baseClientId: string, clientId: string): Promise<void> {
    return Promise.resolve(undefined)
  }

  async getClientInstances(baseClientId: string): Promise<Client[]> {
    return Promise.resolve([])
  }

  async updateBaseClient(baseClient: BaseClient): Promise<BaseClient> {
    return Promise.resolve(undefined)
  }
}
