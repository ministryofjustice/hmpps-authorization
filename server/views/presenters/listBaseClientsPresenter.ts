import { BaseClient, BaseClientListFilter } from '../../interfaces/baseClientApi/baseClient'
import { convertToTitleCase, dateFormatFromString, snake } from '../../utils/utils'
import { GrantTypes } from '../../data/enums/grantTypes'
import { ClientType } from '../../data/enums/clientTypes'

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

export const filterBaseClient = (baseClient: BaseClient, filter: BaseClientListFilter) => {
  if (filter.roleSearch) {
    const roles = baseClient.clientCredentials.authorities.join(' ').toLowerCase()
    const roleSearch = filter.roleSearch.toLowerCase().trim()
    if (roles.includes(roleSearch) === false) {
      return false
    }
  }

  const grantType = baseClient.grantType ? snake(baseClient.grantType) : ''
  const clientType =
    baseClient.deployment && baseClient.deployment.clientType ? snake(baseClient.deployment.clientType) : ''

  if (grantType === GrantTypes.ClientCredentials && !filter.clientCredentials) {
    return false
  }

  if (grantType === GrantTypes.AuthorizationCode && !filter.authorisationCode) {
    return false
  }

  if (clientType === ClientType.Personal && !filter.personalClientType) {
    return false
  }
  if (clientType === ClientType.Service && !filter.serviceClientType) {
    return false
  }

  if (clientType === '' && !filter.blankClientType) {
    return false
  }

  return true
}

type SelectedFilterCategory = {
  heading: { text: string }
  items: { href: string; text: string }[]
}

const getSelectedFilterCategories = (filter: BaseClientListFilter): SelectedFilterCategory[] => {
  const categories: SelectedFilterCategory[] = []
  if (filter.roleSearch) {
    categories.push({
      heading: {
        text: 'Role',
      },
      items: [{ href: '/base-clients', text: filter.roleSearch }],
    })
  }

  if (filter.clientCredentials === false || filter.authorisationCode === false) {
    const grantTypesCategory: SelectedFilterCategory = {
      heading: {
        text: 'Grant type',
      },
      items: [],
    }
    if (filter.clientCredentials) {
      grantTypesCategory.items.push({ href: '/base-clients', text: 'Client credentials' })
    }
    if (filter.authorisationCode) {
      grantTypesCategory.items.push({ href: '/base-clients', text: 'Authorisation code' })
    }
    categories.push(grantTypesCategory)
  }

  if (filter.personalClientType === false || filter.serviceClientType === false || filter.blankClientType === false) {
    const clientTypeCategory: SelectedFilterCategory = {
      heading: {
        text: 'Client type',
      },
      items: [],
    }
    if (filter.personalClientType) {
      clientTypeCategory.items.push({ href: '/base-clients', text: 'Personal' })
    }
    if (filter.serviceClientType) {
      clientTypeCategory.items.push({ href: '/base-clients', text: 'Service' })
    }
    if (filter.blankClientType) {
      clientTypeCategory.items.push({ href: '/base-clients', text: 'Blank' })
    }
    categories.push(clientTypeCategory)
  }

  return categories
}
export default (data: BaseClient[], filter?: BaseClientListFilter) => {
  const defaultFilter: BaseClientListFilter = {
    roleSearch: '',
    clientCredentials: true,
    authorisationCode: true,
    serviceClientType: true,
    personalClientType: true,
    blankClientType: true,
  }
  const currentFilter = filter || defaultFilter

  return {
    tableHead: indexTableHead(),
    tableRows: indexTableRows(data, filter),
    filter: currentFilter,
    showSelectedFilters: JSON.stringify(currentFilter) !== JSON.stringify(defaultFilter),
    selectedFilterCategories: getSelectedFilterCategories(currentFilter),
  }
}
