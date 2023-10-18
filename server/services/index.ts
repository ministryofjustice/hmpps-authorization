import { dataAccess } from '../data'
import BaseClientService from './baseClientService'
import UserService from './userService'

export const services = () => {
  const { hmppsAuthClient, baseClientApiClientBuilder, applicationInfo } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const baseClientService = new BaseClientService(baseClientApiClientBuilder)

  return {
    applicationInfo,
    userService,
    baseClientService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService, BaseClientService }
