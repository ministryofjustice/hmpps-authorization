import RestClient from './restClient'
import config from '../config'
import {
  GetBaseClientResponse,
  ListBaseClientsResponse,
  ClientSecretsResponse,
  ListClientInstancesResponse,
} from '../interfaces/baseClientApi/baseClientResponse'
import {
  AddBaseClientRequest,
  UpdateBaseClientDeploymentRequest,
  UpdateBaseClientRequest,
} from '../interfaces/baseClientApi/baseClientRequestBody'

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

  updateBaseClient(baseClientId: string, request: UpdateBaseClientRequest): Promise<Response> {
    return this.put({
      path: `/base-clients/${baseClientId}`,
      data: request as unknown as Record<string, unknown>,
    }) as Promise<Response>
  }

  updateBaseClientDeployment(baseClientId: string, request: UpdateBaseClientDeploymentRequest): Promise<Response> {
    return this.put({
      path: `/base-clients/${baseClientId}/deployment`,
      data: request as unknown as Record<string, unknown>,
    }) as Promise<Response>
  }

  addClientInstance(baseClientId: string): Promise<ClientSecretsResponse> {
    return this.post({ path: `/base-clients/${baseClientId}/clients` }) as Promise<ClientSecretsResponse>
  }

  deleteClientInstance(baseClientId: string, clientId: string): Promise<Response> {
    return this.delete({ path: `/base-clients/${baseClientId}/clients/${clientId}` }) as Promise<Response>
  }

  listClientInstances(baseClientId: string): Promise<ListClientInstancesResponse> {
    return this.get({ path: `/base-clients/${baseClientId}/clients` }) as Promise<ListClientInstancesResponse>
  }
}
