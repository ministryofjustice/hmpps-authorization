import { Request } from 'express'
import { BaseClientListFilter } from '../../interfaces/baseClientApi/baseClient'

export default (request: Request): BaseClientListFilter => {
  // valid days is calculated from expiry date
  const data = request.body

  return {
    roleSearch: data.role.trim(),
    clientCredentials: data.grantType ? data.grantType.includes('client-credentials') : true,
    authorisationCode: data.grantType ? data.grantType.includes('authorization-code') : true,
    serviceClientType: data.clientType ? data.clientType.includes('service') : true,
    personalClientType: data.clientType ? data.clientType.includes('personal') : true,
    blankClientType: data.clientType ? data.clientType.includes('blank') : true,
  }
}
