import { Request } from 'express'
import { BaseClientListFilter } from '../../interfaces/baseClientApi/baseClient'
import { GrantTypes } from '../../data/enums/grantTypes'
import { ClientType } from '../../data/enums/clientTypes'
import { snake } from '../../utils/utils'

export default (request: Request): BaseClientListFilter => {
  // valid days is calculated from expiry date
  const data = request.body

  const grantTypes = data.grantType ? data.grantType.map(snake) : []
  const clientTypes = data.clientType ? data.clientType.map(snake) : []

  return {
    roleSearch: data.role.trim(),
    clientCredentials: grantTypes.includes(GrantTypes.ClientCredentials),
    authorisationCode: grantTypes.includes(GrantTypes.AuthorizationCode),
    serviceClientType: clientTypes.includes(ClientType.Service),
    personalClientType: clientTypes.includes(ClientType.Personal),
    blankClientType: clientTypes.includes('blank'),
  }
}
