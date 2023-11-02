import { dataAccess } from '../data'
import BaseClientService from './baseClientService'
import UserService from './userService'

export const services = () => {
  const { baseClientApiClientBuilder, manageUsersApiClient, applicationInfo } = dataAccess()

  const userService = new UserService(manageUsersApiClient)
  const baseClientService = new BaseClientService(baseClientApiClientBuilder)

  return {
    applicationInfo,
    userService,
    baseClientService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService, BaseClientService }
