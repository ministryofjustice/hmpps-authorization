import { Request } from 'express'
import { BaseClientListFilter } from '../../interfaces/baseClientApi/baseClient'
import { toGrantType } from '../../data/enums/grantType'
import { toClientType } from '../../data/enums/clientTypes'
import { snake } from '../../utils/utils'

export default (request: Request): BaseClientListFilter => {
  // valid days is calculated from expiry date
  const data = request.body

  const filter: BaseClientListFilter = {}
  if (data.role) {
    filter.roleSearch = data.role.trim()
  }

  if (data.grantType && data.grantType !== 'all') {
    filter.grantType = toGrantType(snake(data.grantType))
  }

  if (data.filterClientType === 'clientFilter') {
    const clientTypes = mapCheckboxes(data.clientType).map(snake).map(toClientType)

    // if no or all client types are selected, we don't want to filter by client type
    if (clientTypes.length > 0 && clientTypes.length < 3) {
      filter.clientType = clientTypes
    }
  }

  return filter
}

const mapCheckboxes = (value: string | string[]): string[] => {
  if (Array.isArray(value)) {
    return value
  }
  return value ? [value] : []
}
