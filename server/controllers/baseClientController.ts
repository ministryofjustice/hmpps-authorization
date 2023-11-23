import { RequestHandler, Response } from 'express'
import { BaseClientService } from '../services'
import listBaseClientsPresenter from '../views/presenters/listBaseClientsPresenter'
import viewBaseClientPresenter from '../views/presenters/viewBaseClientPresenter'
import nunjucksUtils from '../views/helpers/nunjucksUtils'
import { mapCreateBaseClientForm, mapEditBaseClientDeploymentForm, mapEditBaseClientDetailsForm } from '../mappers'
import { BaseClient, ClientSecrets } from '../interfaces/baseClientApi/baseClient'
import editBaseClientPresenter from '../views/presenters/editBaseClientPresenter'
import mapFilterForm from '../mappers/forms/mapFilterForm'
import { GrantTypes } from '../data/enums/grantTypes'
import { kebab } from '../utils/utils'
import baseClientAudit, { BaseClientAuditFunction } from '../audit/baseClientAudit'
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
      const { token, username } = res.locals.user
      const { baseClientId } = req.params
      const audit = baseClientAudit(username, this.auditService)
      await audit(BaseClientEvent.VIEW_BASE_CLIENT, baseClientId)

      try {
        const baseClient = await this.baseClientService.getBaseClient(token, baseClientId)
        const clients = await this.baseClientService.listClientInstances(token, baseClient)

        const presenter = viewBaseClientPresenter(baseClient, clients)
        res.render('pages/base-client.njk', {
          baseClient,
          presenter,
          ...nunjucksUtils,
        })
      } catch (e) {
        await audit(BaseClientEvent.VIEW_BASE_CLIENT_FAILURE, baseClientId)
        throw e
      }
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
      const { token, username } = res.locals.user
      const audit = baseClientAudit(username, this.auditService)

      await audit(BaseClientEvent.CREATE_BASE_CLIENT)
      try {
        const baseClient = mapCreateBaseClientForm(req)

        const error = await this.validateCreateBaseClient(token, baseClient)
        if (error) {
          await audit(BaseClientEvent.CREATE_BASE_CLIENT_FAILURE, '', { error })
          this.renderCreateBaseClientErrorPage(res, error, baseClient)
          return
        }

        const secrets = await this.baseClientService.addBaseClient(token, baseClient)
        await this.renderSecretsPage(res, baseClient, secrets, audit)
      } catch (e) {
        await audit(BaseClientEvent.CREATE_BASE_CLIENT_FAILURE)
        throw e
      }
    }
  }

  async validateCreateBaseClient(token: string, baseClient: BaseClient) {
    // if baseClient.baseClientId is null or empty string, throw error
    if (!baseClient.baseClientId) {
      return 'This field is required'
    }

    // if baseClient.baseClientId is not unique, throw error
    try {
      await this.baseClientService.getBaseClient(token, baseClient.baseClientId)
      return 'A base client with this ID already exists'
    } catch (e) {
      return ''
    }
  }

  public displayEditBaseClient(): RequestHandler {
    return async (req, res) => {
      const { token } = res.locals.user
      const { baseClientId } = req.params
      const baseClient = await this.baseClientService.getBaseClient(token, baseClientId)

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
      const { token, username } = res.locals.user
      const { baseClientId } = req.params
      const audit = baseClientAudit(username, this.auditService)
      await audit(BaseClientEvent.UPDATE_BASE_CLIENT, baseClientId)

      try {
        // get current values
        const baseClient = await this.baseClientService.getBaseClient(token, baseClientId)

        // map form values to updated base client
        const updatedClient = mapEditBaseClientDetailsForm(baseClient, req)

        // update base client
        await this.baseClientService.updateBaseClient(token, updatedClient)

        // return to view base client page
        res.redirect(`/base-clients/${baseClientId}`)
      } catch (e) {
        await audit(BaseClientEvent.UPDATE_BASE_CLIENT_FAILURE, baseClientId)
        throw e
      }
    }
  }

  public displayEditBaseClientDeployment(): RequestHandler {
    return async (req, res) => {
      const { token } = res.locals.user
      const { baseClientId } = req.params
      const baseClient = await this.baseClientService.getBaseClient(token, baseClientId)

      res.render('pages/edit-base-client-deployment.njk', {
        baseClient,
      })
    }
  }

  public updateBaseClientDeployment(): RequestHandler {
    return async (req, res, next) => {
      const { token, username } = res.locals.user
      const { baseClientId } = req.params
      const audit = baseClientAudit(username, this.auditService)
      await audit(BaseClientEvent.UPDATE_BASE_CLIENT_DEPLOYMENT, baseClientId)

      try {
        // get current values
        const baseClient = await this.baseClientService.getBaseClient(token, baseClientId)

        // map form values to updated base client
        const updatedClient = mapEditBaseClientDeploymentForm(baseClient, req)

        // update base client
        await this.baseClientService.updateBaseClientDeployment(token, updatedClient)

        // return to view base client page
        res.redirect(`/base-clients/${baseClientId}`)
      } catch (e) {
        await audit(BaseClientEvent.UPDATE_BASE_CLIENT_DEPLOYMENT_FAILURE, baseClientId)
        throw e
      }
    }
  }

  public createClientInstance(): RequestHandler {
    return async (req, res, next) => {
      const { token, username } = res.locals.user
      const { baseClientId } = req.params
      const audit = baseClientAudit(username, this.auditService)

      try {
        await audit(BaseClientEvent.CREATE_CLIENT, baseClientId)
        const baseClient = await this.getBaseClient(token, baseClientId)
        const secrets = await this.addClientInstance(token, baseClient)

        await this.renderSecretsPage(res, baseClient, secrets, audit)
      } catch (e) {
        await audit(BaseClientEvent.CREATE_CLIENT_FAILURE, baseClientId)
        throw e
      }
    }
  }

  public displayDeleteClientInstance(): RequestHandler {
    return async (req, res, next) => {
      const { token } = res.locals.user
      const { baseClientId, clientId } = req.params
      const error = req.query.error === 'clientIdMismatch' ? 'Client ID does not match' : null

      // get base client
      const baseClient = await this.baseClientService.getBaseClient(token, baseClientId)
      const clients = await this.baseClientService.listClientInstances(token, baseClient)

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
      const { token, username } = res.locals.user
      const { baseClientId, clientId } = req.params
      const audit = baseClientAudit(username, this.auditService)
      await audit(BaseClientEvent.DELETE_CLIENT, baseClientId, { clientId })

      try {
        // check client id matches
        if (req.body.confirm !== clientId) {
          await audit(BaseClientEvent.DELETE_CLIENT_FAILURE)
          res.redirect(`/base-clients/${baseClientId}/clients/${clientId}/delete?error=clientIdMismatch`)
          return
        }

        // get base client
        const baseClient = await this.baseClientService.getBaseClient(token, baseClientId)
        const clients = await this.baseClientService.listClientInstances(token, baseClient)
        const client = clients.find(c => c.clientId === clientId)

        // check client exists
        if (!client) {
          res.redirect(`/base-clients/${baseClientId}/clients/${clientId}/delete?error=clientNotFound`)
          return
        }

        // delete client
        await this.baseClientService.deleteClientInstance(token, client)

        // return to view base client screen (or home screen if last client deleted)
        if (clients.length === 1) {
          res.redirect(`/`)
        } else {
          res.redirect(`/base-clients/${baseClientId}`)
        }
      } catch (e) {
        await audit(BaseClientEvent.DELETE_CLIENT_FAILURE, baseClientId, { clientId })
        throw e
      }
    }
  }

  private async getBaseClient(token: string, baseClientId: string) {
    return this.baseClientService.getBaseClient(token, baseClientId)
  }

  private async addClientInstance(token: string, baseClient: BaseClient) {
    return this.baseClientService.addClientInstance(token, baseClient)
  }

  private async renderSecretsPage(
    res: Response,
    baseClient: BaseClient,
    secrets: ClientSecrets,
    audit: BaseClientAuditFunction,
  ) {
    await audit(BaseClientEvent.VIEW_CLIENT_SECRETS, baseClient.baseClientId, { clientId: secrets.clientId })
    res.render(
      'pages/new-base-client-success.njk',
      {
        title: `Client has been added`,
        baseClientId: baseClient.baseClientId,
        secrets,
      },
      (err, _html) => {
        if (err) {
          audit(BaseClientEvent.VIEW_CLIENT_SECRETS_FAILURE, baseClient.baseClientId, { clientId: secrets.clientId })
        }
      },
    )
  }

  private renderCreateBaseClientErrorPage(res: Response, error: string, baseClient: BaseClient) {
    res.render('pages/new-base-client-details.njk', {
      errorMessage: { text: error },
      grant: baseClient.grantType,
      baseClient,
      presenter: editBaseClientPresenter(baseClient),
      ...nunjucksUtils,
    })
  }
}
