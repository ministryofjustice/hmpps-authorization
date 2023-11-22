import { dataAccess } from '../data'
import BaseClientService from './baseClientService'
import UserService from './userService'
import AuditService from './auditService'

export const services = () => {
  const { baseClientApiClientBuilder, manageUsersApiClient, applicationInfo } = dataAccess()

  const userService = new UserService(manageUsersApiClient)
  const baseClientService = new BaseClientService(baseClientApiClientBuilder)
  const auditService = new AuditService()

  return {
    applicationInfo,
    userService,
    baseClientService,
    auditService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService, BaseClientService }
