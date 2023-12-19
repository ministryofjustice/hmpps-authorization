import { RequestHandler, Response } from 'express'
import { BaseClientService } from '../services'
import listBaseClientsPresenter from '../views/presenters/listBaseClientsPresenter'
import viewBaseClientPresenter from '../views/presenters/viewBaseClientPresenter'
import nunjucksUtils from '../views/helpers/nunjucksUtils'
import { mapCreateBaseClientForm, mapEditBaseClientDeploymentForm, mapEditBaseClientDetailsForm } from '../mappers'
import { BaseClient, BaseClientListFilter, ClientSecrets } from '../interfaces/baseClientApi/baseClient'
import editBaseClientPresenter from '../views/presenters/editBaseClientPresenter'
import mapFilterForm from '../mappers/forms/mapFilterForm'
import { GrantTypes } from '../data/enums/grantTypes'
import { kebab } from '../utils/utils'
import baseClientAudit, { BaseClientAuditFunction } from '../audit/baseClientAudit'
import { BaseClientEvent } from '../audit/baseClientEvent'
import { Client } from '../interfaces/baseClientApi/client'

export default class BaseClientController {
  constructor(private readonly baseClientService: BaseClientService) {}

  public displayBaseClients(): RequestHandler {
    return async (req, res) => {
      const { token, username } = res.locals.user
      const audit = baseClientAudit(username)
      await audit(BaseClientEvent.LIST_BASE_CLIENTS)

      try {
        const baseClients = await this.baseClientService.listBaseClients(token)
        this.renderBaseClientsPage(res, baseClients)
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
      const audit = baseClientAudit(username)
      await audit(BaseClientEvent.LIST_BASE_CLIENTS)

      try {
        const baseClients = await this.baseClientService.listBaseClients(token)
        this.renderBaseClientsPage(res, baseClients, filter)
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
      const audit = baseClientAudit(username)

      await audit(BaseClientEvent.VIEW_BASE_CLIENT, baseClientId)
      try {
        const baseClient = await this.baseClientService.getBaseClient(token, baseClientId)
        const clients = await this.baseClientService.listClientInstances(token, baseClient)
        this.renderBaseClientPage(res, baseClient, clients)
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
      const audit = baseClientAudit(username)

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
      const audit = baseClientAudit(username)
      await audit(BaseClientEvent.UPDATE_BASE_CLIENT, baseClientId)

      try {
        const baseClient = await this.baseClientService.getBaseClient(token, baseClientId)
        const updatedClient = mapEditBaseClientDetailsForm(baseClient, req)
        await this.baseClientService.updateBaseClient(token, updatedClient)
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
      const audit = baseClientAudit(username)
      await audit(BaseClientEvent.UPDATE_BASE_CLIENT_DEPLOYMENT, baseClientId)

      try {
        const baseClient = await this.baseClientService.getBaseClient(token, baseClientId)
        const updatedClient = mapEditBaseClientDeploymentForm(baseClient, req)
        await this.baseClientService.updateBaseClientDeployment(token, updatedClient)
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
      const audit = baseClientAudit(username)

      try {
        await audit(BaseClientEvent.CREATE_CLIENT, baseClientId)
        const baseClient = await this.baseClientService.getBaseClient(token, baseClientId)
        const secrets = await this.baseClientService.addClientInstance(token, baseClient)

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

      const baseClient = await this.baseClientService.getBaseClient(token, baseClientId)
      const clients = await this.baseClientService.listClientInstances(token, baseClient)
      const error = req.query.error === 'clientIdMismatch' ? 'Client ID does not match' : null

      this.renderDeleteConfirmationPage(res, baseClient, clientId, clients, error)
    }
  }

  public deleteClientInstance(): RequestHandler {
    return async (req, res, next) => {
      const { token, username } = res.locals.user
      const { baseClientId, clientId } = req.params
      const audit = baseClientAudit(username)
      await audit(BaseClientEvent.DELETE_CLIENT, baseClientId, { clientId })

      try {
        if (req.body.confirm !== clientId) {
          await audit(BaseClientEvent.DELETE_CLIENT_FAILURE)
          res.redirect(`/base-clients/${baseClientId}/clients/${clientId}/delete?error=clientIdMismatch`)
          return
        }

        const baseClient = await this.baseClientService.getBaseClient(token, baseClientId)
        const clients = await this.baseClientService.listClientInstances(token, baseClient)
        const client = clients.find(c => c.clientId === clientId)

        if (!client) {
          res.redirect(`/base-clients/${baseClientId}/clients/${clientId}/delete?error=clientNotFound`)
          return
        }

        await this.baseClientService.deleteClientInstance(token, client)
        this.redirectAfterDeletion(res, clients, baseClientId)
      } catch (e) {
        await audit(BaseClientEvent.DELETE_CLIENT_FAILURE, baseClientId, { clientId })
        throw e
      }
    }
  }

  private renderBaseClientsPage(res: Response, baseClients: BaseClient[], filter?: BaseClientListFilter) {
    const presenter = listBaseClientsPresenter(baseClients, filter)
    res.render('pages/base-clients.njk', {
      presenter,
    })
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
      (err, html) => {
        if (err) {
          audit(BaseClientEvent.VIEW_CLIENT_SECRETS_FAILURE, baseClient.baseClientId, { clientId: secrets.clientId })
        } else {
          res.send(html)
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

  private renderBaseClientPage(res: Response, baseClient: BaseClient, clients: Client[]) {
    const presenter = viewBaseClientPresenter(baseClient, clients)
    res.render('pages/base-client.njk', {
      baseClient,
      presenter,
      ...nunjucksUtils,
    })
  }

  private renderDeleteConfirmationPage(
    res: Response,
    baseClient: BaseClient,
    clientId: string,
    clients: Client[],
    error: string | null,
  ): void {
    res.render('pages/delete-client-instance.njk', {
      baseClient,
      clientId,
      isLastClient: clients.length === 1,
      error,
    })
  }

  private redirectAfterDeletion(res: Response, clients: Client[], baseClientId: string): void {
    if (clients.length === 1) {
      res.redirect(`/`)
    } else {
      res.redirect(`/base-clients/${baseClientId}`)
    }
  }
}
