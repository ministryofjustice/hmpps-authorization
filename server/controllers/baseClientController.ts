import { RequestHandler } from 'express'
import { BaseClientService } from '../services'
import listBaseClientsPresenter from '../views/presenters/listBaseClientsPresenter'
import viewBaseClientPresenter from '../views/presenters/viewBaseClientPresenter'
import nunjucksUtils from '../views/helpers/nunjucksUtils'
import { mapCreateBaseClientForm, mapEditBaseClientDeploymentForm, mapEditBaseClientDetailsForm } from '../mappers'
import { BaseClient } from '../interfaces/baseClientApi/baseClient'
import editBaseClientPresenter from '../views/presenters/editBaseClientPresenter'
import mapFilterForm from '../mappers/forms/mapFilterForm'
import { GrantTypes } from '../data/enums/grantTypes'
import { kebab } from '../utils/utils'
import baseClientAudit from '../audit/baseClientAudit'
import AuditService from '../services/auditService'
import { BaseClientEvent } from '../audit/baseClientEvent'

export default class BaseClientController {
  constructor(
    private readonly baseClientService: BaseClientService,
    private readonly auditService: AuditService,
  ) {}

  public displayBaseClients(): RequestHandler {
    return async (req, res) => {
      const { token, username } = res.locals.user
      const audit = baseClientAudit(username, this.auditService)
      await audit(BaseClientEvent.LIST_BASE_CLIENTS)

      try {
        const baseClients = await this.baseClientService.listBaseClients(token)
        const presenter = listBaseClientsPresenter(baseClients)

        res.render('pages/base-clients.njk', {
          presenter,
        })
      } catch (e) {
        await audit(BaseClientEvent.LIST_BASE_CLIENTS_FAILURE)
        throw e
      }
    }
  }

  public filterBaseClients(): RequestHandler {
    return async (req, res) => {
      const { token, username } = res.locals.user
      const filter = mapFilterForm(req)
      const audit = baseClientAudit(username, this.auditService)
      await audit(BaseClientEvent.LIST_BASE_CLIENTS)

      try {
        const baseClients = await this.baseClientService.listBaseClients(token)

        const presenter = listBaseClientsPresenter(baseClients, filter)

        res.render('pages/base-clients.njk', {
          presenter,
        })
      } catch (e) {
        await audit(BaseClientEvent.LIST_BASE_CLIENTS_FAILURE)
        throw e
      }
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
      if (!(grant === kebab(GrantTypes.ClientCredentials) || grant === kebab(GrantTypes.AuthorizationCode))) {
        res.render('pages/new-base-client-grant.njk')
        return
      }
      res.render('pages/new-base-client-details.njk', {
        grant,
        presenter: editBaseClientPresenter(null),
        ...nunjucksUtils,
      })
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

  public updateBaseClientDetails(): RequestHandler {
    return async (req, res, next) => {
      const userToken = res.locals.user.token
      const { baseClientId } = req.params

      // get current values
      const baseClient = await this.baseClientService.getBaseClient(userToken, baseClientId)

      // map form values to updated base client
      const updatedClient = mapEditBaseClientDetailsForm(baseClient, req)

      // update base client
      await this.baseClientService.updateBaseClient(userToken, updatedClient)

      // return to view base client page
      res.redirect(`/base-clients/${baseClientId}`)
    }
  }

  public displayEditBaseClientDeployment(): RequestHandler {
    return async (req, res) => {
      const userToken = res.locals.user.token
      const { baseClientId } = req.params
      const baseClient = await this.baseClientService.getBaseClient(userToken, baseClientId)

      res.render('pages/edit-base-client-deployment.njk', {
        baseClient,
      })
    }
  }

  public updateBaseClientDeployment(): RequestHandler {
    return async (req, res, next) => {
      const userToken = res.locals.user.token
      const { baseClientId } = req.params

      // get current values
      const baseClient = await this.baseClientService.getBaseClient(userToken, baseClientId)

      // map form values to updated base client
      const updatedClient = mapEditBaseClientDeploymentForm(baseClient, req)

      // update base client
      await this.baseClientService.updateBaseClientDeployment(userToken, updatedClient)

      // return to view base client page
      res.redirect(`/base-clients/${baseClientId}`)
    }
  }

  public createClientInstance(): RequestHandler {
    return async (req, res, next) => {
      const userToken = res.locals.user.token
      const { baseClientId } = req.params

      // get base client
      const baseClient = await this.baseClientService.getBaseClient(userToken, baseClientId)

      // Create base client
      const secrets = await this.baseClientService.addClientInstance(userToken, baseClient)

      // Display success page
      res.render('pages/new-base-client-success.njk', {
        title: `Client has been added`,
        baseClientId: baseClient.baseClientId,
        secrets,
      })
    }
  }

  public displayDeleteClientInstance(): RequestHandler {
    return async (req, res, next) => {
      const userToken = res.locals.user.token
      const { baseClientId, clientId } = req.params
      const error = req.query.error === 'clientIdMismatch' ? 'Client ID does not match' : null

      // get base client
      const baseClient = await this.baseClientService.getBaseClient(userToken, baseClientId)
      const clients = await this.baseClientService.listClientInstances(userToken, baseClient)

      // Display delete confirmation page
      res.render('pages/delete-client-instance.njk', {
        baseClient,
        clientId,
        isLastClient: clients.length === 1,
        error,
      })
    }
  }

  public deleteClientInstance(): RequestHandler {
    return async (req, res, next) => {
      const userToken = res.locals.user.token
      const { baseClientId, clientId } = req.params

      // check client id matches
      if (req.body.confirm !== clientId) {
        res.redirect(`/base-clients/${baseClientId}/clients/${clientId}/delete?error=clientIdMismatch`)
        return
      }

      // get base client
      const baseClient = await this.baseClientService.getBaseClient(userToken, baseClientId)
      const clients = await this.baseClientService.listClientInstances(userToken, baseClient)
      const client = clients.find(c => c.clientId === clientId)

      // check client exists
      if (!client) {
        res.redirect(`/base-clients/${baseClientId}/clients/${clientId}/delete?error=clientNotFound`)
        return
      }

      // delete client
      await this.baseClientService.deleteClientInstance(userToken, client)

      // return to view base client screen (or home screen if last client deleted)
      if (clients.length === 1) {
        res.redirect(`/`)
      } else {
        res.redirect(`/base-clients/${baseClientId}`)
      }
    }
  }
}
