import { BaseClient, BaseClientListFilter } from '../../interfaces/baseClientApi/baseClient'
import { convertToTitleCase, dateFormatFromString } from '../../utils/utils'
import { GrantType, toGrantType } from '../../data/enums/grantType'
import { ClientType, toClientType } from '../../data/enums/clientTypes'
import { mapFilterToUrlQuery } from '../../mappers/baseClientApi/listBaseClients'

const indexTableHead = () => {
  return [
    {
      text: 'Client',
      classes: 'app-custom-class',
      attributes: {
        'aria-sort': 'ascending',
      },
    },
    {
      text: 'Count',
      classes: 'app-custom-class',
      attributes: {
        'aria-sort': 'none',
      },
    },
    {
      text: 'Service',
      classes: 'app-custom-class',
      attributes: {
        'aria-sort': 'none',
      },
    },
    {
      text: 'Team name',
      classes: 'app-custom-class',
      attributes: {
        'aria-sort': 'none',
      },
    },
    {
      text: 'Grant types',
      classes: 'app-custom-class',
      attributes: {
        'aria-sort': 'none',
      },
    },
    {
      text: 'Roles',
      classes: 'app-custom-class',
      attributes: {
        'aria-sort': 'none',
      },
    },
    {
      text: 'Last accessed',
      classes: 'app-custom-class',
      attributes: {
        'aria-sort': 'none',
      },
    },
    {
      text: 'Expired',
      classes: 'app-custom-class',
      attributes: {
        'aria-sort': 'none',
      },
    },
  ]
}

const indexTableRows = (data: BaseClient[], filter?: BaseClientListFilter) => {
  const dataItems = filterItems(data, filter)

  return dataItems.map(item => [
    {
      html: `<a href='/base-clients/${item.baseClientId}'>${item.baseClientId}</a>`,
      attributes: {
        'data-qa': 'baseClientList',
      },
    },
    {
      html: item.count > 1 ? `<span class='moj-badge'>${item.count}</span>` : '',
    },
    {
      text: item.deployment && item.deployment.clientType ? convertToTitleCase(item.deployment.clientType) : '',
    },
    {
      text: item.deployment.team,
    },
    {
      html: item.grantType,
    },
    {
      html: item.clientCredentials.authorities.join('<br>'),
    },
    {
      text: dateFormatFromString(item.lastAccessed),
    },
    {
      html: item.expired ? `<span class='moj-badge moj-badge--grey'>Expired</span>` : '',
    },
  ])
}

const filterItems = (data: BaseClient[], filter?: BaseClientListFilter) => {
  return filter ? data.filter(item => filterBaseClient(item, filter)) : data
}

const filterByRoleSearch = (baseClient: BaseClient, roleSearch: string): boolean => {
  if (roleSearch) {
    const roles = baseClient.clientCredentials.authorities.join(' ').toLowerCase()
    const roleSearchLower = roleSearch.toLowerCase().trim()
    return roles.includes(roleSearchLower)
  }
  return true
}

const filterByGrantType = (baseClient: BaseClient, grantTypeFilter: GrantType | undefined): boolean => {
  const grantType = baseClient.grantType ? toGrantType(baseClient.grantType) : null
  return grantTypeFilter ? grantType === grantTypeFilter : true
}

const filterByClientType = (baseClient: BaseClient, clientTypeFilter: ClientType[] | undefined): boolean => {
  const clientType =
    baseClient.deployment && baseClient.deployment.clientType
      ? toClientType(baseClient.deployment.clientType)
      : ClientType.Blank
  return clientTypeFilter ? clientTypeFilter.includes(clientType) : true
}

export const filterBaseClient = (baseClient: BaseClient, filter: BaseClientListFilter): boolean => {
  return (
    filterByRoleSearch(baseClient, filter.roleSearch) &&
    filterByGrantType(baseClient, filter.grantType) &&
    filterByClientType(baseClient, filter.clientType)
  )
}

type SelectedFilterCategory = {
  heading: { text: string }
  items: { href: string; text: string }[]
}

const createRoleSearchCategory = (filter: BaseClientListFilter): SelectedFilterCategory[] => {
  return filter.roleSearch
    ? [
        {
          heading: { text: 'Role' },
          items: [{ href: removeFilterLink(filter, 'roleSearch'), text: filter.roleSearch }],
        },
      ]
    : []
}

