import { listBaseClientResponseFactory } from '../testutils/factories'

import BaseClientApiClient from '../data/baseClientApiClient'
import BaseClientService from './baseClientService'
import mapListBaseClientsResponse from '../mappers/baseClientApi/listBaseClients'

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

  describe('getBaseClients', () => {
    it('calls the getBaseClients method of the base client', async () => {
      // Given the baseClientApiClient is mocked to return a response
      const baseClients = listBaseClientResponseFactory.build()
      baseClientApiClient.listBaseClients.mockResolvedValue(baseClients)

      // When we call the service
      await service.getBaseClients(token)

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
      const output = await service.getBaseClients(token)

      // Then it maps the response to the mapped version
      expect(output).toEqual(mapListBaseClientsResponse(response))
    })
  })
})
