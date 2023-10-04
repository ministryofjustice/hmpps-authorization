import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { Client } from '../../interfaces/baseClientApi/client'

export interface BaseClientApiClient {
  getBaseClients(): Promise<BaseClient[]>
  getBaseClient(baseClientId: string): Promise<BaseClient>
  addBaseClient(baseClient: BaseClient): Promise<BaseClient>
  updateBaseClient(baseClient: BaseClient): Promise<BaseClient>
  getClientInstances(baseClientId: string): Promise<Client[]>
  addClientInstance(baseClientId: string): Promise<Client>
  deleteClientInstance(baseClientId: string, clientId: string): Promise<void>
}
