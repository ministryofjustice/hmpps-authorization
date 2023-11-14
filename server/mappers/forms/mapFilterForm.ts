import { Request } from 'express'
import { BaseClientListFilter } from '../../interfaces/baseClientApi/baseClient'
import { GrantTypes } from '../../data/enums/grantTypes'
import { ClientType } from '../../data/enums/clientTypes'
import { snake } from '../../utils/utils'

export default (request: Request): BaseClientListFilter => {
  // valid days is calculated from expiry date
  const data = request.body

  const grantType = data.grantType ? snake(data.grantType) : ''
  const clientType = data.clientType ? snake(data.clientType) : ''

  return {
    roleSearch: data.role.trim(),
    clientCredentials: grantType ? grantType.includes(GrantTypes.ClientCredentials) : true,
    authorisationCode: grantType ? grantType.includes(GrantTypes.AuthorizationCode) : true,
    serviceClientType: clientType ? clientType.includes(ClientType.Service) : true,
    personalClientType: clientType ? clientType.includes(ClientType.Personal) : true,
    blankClientType: clientType ? clientType.includes('blank') : true,
  }
}
