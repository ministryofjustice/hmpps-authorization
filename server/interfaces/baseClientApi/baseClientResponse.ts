export interface ListBaseClientResponseItem {
  baseClientId: string
  clientType?: string
  teamName?: string
  grantType: string
  roles?: string
  count: number
  expired?: boolean
  lastAccessed?: string
}

export interface ListBaseClientsResponse {
  clients: ListBaseClientResponseItem[]
}

export interface GetBaseClientResponse {
  clientId: string
  scopes?: string[]
  authorities?: string[]
  ips?: string[]
  jiraNumber?: string
  databaseUserName?: string
  validDays?: number
  accessTokenValidityMinutes?: number
}

export interface ClientSecretsResponse {
  clientId: string
  clientSecret: string
  base64ClientId: string
  base64ClientSecret: string
}

export interface ListClientInstancesResponseItem {
  clientId: string
  created: string
  lastAccessed?: string
}

export interface ListClientInstancesResponse {
  clients: ListClientInstancesResponseItem[]
  grantType: string
}
