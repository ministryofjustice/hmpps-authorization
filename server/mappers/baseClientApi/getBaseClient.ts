import { GetBaseClientResponse } from '../../interfaces/baseClientApi/baseClientResponse'
import { BaseClient, DeploymentDetails } from '../../interfaces/baseClientApi/baseClient'
import { GrantTypes } from '../../data/enums/grantTypes'
import { ClientType } from '../../data/enums/clientTypes'
import { HostingType } from '../../data/enums/hostingTypes'
import { snake } from '../../utils/utils'

export default (response: GetBaseClientResponse): BaseClient => {
  return {
    baseClientId: response.clientId,
    accessTokenValidity: response.accessTokenValidityMinutes ? response.accessTokenValidityMinutes * 60 : 0,
    scopes: response.scopes ? response.scopes : [],
    grantType:
      response.grantType === 'CLIENT_CREDENTIALS' ? GrantTypes.ClientCredentials : GrantTypes.AuthorizationCode,
    audit: response.jiraNumber ? response.jiraNumber : '',
    count: 1,
    clientCredentials: {
      authorities: response.authorities ? response.authorities : [],
      databaseUserName: response.databaseUserName ? response.databaseUserName : '',
    },
    authorisationCode: {
      registeredRedirectURIs: response.redirectUris,
      jwtFields: response.jwtFields ? response.jwtFields : '',
      azureAdLoginFlow: false,
      mfaRememberMe: response.mfaRememberMe ? response.mfaRememberMe : false,
      mfa: response.mfa ? response.mfa : '',
    },
    service: {
      serviceName: '',
      description: '',
      authorisedRoles: [],
      url: '',
      contact: '',
      status: '',
    },
    deployment: getDeployment(response),
    config: {
      allowedIPs: response.ips ? response.ips : [],
      expiryDate: response.validDays
        ? new Date(Date.now() + response.validDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : null,
    },
  } as BaseClient
}

const getClientType = (response: GetBaseClientResponse): string => {
  if (!response.deployment || !response.deployment.clientType) {
    return ''
  }

  const clientType = snake(response.deployment.clientType)
  if (clientType === ClientType.Personal || clientType === ClientType.Service) {
    return clientType
  }
  return ''
}

const getHostingType = (response: GetBaseClientResponse): string => {
  if (!response.deployment || !response.deployment.hosting) {
    return ''
  }

  const hostingType = snake(response.deployment.hosting)
  if (hostingType === HostingType.Cloud || hostingType === HostingType.Other) {
    return hostingType
  }

  return ''
}

const getDeployment = (response: GetBaseClientResponse): DeploymentDetails => {
  if (!response.deployment) {
    return null
  }

  const { deployment } = response
  deployment.hosting = getHostingType(response)
  deployment.clientType = getClientType(response)

  return deployment
}
