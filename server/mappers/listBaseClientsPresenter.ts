import { BaseClient } from '../interfaces/baseClientApi/baseClient'
import { convertToTitleCase } from '../utils/utils'

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

const indexTableRows = (data: BaseClient[]) => {
  return data.map(item => [
    {
      html: `<a href="/clients/${item.baseClientId}">${item.baseClientId}</a>`,
    },
    {
      html: item.count > 1 ? `<span class="moj-badge">${item.count}</span>` : '',
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

export default (data: BaseClient[]) => {
  return {
    tableHead: indexTableHead(),
    tableRows: indexTableRows(data),
  }
}
