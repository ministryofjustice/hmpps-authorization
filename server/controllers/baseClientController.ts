import { RequestHandler } from 'express'
import { BaseClientService } from '../services'
import listBaseClientsPresenter from '../views/presenters/listBaseClientsPresenter'
import viewBaseClientPresenter from '../views/presenters/viewBaseClientPresenter'
import nunjucksUtils from '../views/helpers/nunjucksUtils'
import { mapCreateBaseClientForm } from '../mappers'
import { BaseClient } from '../interfaces/baseClientApi/baseClient'
import editBaseClientPresenter from '../views/presenters/editBaseClientPresenter'

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

  public displayNewBaseClient(): RequestHandler {
    return async (req, res) => {
      const { grant } = req.query
      if (!(grant === 'client-credentials' || grant === 'authorization-code')) {
        res.render('pages/new-base-client-grant.njk')
        return
      }
      res.render('pages/new-base-client-details.njk', { grant, ...nunjucksUtils })
    }
  }

  public createBaseClient(): RequestHandler {
    return async (req, res, next) => {
      const userToken = res.locals.user.token
      const baseClient = mapCreateBaseClientForm(req)

      // Simple validation
      const error = await this.validateCreateBaseClient(userToken, baseClient)
      if (error) {
        res.render('pages/new-base-client-details.njk', {
          errorMessage: { text: error },
          grant: baseClient.grantType,
          baseClient,
          presenter: editBaseClientPresenter(baseClient),
          ...nunjucksUtils,
        })
        return
      }

      // Create base client
      const secrets = await this.baseClientService.addBaseClient(userToken, baseClient)

      // Display success page
      res.render('pages/new-base-client-success.njk', {
        title: `Client has been added`,
        baseClientId: baseClient.baseClientId,
        secrets,
      })
    }
  }

  async validateCreateBaseClient(userToken: string, baseClient: BaseClient) {
    // if baseClient.baseClientId is null or empty string, throw error
    if (!baseClient.baseClientId) {
      return 'This field is required'
    }

    // if baseClient.baseClientId is not unique, throw error
    try {
      await this.baseClientService.getBaseClient(userToken, baseClient.baseClientId)
      return 'A base client with this ID already exists'
    } catch (e) {
      return ''
    }
  }

  public displayEditBaseClient(): RequestHandler {
    return async (req, res) => {
      const userToken = res.locals.user.token
      const { baseClientId } = req.params
      const baseClient = await this.baseClientService.getBaseClient(userToken, baseClientId)

      const presenter = editBaseClientPresenter(baseClient)
      res.render('pages/edit-base-client-details.njk', {
        baseClient,
        presenter,
        ...nunjucksUtils,
      })
    }
  }
}
