import {
  baseClientFactory,
  getBaseClientResponseFactory,
  listBaseClientResponseFactory,
  clientSecretsResponseFactory,
} from '../testutils/factories'

import BaseClientApiClient from '../data/baseClientApiClient'
import BaseClientService from './baseClientService'
import mapListBaseClientsResponse from '../mappers/baseClientApi/listBaseClients'
import { mapAddBaseClientRequest, mapClientSecrets, mapGetBaseClientResponse } from '../mappers'

jest.mock('../data/baseClientApiClient')

describe('BaseClientService', () => {
  const baseClientApiClient = new BaseClientApiClient(null) as jest.Mocked<BaseClientApiClient>
  const baseClientApiClientFactory = jest.fn()

  const service = new BaseClientService(baseClientApiClientFactory)

  const token = 'SOME_TOKEN'

  beforeEach(() => {
    jest.resetAllMocks()
    baseClientApiClientFactory.mockReturnValue(baseClientApiClient)
  })

  describe('listBaseClients', () => {
    it('calls the listBaseClients method of the base client', async () => {
      // Given the baseClientApiClient is mocked to return a response
      const baseClients = listBaseClientResponseFactory.build()
      baseClientApiClient.listBaseClients.mockResolvedValue(baseClients)

      // When we call the service
      await service.listBaseClients(token)

      // The service builds a baseClientApiClient with the token
      expect(baseClientApiClientFactory).toHaveBeenCalledWith(token)

      // And calls the listBaseClients method
      expect(baseClientApiClient.listBaseClients).toHaveBeenCalled()
    })

    it('maps the listBaseClientResponse to BaseClient[]', async () => {
      // Given the baseClientApiClient is mocked to return a response
      const response = listBaseClientResponseFactory.build()
      baseClientApiClient.listBaseClients.mockResolvedValue(response)

      // When we call the service
      const output = await service.listBaseClients(token)

      // Then it maps the response to the mapped version
      expect(output).toEqual(mapListBaseClientsResponse(response))
    })
  })

  describe('getBaseClient', () => {
    it('calls the getBaseClient method of the base client', async () => {
      // Given the baseClientApiClient is mocked to return a response
      const response = getBaseClientResponseFactory.build()
      baseClientApiClient.getBaseClient.mockResolvedValue(response)

      // When we call the service
      await service.getBaseClient(token, response.clientId)

      // The service builds a baseClientApiClient with the token
      expect(baseClientApiClientFactory).toHaveBeenCalledWith(token)

      // And calls the getBaseClient method
      expect(baseClientApiClient.getBaseClient).toHaveBeenCalledWith(response.clientId)
    })

    it('maps the getBaseClientResponse to a BaseClient', async () => {
      // Given the baseClientApiClient is mocked to return a response
      const response = getBaseClientResponseFactory.build()
      baseClientApiClient.getBaseClient.mockResolvedValue(response)

      // When we call the service
      const output = await service.getBaseClient(token, response.clientId)

      // Then it maps the response to the mapped version
      expect(output).toEqual(mapGetBaseClientResponse(response))
    })
  })

  describe('addBaseClient', () => {
    it('calls the addBaseClient method of the base client', async () => {
      // Given the baseClientApiClient is mocked to return a response
      const baseClient = baseClientFactory.build()
      const request = mapAddBaseClientRequest(baseClient)
      const response = clientSecretsResponseFactory.build()
      baseClientApiClient.addBaseClient.mockResolvedValue(response)

      // When we call the service
      await service.addBaseClient(token, baseClient)

      // The service builds a baseClientApiClient with the token
      expect(baseClientApiClientFactory).toHaveBeenCalledWith(token)

      // And calls the addBaseClient method
      expect(baseClientApiClient.addBaseClient).toHaveBeenCalledWith(request)
    })

    it('maps the response to a ClientSecrets object', async () => {
      // Given the baseClientApiClient is mocked to return a response
      const baseClient = baseClientFactory.build()
      const response = clientSecretsResponseFactory.build()
      baseClientApiClient.addBaseClient.mockResolvedValue(response)

      // When we call the service
      const output = await service.addBaseClient(token, baseClient)

      // Then it maps the response to the mapped version
      expect(output).toEqual(mapClientSecrets(response))
    })
  })
})
