export interface AddBaseClientRequest {
  clientId: string
  scopes?: string[]
  authorities?: string[]
  ips?: string[]
  jiraNumber?: string
  databaseUserName?: string
  validDays?: number
  accessTokenValidityMinutes?: number
}

export interface UpdateBaseClientRequest {
  scopes: string[]
  authorities: string[]
  ips: string[]
  jiraNumber?: string
  databaseUserName?: string
  validDays?: number
  accessTokenValidityMinutes?: number
}

export interface UpdateBaseClientDeploymentRequest {
  clientType?: string
  team?: string
  teamContact?: string
  teamSlack?: string
  hosting?: string
  namespace?: string
  deployment?: string
  secretName?: string
  clientIdKey?: string
  secretKey?: string
  deploymentInfo?: string
}
