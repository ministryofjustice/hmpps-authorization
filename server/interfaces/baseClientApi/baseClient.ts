export interface BaseClient {
  baseClientId: string
  clientType: string
  accessTokenValidity: number
  scopes: string[]
  grantType: string
  audit: string
  count: number
  clientCredentials: ClientCredentialsDetails
  authorisationCode: AuthorisationCodeDetails
  service: ServiceDetails
  deployment: DeploymentDetails
  config: ClientConfig
}

interface ClientCredentialsDetails {
  authorities: string[]
  databaseUserName: string
}

interface AuthorisationCodeDetails {
  registeredRedirectURIs: string[]
  jwtFields: string
  azureAdLoginFlow: boolean
}

interface ServiceDetails {
  serviceName: string
  description: string
  authorisedRoles: string[]
  url: string
  contact: string
  status: string
}
interface DeploymentDetails {
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

interface ClientConfig {
  expiryDate?: string
  allowedIPs: string[]
}

export interface ClientSecrets {
  clientId: string
  clientSecret: string
  base64ClientId: string
  base64ClientSecret: string
}

export interface BaseClientListFilter {
  roleSearch: string
  clientCredentials: boolean
  authorisationCode: boolean
  serviceClientType: boolean
  personalClientType: boolean
  blankClientType: boolean
}
