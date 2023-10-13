import nock from 'nock'
import config from '../config'
import { listBaseClientResponseFactory } from '../testutils/factories'
import BaseClientApiClient from './baseClientApiClient'

jest.mock('./tokenStore')

const token = { access_token: 'token-1', expires_in: 300 }

describe('baseClientApiClient', () => {
  let baseClientApi: nock.Scope
  let baseClientApiClient: BaseClientApiClient

  beforeEach(() => {
    baseClientApi = nock(config.apis.hmppsAuthorizationServer.url)
    baseClientApiClient = new BaseClientApiClient(token.access_token)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  const mockSuccessfulBaseClientRestApiCall = <TReturnData>(url: string, returnData: TReturnData) => {
    baseClientApi.get(url).matchHeader('authorization', `Bearer ${token.access_token}`).reply(200, returnData)
  }

  describe('listBaseClients', () => {
    it('Should return data from the API', async () => {
      // Given the network is mocked to return a response
      const testResponse = listBaseClientResponseFactory.build()
      mockSuccessfulBaseClientRestApiCall(`/base-clients`, testResponse)

      // When we call the API client
      const promise = baseClientApiClient.listBaseClients()
      const output = await promise

      // Then it returns the mocked response
      expect(output).toEqual(testResponse)
    })
  })
})
