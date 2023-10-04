import baseClientFactory from '../testutils/factories'

import BaseClientApiRestClient from '../data/baseClientApiClient'
import BaseClientService from './baseClientService'

jest.mock('../data/baseClientApiClient')

describe('BaseClientService', () => {
  const baseClientApiRestClient = new BaseClientApiRestClient(null) as jest.Mocked<BaseClientApiRestClient>
  const baseClientApiRestClientFactory = jest.fn()

  const service = new BaseClientService(baseClientApiRestClientFactory)

  const token = 'SOME_TOKEN'

  beforeEach(() => {
    jest.resetAllMocks()
    baseClientApiRestClientFactory.mockReturnValue(baseClientApiRestClient)
  })

  describe('getBaseClients', () => {
    it('calls the getBaseClients method of the base client and returns the response', async () => {
      const baseClients = baseClientFactory.buildList(2)
      baseClientApiRestClient.getBaseClients.mockResolvedValue(baseClients)

      const result = await service.getBaseClients(token)

      expect(result).toEqual(baseClients)
      expect(baseClientApiRestClientFactory).toHaveBeenCalledWith(token)
      expect(baseClientApiRestClient.getBaseClients).toHaveBeenCalled()
    })

    it('sorts the baseClients returned by id', async () => {
      const baseClientsA = baseClientFactory.build({ baseClientId: 'A' })
      const baseClientsB = baseClientFactory.build({ baseClientId: 'B' })

      baseClientApiRestClient.getBaseClients.mockResolvedValue([baseClientsB, baseClientsA])

      const result = await service.getBaseClients(token)

      expect(result).toEqual([baseClientsA, baseClientsB])
    })
  })
})
