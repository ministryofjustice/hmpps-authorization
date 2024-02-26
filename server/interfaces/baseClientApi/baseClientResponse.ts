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
  accessTokenValiditySeconds?: number
  grantType?: string
  mfa?: string
  mfaRememberMe?: boolean
  jwtFields?: string
  redirectUris?: string[]
  deployment: {
    clientType: string
    team: string
    teamContact: string
    teamSlack: string
    hosting: string
    namespace: string
    deployment: string
    secretName: string
    clientIdKey: string
    secretKey: string
    deploymentInfo: string
  }
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
