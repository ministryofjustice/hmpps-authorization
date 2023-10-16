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
