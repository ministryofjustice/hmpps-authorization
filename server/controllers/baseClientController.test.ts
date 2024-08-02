import type { DeepMocked } from '@golevelup/ts-jest'
import { createMock } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'

import BaseClientController from './baseClientController'
import { BaseClientService } from '../services'
import { baseClientFactory, clientFactory, clientSecretsFactory } from '../testutils/factories'
import listBaseClientsPresenter from '../views/presenters/listBaseClientsPresenter'
import createUserToken from '../testutils/createUserToken'
import viewBaseClientPresenter from '../views/presenters/viewBaseClientPresenter'
import nunjucksUtils from '../views/helpers/nunjucksUtils'
import editBaseClientPresenter from '../views/presenters/editBaseClientPresenter'
import { BaseClientEvent } from '../audit/baseClientEvent'
import * as baseClientAudit from '../audit/baseClientAudit'

describe('BaseClientController', () => {
  const token = createUserToken(['ADMIN'])
  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})
  let baseClientService = createMock<BaseClientService>({})
  let baseClientController: BaseClientController

  beforeEach(() => {
    jest.resetAllMocks()
    jest.spyOn(baseClientAudit, 'sendBaseClientEvent').mockResolvedValue()

    request = createMock<Request>()
    response = createMock<Response>({
      locals: {
        clientToken: 'CLIENT_TOKEN',
        user: {
          token,
          authSource: 'auth',
        },
      },
      render: jest.fn(),
      redirect: jest.fn(),
    })

    baseClientService = createMock<BaseClientService>({})
    baseClientController = new BaseClientController(baseClientService)
  })

  describe('displayBaseClients', () => {
    it('renders the list  index template with a list of base clients', async () => {
      // GIVEN a list of base clients
      const baseClients = baseClientFactory.buildList(3)
      baseClientService.listBaseClients.mockResolvedValue(baseClients)

      // WHEN the index page is requested
      await baseClientController.displayBaseClients()(request, response, next)

      // THEN the list of base clients is rendered
      const presenter = listBaseClientsPresenter(baseClients)
      expect(response.render).toHaveBeenCalledWith('pages/base-clients.njk', {
        presenter,
      })

      // AND the list of base clients is retrieved from the base client service
      expect(baseClientService.listBaseClients).toHaveBeenCalledWith(token)
    })

    it('audits the view attempt', async () => {
      // GIVEN a list of base clients
      const baseClients = baseClientFactory.buildList(3)
      baseClientService.listBaseClients.mockResolvedValue(baseClients)

      // WHEN the index page is requested
      await baseClientController.displayBaseClients()(request, response, next)

      // THEN a view base clients audit event is sent
      expect(baseClientAudit.sendBaseClientEvent).toHaveBeenCalledWith(
        BaseClientEvent.LIST_BASE_CLIENTS,
        undefined,
        undefined,
        undefined,
        expect.any(String),
      )
    })

    it('audits the view failure', async () => {
      // GIVEN an error will be thrown
      baseClientService.listBaseClients.mockRejectedValue(404)

      // WHEN the index page is requested
      try {
        await baseClientController.displayBaseClients()(request, response, next)
      } catch (e) {
        // THEN a view base clients failure audit event is sent
        expect(baseClientAudit.sendBaseClientEvent).toHaveBeenCalledWith(
          BaseClientEvent.LIST_BASE_CLIENTS_FAILURE,
          undefined,
          undefined,
          undefined,
          expect.any(String),
        )
      }
    })
  })

  describe('view base client', () => {
    it('renders the main view of a base client', async () => {
      // GIVEN a base client
      const baseClient = baseClientFactory.build()
      const clients = clientFactory.buildList(3)
      baseClientService.getBaseClient.mockResolvedValue(baseClient)
      baseClientService.listClientInstances.mockResolvedValue(clients)

      // WHEN the index page is requested
      request = createMock<Request>({ params: { baseClientId: baseClient.baseClientId } })
      await baseClientController.displayBaseClient()(request, response, next)

      // THEN the view base client page is rendered
      const presenter = viewBaseClientPresenter(baseClient, clients)
      expect(response.render).toHaveBeenCalledWith('pages/base-client.njk', {
        baseClient,
        presenter,
        ...nunjucksUtils,
      })

      // AND the base client is retrieved from the base client service
      expect(baseClientService.getBaseClient).toHaveBeenCalledWith(token, baseClient.baseClientId)
    })

    it('renders the main view of a base client with null service', async () => {
      // GIVEN a base client with null service
      const baseClient = baseClientFactory.build()
      baseClient.service = null
      const clients = clientFactory.buildList(3)
      baseClientService.getBaseClient.mockResolvedValue(baseClient)
      baseClientService.listClientInstances.mockResolvedValue(clients)

      // WHEN the index page is requested
      request = createMock<Request>({ params: { baseClientId: baseClient.baseClientId } })
      await baseClientController.displayBaseClient()(request, response, next)

      // THEN the view base client page is rendered
      const presenter = viewBaseClientPresenter(baseClient, clients)
      expect(response.render).toHaveBeenCalledWith('pages/base-client.njk', {
        baseClient,
        presenter,
        ...nunjucksUtils,
      })

      // AND the base client is retrieved from the base client service
      expect(baseClientService.getBaseClient).toHaveBeenCalledWith(token, baseClient.baseClientId)
    })

    it('audits the view attempt', async () => {
      // GIVEN a base client
      const baseClient = baseClientFactory.build()
      const clients = clientFactory.buildList(3)
      baseClientService.getBaseClient.mockResolvedValue(baseClient)
      baseClientService.listClientInstances.mockResolvedValue(clients)

      // WHEN the base client page is requested
      request = createMock<Request>({ params: { baseClientId: baseClient.baseClientId } })
      await baseClientController.displayBaseClient()(request, response, next)

      // THEN a view base client audit event is sent
      expect(baseClientAudit.sendBaseClientEvent).toHaveBeenCalledWith(
        BaseClientEvent.VIEW_BASE_CLIENT,
        baseClient.baseClientId,
        undefined,
        undefined,
        expect.any(String),
      )
    })

    it('audits the view failure', async () => {
      // GIVEN an error will be thrown
      const baseClientId = '1234'
      baseClientService.getBaseClient.mockRejectedValue(404)
      baseClientService.listClientInstances.mockRejectedValue(404)

      // WHEN the base client page is requested
      try {
        request = createMock<Request>({ params: { baseClientId } })
        await baseClientController.displayBaseClient()(request, response, next)
      } catch (e) {
        // THEN a view base clients failure audit event is sent
        expect(baseClientAudit.sendBaseClientEvent).toHaveBeenCalledWith(
          BaseClientEvent.VIEW_BASE_CLIENT_FAILURE,
          baseClientId,
          undefined,
          undefined,
          expect.any(String),
        )
      }
    })
  })

  describe('create base client', () => {
    describe('journey', () => {
      it('if grant is not specified as parameter renders the select grant screen', async () => {
        // GIVEN a request without grant parameter
        request = createMock<Request>({ query: {} })

        // WHEN the create base client page is requested
        await baseClientController.displayNewBaseClient()(request, response, next)

        // THEN the choose client type page is rendered
        expect(response.render).toHaveBeenCalledWith('pages/new-base-client-grant.njk')
      })

      it('if grant is specified with client-credentials renders the details screen', async () => {
        // GIVEN a request with grant="client-credentials" parameter
        request = createMock<Request>({ query: { grant: 'client-credentials' } })

        // WHEN the create base client page is requested
        await baseClientController.displayNewBaseClient()(request, response, next)

        // THEN the enter client details page is rendered with client credentials selected
        expect(response.render).toHaveBeenCalledWith('pages/new-base-client-details.njk', {
          grant: 'client-credentials',
          presenter: editBaseClientPresenter(null),
          ...nunjucksUtils,
        })
      })

      it('if grant is specified with authorization-code renders the details screen', async () => {
        // GIVEN a request with grant="authorization-code" parameter
        request = createMock<Request>({ query: { grant: 'authorization-code' } })

        // WHEN the create base client page is requested
        await baseClientController.displayNewBaseClient()(request, response, next)

        // THEN the enter client details page is rendered with authorisation code selected
        expect(response.render).toHaveBeenCalledWith('pages/new-base-client-details.njk', {
          grant: 'authorization-code',
          presenter: editBaseClientPresenter(null),
          ...nunjucksUtils,
        })
      })

      it('if grant is specified as random parameter renders the select grant screen', async () => {
        // GIVEN a request without grant parameter
        request = createMock<Request>({ query: { grant: 'xxxyyy' } })

        // WHEN the create base client page is requested
        await baseClientController.displayNewBaseClient()(request, response, next)

        // THEN the choose client type page is rendered
        expect(response.render).toHaveBeenCalledWith('pages/new-base-client-grant.njk')
      })

      it('if validation fails because no id specified renders the details screen with error message', async () => {
        // GIVEN no id is specified
        request = createMock<Request>({ body: {} })

        // WHEN it is posted
        await baseClientController.createBaseClient()(request, response, next)

        // THEN the new base client page is rendered with error message
        const expectedError = 'This field is required'
        expect(response.render).toHaveBeenCalledWith(
          'pages/new-base-client-details.njk',
          expect.objectContaining({ errorMessage: { text: expectedError } }),
        )

        // AND the fail is audited
        expect(baseClientAudit.sendBaseClientEvent).toHaveBeenCalledWith(
          BaseClientEvent.CREATE_BASE_CLIENT_FAILURE,
          expect.any(String),
          expect.objectContaining({ error: expectedError }),
          undefined,
          expect.any(String),
        )
      })

      it('if validation fails because id exists then render the details screen with error message', async () => {
        // GIVEN base client with id already exists
        baseClientService.getBaseClient.mockResolvedValue(baseClientFactory.build())
        baseClientService.listClientInstances.mockResolvedValue(clientFactory.buildList(3))
        request = createMock<Request>({ body: { baseClientId: 'abcd' } })

        // WHEN it is posted
        await baseClientController.createBaseClient()(request, response, next)

        // THEN the new base client page is rendered with error message
        const expectedError = 'A base client with this ID already exists'
        expect(response.render).toHaveBeenCalledWith(
          'pages/new-base-client-details.njk',
          expect.objectContaining({ errorMessage: { text: expectedError } }),
        )

        // AND the fail is audited
        expect(baseClientAudit.sendBaseClientEvent).toHaveBeenCalledWith(
          BaseClientEvent.CREATE_BASE_CLIENT_FAILURE,
          expect.any(String),
          expect.objectContaining({ error: expectedError }),
          undefined,
          expect.any(String),
        )
      })

      it('if success renders the secrets screen', async () => {
        // GIVEN the service returns success and a set of secrets
        baseClientService.getBaseClient.mockRejectedValue({ status: 404 })
        request = createMock<Request>({ body: { baseClientId: 'abcd' } })

        const secrets = clientSecretsFactory.build()
        baseClientService.addBaseClient.mockResolvedValue(secrets)

        // WHEN it is posted
        await baseClientController.createBaseClient()(request, response, next)

        // THEN the new base client success page is rendered
        expect(response.render).toHaveBeenCalledWith(
          'pages/new-base-client-success.njk',
          expect.objectContaining({ secrets }),
          expect.anything(),
        )
      })

      it('audits the create attempt', async () => {
        // GIVEN the service returns success and a set of secrets
        const secrets = clientSecretsFactory.build()
        baseClientService.addBaseClient.mockResolvedValue(secrets)

        // WHEN it is posted
        await baseClientController.createBaseClient()(request, response, next)

        // THEN the attempt is audited
        expect(baseClientAudit.sendBaseClientEvent).toHaveBeenCalledWith(
          BaseClientEvent.CREATE_BASE_CLIENT,
          undefined,
          undefined,
          undefined,
          expect.any(String),
        )
      })

      it('audits the secrets viewing attempt if successful', async () => {
        // GIVEN the service returns success and a set of secrets
        const secrets = clientSecretsFactory.build()
        // set request body to include baseClientId
        request = createMock<Request>({ body: { baseClientId: 'abcd' } })
        baseClientService.addBaseClient.mockResolvedValue(secrets)
        baseClientService.getBaseClient.mockRejectedValue({ status: 404 })

        // WHEN it is posted
        await baseClientController.createBaseClient()(request, response, next)

        // THEN the attempt is audited
        expect(baseClientAudit.sendBaseClientEvent).toHaveBeenCalledWith(
          BaseClientEvent.VIEW_CLIENT_SECRETS,
          expect.any(String),
          { clientId: expect.any(String) },
          undefined,
          expect.any(String),
        )
      })

      it('audits the secrets viewing attempt if fail', async () => {
        // GIVEN the post is properly set up
        const secrets = clientSecretsFactory.build()
        request = createMock<Request>({ body: { baseClientId: 'abcd' } })
        baseClientService.addBaseClient.mockResolvedValue(secrets)
        baseClientService.getBaseClient.mockRejectedValue({ status: 404 })
        // but the render fails
        response.render.mockImplementation(
          (view: string, options: object, callback?: (err: Error, html: string) => void) => {
            callback(new Error('Test error'), '')
          },
        )

        // WHEN it is posted
        try {
          await baseClientController.createBaseClient()(request, response, next)
        } catch (e) {
          // THEN the view attempt is audited
          expect(baseClientAudit.sendBaseClientEvent).toHaveBeenCalledWith(
            BaseClientEvent.VIEW_CLIENT_SECRETS_FAILURE,
            undefined,
            undefined,
            undefined,
            expect.any(String),
          )
        }
      })
    })
  })

  describe('update base client details', () => {
    it('displays update base client details screen', async () => {
      // GIVEN a request to edit a base client
      const baseClient = baseClientFactory.build()
      baseClientService.getBaseClient.mockResolvedValue(baseClient)
      request = createMock<Request>({ params: { baseClientId: baseClient.baseClientId } })

      // WHEN the edit base client details page is requested
      await baseClientController.displayEditBaseClient()(request, response, next)

      // THEN the base client is retrieved from the base client service
      expect(baseClientService.getBaseClient).toHaveBeenCalledWith(token, baseClient.baseClientId)

      // AND the page is rendered
      const presenter = editBaseClientPresenter(baseClient)
      expect(response.render).toHaveBeenCalledWith('pages/edit-base-client-details.njk', {
        baseClient,
        presenter,
        ...nunjucksUtils,
      })
    })

    it('updates and redirects to view base client screen', async () => {
      // GIVEN the service will return without an error
      const baseClient = baseClientFactory.build()
      request = createMock<Request>({
        params: { baseClientId: baseClient.baseClientId },
        body: { baseClientId: baseClient.baseClientId },
      })
      baseClientService.updateBaseClient.mockResolvedValue(new Response())

      // WHEN it is posted
      await baseClientController.updateBaseClientDetails()(request, response, next)

      // THEN the base client service is updated
      expect(baseClientService.updateBaseClient).toHaveBeenCalled()

      // AND the user is redirected to the view base client page
      expect(response.redirect).toHaveBeenCalledWith(`/base-clients/${baseClient.baseClientId}`)
    })

    it('audits the update attempt', async () => {
      // GIVEN the service will return without an error
      const baseClient = baseClientFactory.build()
      request = createMock<Request>({
        params: { baseClientId: baseClient.baseClientId },
        body: { baseClientId: baseClient.baseClientId },
      })
      baseClientService.getBaseClient.mockResolvedValue(baseClient)
      baseClientService.updateBaseClient.mockResolvedValue(new Response())

      // WHEN it is posted
      await baseClientController.updateBaseClientDetails()(request, response, next)

      // THEN the attempt is audited
      expect(baseClientAudit.sendBaseClientEvent).toHaveBeenCalledWith(
        BaseClientEvent.UPDATE_BASE_CLIENT,
        baseClient.baseClientId,
        undefined,
        undefined,
        expect.any(String),
      )
    })

    it('audits a failed update attempt', async () => {
      // GIVEN the service will return without an error
      const baseClient = baseClientFactory.build()
      request = createMock<Request>({
        params: { baseClientId: baseClient.baseClientId },
        body: { baseClientId: baseClient.baseClientId },
      })
      baseClientService.getBaseClient.mockResolvedValue(baseClient)
      baseClientService.updateBaseClient.mockRejectedValue(404)

      // WHEN it is posted
      try {
        await baseClientController.updateBaseClientDetails()(request, response, next)
      } catch (e) {
        // THEN the attempt is audited
        expect(baseClientAudit.sendBaseClientEvent).toHaveBeenCalledWith(
          BaseClientEvent.UPDATE_BASE_CLIENT_FAILURE,
          baseClient.baseClientId,
          undefined,
          undefined,
          expect.any(String),
        )
      }
    })
  })

  describe('update base client deployment', () => {
    it('displays update base client deployment screen', async () => {
      // GIVEN a request to edit base client deployment
      const baseClient = baseClientFactory.build()
      baseClientService.getBaseClient.mockResolvedValue(baseClient)
      request = createMock<Request>({ params: { baseClientId: baseClient.baseClientId } })

      // WHEN the edit base client details page is requested
      await baseClientController.displayEditBaseClientDeployment()(request, response, next)

      // THEN the base client is retrieved from the base client service
      expect(baseClientService.getBaseClient).toHaveBeenCalledWith(token, baseClient.baseClientId)

      // AND the page is rendered
      expect(response.render).toHaveBeenCalledWith('pages/edit-base-client-deployment.njk', {
        baseClient,
      })
    })

    it('updates and redirects to view base client screen', async () => {
      // GIVEN the service will return without an error
      const baseClient = baseClientFactory.build()
      request = createMock<Request>({
        params: { baseClientId: baseClient.baseClientId },
        body: { baseClientId: baseClient.baseClientId },
      })
      baseClientService.updateBaseClientDeployment.mockResolvedValue(new Response())

      // WHEN it is posted
      await baseClientController.updateBaseClientDeployment()(request, response, next)

      // THEN the base client service is updated
      expect(baseClientService.updateBaseClientDeployment).toHaveBeenCalled()

      // AND the user is redirected to the view base client page
      expect(response.redirect).toHaveBeenCalledWith(`/base-clients/${baseClient.baseClientId}`)
    })

    it('audits the update attempt', async () => {
      // GIVEN the service will return without an error
      const baseClient = baseClientFactory.build()
      request = createMock<Request>({
        params: { baseClientId: baseClient.baseClientId },
        body: { baseClientId: baseClient.baseClientId },
      })
      baseClientService.getBaseClient.mockResolvedValue(baseClient)
      baseClientService.updateBaseClientDeployment.mockResolvedValue(new Response())

      // WHEN it is posted
      await baseClientController.updateBaseClientDeployment()(request, response, next)

      // THEN the attempt is audited
      expect(baseClientAudit.sendBaseClientEvent).toHaveBeenCalledWith(
        BaseClientEvent.UPDATE_BASE_CLIENT_DEPLOYMENT,
        baseClient.baseClientId,
        undefined,
        undefined,
        expect.any(String),
      )
    })

    it('audits a failed update attempt', async () => {
      // GIVEN the service will return without an error
      const baseClient = baseClientFactory.build()
      request = createMock<Request>({
        params: { baseClientId: baseClient.baseClientId },
        body: { baseClientId: baseClient.baseClientId },
      })
      baseClientService.getBaseClient.mockResolvedValue(baseClient)
      baseClientService.updateBaseClientDeployment.mockRejectedValue(404)

      // WHEN it is posted
      try {
        await baseClientController.updateBaseClientDeployment()(request, response, next)
      } catch (e) {
        // THEN the attempt is audited
        expect(baseClientAudit.sendBaseClientEvent).toHaveBeenCalledWith(
          BaseClientEvent.UPDATE_BASE_CLIENT_DEPLOYMENT_FAILURE,
          baseClient.baseClientId,
          undefined,
          undefined,
          expect.any(String),
        )
      }
    })
  })

  describe('create client instance', () => {
    it('if success renders the secrets screen', async () => {
      // GIVEN the service returns success and a set of secrets
      const baseClient = baseClientFactory.build()
      baseClientService.getBaseClient.mockResolvedValue(baseClient)
      request = createMock<Request>({ body: { baseClientId: baseClient.baseClientId } })

      const secrets = clientSecretsFactory.build()
      baseClientService.addClientInstance.mockResolvedValue(secrets)

      // WHEN it is posted
      await baseClientController.createClientInstance()(request, response, next)

      // THEN the new base client success page is rendered
      expect(response.render).toHaveBeenCalledWith(
        'pages/new-base-client-success.njk',
        expect.objectContaining({ secrets }),
        expect.anything(),
      )
    })

    it('audits the update attempt', async () => {
      // GIVEN the service returns success and a set of secrets
      const baseClient = baseClientFactory.build()
      baseClientService.getBaseClient.mockResolvedValue(baseClient)
      request = createMock<Request>({ body: { baseClientId: baseClient.baseClientId } })

      const secrets = clientSecretsFactory.build()
      baseClientService.addClientInstance.mockResolvedValue(secrets)

      // WHEN it is posted
      await baseClientController.createClientInstance()(request, response, next)

      expect(baseClientAudit.sendBaseClientEvent).toHaveBeenCalledWith(
        BaseClientEvent.CREATE_CLIENT,
        undefined,
        undefined,
        undefined,
        expect.any(String),
      )
    })

    it('audits a failed update attempt', async () => {
      // GIVEN the service returns success and a set of secrets
      const baseClient = baseClientFactory.build()
      baseClientService.getBaseClient.mockResolvedValue(baseClient)
      request = createMock<Request>({ body: { baseClientId: baseClient.baseClientId } })

      baseClientService.addClientInstance.mockRejectedValue(400)

      try {
        // WHEN it is posted
        await baseClientController.createClientInstance()(request, response, next)
      } catch (e) {
        // THEN the failed attempt is audited
        expect(baseClientAudit.sendBaseClientEvent).toHaveBeenCalledWith(
          BaseClientEvent.CREATE_CLIENT_FAILURE,
          undefined,
          undefined,
          undefined,
          expect.any(String),
        )
      }
    })
  })

  describe('delete client instance', () => {
    it.each([
      ['renders one client instance', 1, true],
      ['renders multiple client instances', 3, false],
    ])(`if %s renders the page with isLastClient %s`, async (_, clientCount: number, isLastClient: boolean) => {
      // GIVEN a base client
      const baseClient = baseClientFactory.build()
      const clients = clientFactory.buildList(clientCount)
      const client = clients[0]
      baseClientService.getBaseClient.mockResolvedValue(baseClient)
      baseClientService.listClientInstances.mockResolvedValue(clients)

      // WHEN the index page is requested
      request = createMock<Request>({ params: { baseClientId: baseClient.baseClientId, clientId: client.clientId } })
      await baseClientController.displayDeleteClientInstance()(request, response, next)

      // THEN the view base client page is rendered with isLastClient true
      expect(response.render).toHaveBeenCalledWith('pages/delete-client-instance.njk', {
        baseClient,
        clientId: client.clientId,
        isLastClient,
        error: null,
      })

      // AND the base client is retrieved from the base client service
      expect(baseClientService.getBaseClient).toHaveBeenCalledWith(token, baseClient.baseClientId)

      // AND the clients are retrieved from the base client service
      expect(baseClientService.listClientInstances).toHaveBeenCalledWith(token, baseClient)
    })

    it(`renders the page with error`, async () => {
      // GIVEN a base client
      const baseClient = baseClientFactory.build()
      const clients = clientFactory.buildList(3)
      const client = clients[0]
      baseClientService.getBaseClient.mockResolvedValue(baseClient)
      baseClientService.listClientInstances.mockResolvedValue(clients)
      const errorCode = 'clientIdMismatch'

      // WHEN the index page is requested
      request = createMock<Request>({
        params: { baseClientId: baseClient.baseClientId, clientId: client.clientId },
        query: { error: errorCode },
      })
      await baseClientController.displayDeleteClientInstance()(request, response, next)

      // THEN the view base client page is rendered with error
      const expectedError = 'Client ID does not match'
      expect(response.render).toHaveBeenCalledWith('pages/delete-client-instance.njk', {
        baseClient,
        clientId: client.clientId,
        isLastClient: false,
        error: expectedError,
      })
    })

    describe(`delete the client instance`, () => {
      it.each([
        ['one client instance exists', '/', 1],
        ['multiple client instances', '/base-clients/abcd', 3],
      ])(`if delete successful and %s, redirects to %s`, async (_, redirectURL: string, clientCount: number) => {
        // GIVEN a base client
        const baseClient = baseClientFactory.build({ baseClientId: 'abcd' })
        const clients = clientFactory.buildList(clientCount)
        const client = clients[0]
        baseClientService.getBaseClient.mockResolvedValue(baseClient)
        baseClientService.listClientInstances.mockResolvedValue(clients)

        // WHEN a delete request is made
        request = createMock<Request>({
          params: { baseClientId: baseClient.baseClientId, clientId: client.clientId },
          query: { error: null },
          body: { confirm: client.clientId },
        })
        await baseClientController.deleteClientInstance()(request, response, next)

        // THEN the client instance is deleted
        expect(baseClientService.deleteClientInstance).toHaveBeenCalledWith(token, client)

        // AND the user is redirected
        expect(response.redirect).toHaveBeenCalledWith(redirectURL)
      })

      it(`if client does not match, redirects with error`, async () => {
        // GIVEN a base client
        const baseClient = baseClientFactory.build({ baseClientId: 'abcd' })
        const clients = clientFactory.buildList(3)
        const client = clients[0]
        baseClientService.getBaseClient.mockResolvedValue(baseClient)
        baseClientService.listClientInstances.mockResolvedValue(clients)

        // WHEN a delete request is made
        request = createMock<Request>({
          params: { baseClientId: baseClient.baseClientId, clientId: client.clientId },
          query: { error: null },
          body: { confirm: 'something incorrect' },
        })
        await baseClientController.deleteClientInstance()(request, response, next)

        // THEN the user is redirected with error
        const expectedURL = `/base-clients/${baseClient.baseClientId}/clients/${client.clientId}/delete?error=clientIdMismatch`
        expect(response.redirect).toHaveBeenCalledWith(expectedURL)
      })

      it('audits the delete attempt', async () => {
        // GIVEN a base client
        const baseClient = baseClientFactory.build({ baseClientId: 'abcd' })
        const clients = clientFactory.buildList(2)
        const client = clients[0]
        baseClientService.getBaseClient.mockResolvedValue(baseClient)
        baseClientService.listClientInstances.mockResolvedValue(clients)

        // WHEN a delete request is made
        request = createMock<Request>({
          params: { baseClientId: baseClient.baseClientId, clientId: client.clientId },
          query: { error: null },
          body: { confirm: client.clientId },
        })
        await baseClientController.deleteClientInstance()(request, response, next)

        // THEN the delete attempt is audited
        expect(baseClientAudit.sendBaseClientEvent).toHaveBeenCalledWith(
          BaseClientEvent.DELETE_CLIENT,
          baseClient.baseClientId,
          { clientId: client.clientId },
          undefined,
          expect.any(String),
        )
      })

      it('audits a failed update attempt', async () => {
        // GIVEN a base client
        const baseClient = baseClientFactory.build({ baseClientId: 'abcd' })
        const clients = clientFactory.buildList(2)
        const client = clients[0]
        baseClientService.getBaseClient.mockResolvedValue(baseClient)
        baseClientService.listClientInstances.mockResolvedValue(clients)
        baseClientService.deleteClientInstance.mockRejectedValue(404)

        // WHEN a delete request is made
        request = createMock<Request>({
          params: { baseClientId: baseClient.baseClientId, clientId: client.clientId },
          query: { error: null },
          body: { confirm: client.clientId },
        })
        try {
          await baseClientController.deleteClientInstance()(request, response, next)
        } catch (e) {
          // THEN the failed attempt is audited
          expect(baseClientAudit.sendBaseClientEvent).toHaveBeenCalledWith(
            BaseClientEvent.DELETE_CLIENT_FAILURE,
            baseClient.baseClientId,
            { clientId: client.clientId },
            undefined,
            expect.any(String),
          )
        }
      })
    })
  })
})
