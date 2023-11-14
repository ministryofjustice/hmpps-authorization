import { BaseClient, BaseClientListFilter } from '../../interfaces/baseClientApi/baseClient'
import { convertToTitleCase, snake } from '../../utils/utils'
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
      text: 'Secret updated',
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
      text: item.clientType ? convertToTitleCase(item.clientType) : '',
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
      text: '2023/09/01 12:00:00',
    },
    {
      text: '2023/09/01 12:00:00',
    },
    {
      text: '',
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
  const clientType = baseClient.clientType ? snake(baseClient.clientType) : ''

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

export default (data: BaseClient[], filter?: BaseClientListFilter) => {
  return {
    tableHead: indexTableHead(),
    tableRows: indexTableRows(data, filter),
    filter: filter || {
      roleSearch: '',
      clientCredentials: true,
      authorisationCode: true,
      serviceClientType: true,
      personalClientType: true,
      blankClientType: true,
    },
  }
}