const createGrantTypeCategory = (filter: BaseClientListFilter): SelectedFilterCategory[] => {
  if (!filter.grantType) return []

  const grantTypesCategory: SelectedFilterCategory = {
    heading: { text: 'Grant type' },
    items: [],
  }

  if (filter.grantType === GrantType.ClientCredentials) {
    grantTypesCategory.items.push({ href: removeFilterLink(filter, 'clientCredentials'), text: 'Client credentials' })
  }

  if (filter.grantType === GrantType.AuthorizationCode) {
    grantTypesCategory.items.push({ href: removeFilterLink(filter, 'authorisationCode'), text: 'Authorisation code' })
  }

  return [grantTypesCategory]
}

const createClientTypeCategory = (filter: BaseClientListFilter): SelectedFilterCategory[] => {
  if (!filter.clientType) return []

  const clientTypeCategory: SelectedFilterCategory = {
    heading: { text: 'Client type' },
    items: [],
  }

  if (filter.clientType.includes(ClientType.Personal)) {
    clientTypeCategory.items.push({ href: removeFilterLink(filter, 'personalClientType'), text: 'Personal' })
  }

  if (filter.clientType.includes(ClientType.Service)) {
    clientTypeCategory.items.push({ href: removeFilterLink(filter, 'serviceClientType'), text: 'Service' })
  }

  if (filter.clientType.includes(ClientType.Blank)) {
    clientTypeCategory.items.push({ href: removeFilterLink(filter, 'blankClientType'), text: 'Blank' })
  }

  if (clientTypeCategory.items.length > 0 && clientTypeCategory.items.length < 3) {
    return [clientTypeCategory]
  }
  return []
}

const getSelectedFilterCategories = (filter?: BaseClientListFilter): SelectedFilterCategory[] => {
  if (!filter) return []
  return [...createRoleSearchCategory(filter), ...createGrantTypeCategory(filter), ...createClientTypeCategory(filter)]
}

const removeRoleSearchFilter = (filter: BaseClientListFilter, filterToRemove: string): BaseClientListFilter => {
  if (filter.roleSearch && filterToRemove !== 'roleSearch') {
    return { roleSearch: filter.roleSearch }
  }
  return {}
}

const removeGrantTypeFilter = (filter: BaseClientListFilter, filterToRemove: string): BaseClientListFilter => {
  if (filter.grantType && !['clientCredentials', 'authorisationCode'].includes(filterToRemove)) {
    return { grantType: filter.grantType }
  }
  return {}
}

const removeClientTypeFilter = (filter: BaseClientListFilter, filterToRemove: string): BaseClientListFilter => {
  if (filter.clientType) {
    let clients = filter.clientType
    if (filterToRemove === 'personalClientType') {
      clients = clients.filter(client => client !== ClientType.Personal)
    }
    if (filterToRemove === 'serviceClientType') {
      clients = clients.filter(client => client !== ClientType.Service)
    }
    if (filterToRemove === 'blankClientType') {
      clients = clients.filter(client => client !== ClientType.Blank)
    }
    if (clients.length > 0 && clients.length < 3) {
      return { clientType: clients }
    }
  }
  return {}
}

const removeFilterLink = (filter: BaseClientListFilter, filterToRemove: string): string => {
  const newFilter: BaseClientListFilter = {
    ...removeRoleSearchFilter(filter, filterToRemove),
    ...removeGrantTypeFilter(filter, filterToRemove),
    ...removeClientTypeFilter(filter, filterToRemove),
  }

  const query = mapFilterToUrlQuery(newFilter)
  return query ? `/?${query}` : '/'
}

const showSelectedFilters = (filter?: BaseClientListFilter) => {
  if (!filter) return false
  return !(!filter.roleSearch && !filter.grantType && !filter.clientType)
}

export default (data: BaseClient[], filter?: BaseClientListFilter) => {
  return {
    tableHead: indexTableHead(),
    tableRows: indexTableRows(data, filter),
    filter: filter || {},
    showSelectedFilters: showSelectedFilters(filter),
    selectedFilterCategories: getSelectedFilterCategories(filter),
  }
}
