import BaseClientApiRestClient from '../data/baseClientApiClient'
import { RestClientBuilder } from '../data'
import { BaseClient, ClientSecrets } from '../interfaces/baseClientApi/baseClient'
import {
  mapAddBaseClientRequest,
  mapClientSecrets,
  mapGetBaseClientResponse,
  mapListBaseClientsResponse,
  mapListClientInstancesResponse,
  mapUpdateBaseClientDeploymentRequest,
  mapUpdateBaseClientRequest,
} from '../mappers'
import { Client } from '../interfaces/baseClientApi/client'

export default class BaseClientService {
  constructor(private readonly baseClientApiClientFactory: RestClientBuilder<BaseClientApiRestClient>) {}

  async listBaseClients(token: string): Promise<BaseClient[]> {
    const baseClientApiClient = this.baseClientApiClientFactory(token)
    const listBaseClientsResponse = await baseClientApiClient.listBaseClients()
    return mapListBaseClientsResponse(listBaseClientsResponse)
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

  async updateBaseClientDeployment(token: string, baseClient: BaseClient): Promise<Response> {
    const baseClientApiClient = this.baseClientApiClientFactory(token)
    const request = mapUpdateBaseClientDeploymentRequest(baseClient)
    return baseClientApiClient.updateBaseClientDeployment(baseClient.baseClientId, request)
  }

  async addClientInstance(token: string, baseClient: BaseClient): Promise<ClientSecrets> {
    const baseClientApiClient = this.baseClientApiClientFactory(token)
    const response = await baseClientApiClient.addClientInstance(baseClient.baseClientId)
    return mapClientSecrets(response)
  }

  async listClientInstances(token: string, baseClient: BaseClient): Promise<Client[]> {
    const baseClientApiClient = this.baseClientApiClientFactory(token)
    const response = await baseClientApiClient.listClientInstances(baseClient.baseClientId)
    return mapListClientInstancesResponse(baseClient, response)
  }
}
