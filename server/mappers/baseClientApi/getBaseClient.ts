import { GetBaseClientResponse } from '../../interfaces/baseClientApi/baseClientResponse'
import { BaseClient, DeploymentDetails } from '../../interfaces/baseClientApi/baseClient'
import { ClientType } from '../../data/enums/clientTypes'
import { HostingType } from '../../data/enums/hostingTypes'
import { snake, toBaseClientId } from '../../utils/utils'

export default (response: GetBaseClientResponse): BaseClient => {
  return {
    baseClientId: toBaseClientId(response.clientId),
    accessTokenValidity: response.accessTokenValiditySeconds ? response.accessTokenValiditySeconds : 0,
    scopes: response.scopes ? response.scopes : [],
    grantType: snake(response.grantType),
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
      serviceRoles: response.serviceAuthorities ? response.serviceAuthorities : [],
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
