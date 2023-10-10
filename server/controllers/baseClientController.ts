import { RequestHandler } from 'express'
import { RestClientBuilder } from '../data'
import BaseClientApiClient from '../data/baseClientApiClient'
import { BaseClientService } from '../services'
import listBaseClientsPresenter from '../mappers/listBaseClientsPresenter'

export default class BaseClientController {
  constructor(private readonly baseClientService: BaseClientService) {}

  public displayBaseClients(): RequestHandler {
    return async (req, res) => {
      const userToken = res.locals.user.token
      const baseClients = await this.baseClientService.getBaseClients(userToken)

      const presenter = listBaseClientsPresenter(baseClients)

      res.render('pages/base-clients.njk', {
        presenter,
      })
    }
  }
}
