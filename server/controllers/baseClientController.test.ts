import type { DeepMocked } from '@golevelup/ts-jest'
import { createMock } from '@golevelup/ts-jest'
import type { NextFunction, Request, Response } from 'express'

import BaseClientController from './baseClientController'
import { BaseClientService } from '../services'
import { baseClientFactory, clientFactory } from '../testutils/factories'
import listBaseClientsPresenter from '../views/presenters/listBaseClientsPresenter'
import createUserToken from '../testutils/createUserToken'
import viewBaseClientPresenter from '../views/presenters/viewBaseClientPresenter'
import nunjucksUtils from '../views/helpers/nunjucksUtils'

describe('BaseClientController', () => {
  const token = createUserToken(['ADMIN'])
  let request: DeepMocked<Request>
  let response: DeepMocked<Response>
  const next: DeepMocked<NextFunction> = createMock<NextFunction>({})
  const baseClientService = createMock<BaseClientService>({})
  let baseClientController: BaseClientController

  beforeEach(() => {
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
  })

  describe('view base client', () => {
    it('renders the main view of a base clients', async () => {
      // GIVEN a list of base clients
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
  })

  describe('create base client', () => {
    it('if grant is not specified as parameter renders the select grant screen', async () => {
      // GIVEN a request without grant parameter
      request = createMock<Request>({ query: {} })

      // WHEN the create base client page is requested
      await baseClientController.displayNewBaseClient()(request, response, next)

      // THEN the view base client page is rendered
      expect(response.render).toHaveBeenCalledWith('pages/new-base-client-grant.njk')
    })

    it('if grant is specified with client-credentials renders the details screen', async () => {
      // GIVEN a request with grant="client-credentials" parameter
      request = createMock<Request>({ query: { grant: 'client-credentials' } })

      // WHEN the create base client page is requested
      await baseClientController.displayNewBaseClient()(request, response, next)

      // THEN the view base client page is rendered
      expect(response.render).toHaveBeenCalledWith('pages/new-base-client-details.njk', {
        grant: 'client-credentials',
        ...nunjucksUtils,
      })
    })

    it('if grant is specified with authorization-code renders the details screen', async () => {
      // GIVEN a request with grant="client-credentials" parameter
      request = createMock<Request>({ query: { grant: 'authorization-code' } })

      // WHEN the create base client page is requested
      await baseClientController.displayNewBaseClient()(request, response, next)

      // THEN the view base client page is rendered
      expect(response.render).toHaveBeenCalledWith('pages/new-base-client-details.njk', {
        grant: 'authorization-code',
        ...nunjucksUtils,
      })
    })

    it('if grant is specified as random parameter renders the select grant screen', async () => {
      // GIVEN a request without grant parameter
      request = createMock<Request>({ query: { grant: 'xxxyyy' } })

      // WHEN the create base client page is requested
      await baseClientController.displayNewBaseClient()(request, response, next)

      // THEN the view base client page is rendered
      expect(response.render).toHaveBeenCalledWith('pages/new-base-client-grant.njk')
    })
  })
})
