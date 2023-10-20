import { RequestHandler } from 'express'
import { BaseClientService } from '../services'
import listBaseClientsPresenter from '../views/presenters/listBaseClientsPresenter'
import viewBaseClientPresenter from '../views/presenters/viewBaseClientPresenter'
import nunjucksUtils from '../views/helpers/nunjucksUtils'

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

  public displayBaseClient(): RequestHandler {
    return async (req, res) => {
      const userToken = res.locals.user.token
      const { baseClientId } = req.params
      const baseClient = await this.baseClientService.getBaseClient(userToken, baseClientId)
      const clients = await this.baseClientService.listClientInstances(userToken, baseClient)

      const presenter = viewBaseClientPresenter(baseClient, clients)
      res.render('pages/base-client.njk', {
        baseClient,
        presenter,
        ...nunjucksUtils,
      })
    }
  }
}
