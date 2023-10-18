import { RequestHandler } from 'express'
import { BaseClientService } from '../services'
import listBaseClientsPresenter from '../views/presenters/listBaseClientsPresenter'

export default class BaseClientController {
  constructor(private readonly baseClientService: BaseClientService) {}

  public displayBaseClients(): RequestHandler {
    return async (req, res) => {
      const userToken = res.locals.user.token
      const baseClients = await this.baseClientService.listBaseClients(userToken)

      const presenter = listBaseClientsPresenter(baseClients)

      res.render('pages/base-clients.njk', {
        presenter,
      })
    }
  }
}