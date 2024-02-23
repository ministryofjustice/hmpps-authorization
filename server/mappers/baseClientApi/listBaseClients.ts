import { Request } from 'express'
import { ListBaseClientsResponse } from '../../interfaces/baseClientApi/baseClientResponse'
import { BaseClient, BaseClientListFilter } from '../../interfaces/baseClientApi/baseClient'
import { kebab, multiSeparatorSplit, snake, toBaseClientId } from '../../utils/utils'
import { GrantTypes } from '../../data/enums/grantTypes'
import { ClientType } from '../../data/enums/clientTypes'

export const mapListBaseClientRequest = (request: Request): BaseClientListFilter => {
  const asJson = JSON.stringify(request.query)
  const data = asJson ? JSON.parse(asJson) : {}

  const grantTypes = mapQueryList(data.grantType, [GrantTypes.ClientCredentials, GrantTypes.AuthorizationCode]).map(
    snake,
  )
  const clientTypes = mapQueryList(data.clientType, [ClientType.Personal, ClientType.Service, 'blank']).map(snake)

  return {
    roleSearch: data.role ? data.role.trim() : '',
    clientCredentials: grantTypes.includes(GrantTypes.ClientCredentials),
    authorisationCode: grantTypes.includes(GrantTypes.AuthorizationCode),
    serviceClientType: clientTypes.includes(ClientType.Service),
    personalClientType: clientTypes.includes(ClientType.Personal),
    blankClientType: clientTypes.includes('blank'),
  }
}

export const mapFilterToUrlQuery = (filter: BaseClientListFilter): string => {
  let urlQuery = ''
  if (filter.roleSearch) {
    urlQuery += `role=${encodeURIComponent(filter.roleSearch)}&`
  }
  if (!(filter.clientCredentials && filter.authorisationCode)) {
    if (filter.clientCredentials) {
      urlQuery += `grantType=${kebab(GrantTypes.ClientCredentials)}&`
    }
    if (filter.authorisationCode) {
      urlQuery += `grantType=${kebab(GrantTypes.AuthorizationCode)}&`
    }
  }
  if (!(filter.personalClientType && filter.serviceClientType && filter.blankClientType)) {
    if (filter.personalClientType) {
      urlQuery += `clientType=${kebab(ClientType.Personal)}&`
    }
    if (filter.serviceClientType) {
      urlQuery += `clientType=${kebab(ClientType.Service)}&`
    }
    if (filter.blankClientType) {
      urlQuery += `clientType=blank&`
    }
  }
  if (urlQuery.endsWith('&')) {
    urlQuery = urlQuery.slice(0, -1)
  }
  return urlQuery
}

const mapQueryList = (value: string | string[], defaults: string[]): string[] => {
  if (Array.isArray(value)) {
    return value
  }
  return value ? [value] : defaults
}

export default (response: ListBaseClientsResponse): BaseClient[] => {
  const { clients } = response
  if (!clients) {
    return []
  }
  return clients.map(
    client =>
      ({
        baseClientId: toBaseClientId(client.baseClientId),
        accessTokenValidity: 24000,
        scopes: [],
        grantType: snake(client.grantType),
        audit: '',
        count: client.count ? client.count : 0,
        lastAccessed: client.lastAccessed ? client.lastAccessed : '',
        expired: client.expired,
        clientCredentials: {
          authorities: multiSeparatorSplit(client.roles, [' ', ',', '\n']),
          databaseUserName: '',
        },
        authorisationCode: {
          registeredRedirectURIs: [],
          jwtFields: '',
          azureAdLoginFlow: false,
        },
        service: {
          serviceName: client.teamName || '',
          description: '',
          authorisedRoles: multiSeparatorSplit(client.roles, [' ', ',', '\n']),
          url: '',
          contact: '',
          status: '',
        },
        deployment: {
          clientType: snake(client.clientType),
          team: client.teamName || '',
          teamContact: '',
          teamSlack: '',
          hosting: '',
          namespace: '',
          deployment: '',
          secretName: '',
          clientIdKey: '',
        },
        config: {
          allowedIPs: [],
          expiryDate: null,
        },
      }) as BaseClient,
  )
}
