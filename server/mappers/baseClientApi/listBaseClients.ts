import { Request } from 'express'
import { ListBaseClientsResponse } from '../../interfaces/baseClientApi/baseClientResponse'
import { BaseClient, BaseClientListFilter } from '../../interfaces/baseClientApi/baseClient'
import { toClientType } from '../../data/enums/clientTypes'
import { toGrantType } from '../../data/enums/grantType'
import { kebab, multiSeparatorSplit, snake, toBaseClientId } from '../../utils/utils'

export const mapListBaseClientRequest = (request: Request): BaseClientListFilter => {
  const asJson = JSON.stringify(request.query)
  const data = asJson ? JSON.parse(asJson) : {}

  const filter: BaseClientListFilter = {}
  if (data.role) {
    filter.roleSearch = data.role.trim()
  }
  if (data.grantType) {
    filter.grantType = toGrantType(data.grantType)
  }
  if (data.clientType) {
    if (Array.isArray(data.clientType)) {
      filter.clientType = data.clientType.map(toClientType)
    } else {
      filter.clientType = [toClientType(data.clientType)]
    }
  }
  return filter
}

export const mapFilterToUrlQuery = (filter: BaseClientListFilter): string => {
  let urlQuery = ''
  if (filter.roleSearch) {
    urlQuery += `role=${encodeURIComponent(filter.roleSearch)}&`
  }
  if (filter.grantType) {
    urlQuery += `grantType=${kebab(filter.grantType)}&`
  }
  if (filter.clientType) {
    filter.clientType.forEach(clientType => {
      urlQuery += `clientType=${kebab(clientType)}&`
    })
  }

  if (urlQuery.endsWith('&')) {
    urlQuery = urlQuery.slice(0, -1)
  }

  return urlQuery
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
