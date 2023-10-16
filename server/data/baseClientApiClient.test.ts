import nock from 'nock'
import config from '../config'
import {
  clientSecretsResponseFactory,
  getBaseClientResponseFactory,
  listBaseClientResponseFactory,
} from '../testutils/factories'
import BaseClientApiClient from './baseClientApiClient'
import addBaseClientRequest from '../testutils/factories/requests/addBaseClientRequest'
import updateBaseClientRequest from '../testutils/factories/requests/updateBaseClientRequest'

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

  const mockSuccessfulBaseClientRestApiPostCall = <TReturnData>(url: string, returnData: TReturnData) => {
    baseClientApi.post(url).matchHeader('authorization', `Bearer ${token.access_token}`).reply(200, returnData)
  }

  const mockBaseClientRestApiPutCall = <TReturnData>(url: string, status: number, returnData: TReturnData) => {
    baseClientApi.put(url).matchHeader('authorization', `Bearer ${token.access_token}`).reply(status, returnData)
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

  describe('getBaseClient', () => {
    it('Should return data from the API', async () => {
      // Given the network is mocked to return a response
      const testResponse = getBaseClientResponseFactory.build()
      mockSuccessfulBaseClientRestApiCall(`/base-clients/base_client_id`, testResponse)

      // When we call the API client
      const promise = baseClientApiClient.getBaseClient('base_client_id')
      const output = await promise

      // Then it returns the mocked response
      expect(output).toEqual(testResponse)
    })
  })

  describe('addBaseClient', () => {
    it('Should return data from the API', async () => {
      // Given the network is mocked to return a response
      const testResponse = clientSecretsResponseFactory.build()
      const testRequest = addBaseClientRequest.build()

      mockSuccessfulBaseClientRestApiPostCall(`/base-clients`, testResponse)

      // When we call the API client
      const promise = baseClientApiClient.addBaseClient(testRequest)
      const output = await promise

      // Then it returns the mocked response
      expect(output).toEqual(testResponse)
    })
  })

  describe('updateBaseClient', () => {
    it('Should return a success response from the API', async () => {
      // Given the network is mocked to return a response
      const testRequest = updateBaseClientRequest.build()
      mockBaseClientRestApiPutCall(`/base-clients/base_client_id`, 200, null)

      // When we call the API client
      try {
        await baseClientApiClient.updateBaseClient('base_client_id', testRequest)
      } catch {
        fail('Should not throw an error')
      }
    })

    it('Errors if unsuccessful', async () => {
      // Given the network is mocked to return a response
      const testRequest = updateBaseClientRequest.build()
      mockBaseClientRestApiPutCall(`/base-clients/base_client_id`, 400, null)

      // When we call the API client
      try {
        await baseClientApiClient.updateBaseClient('base_client_id', testRequest)
      } catch (e) {
        return
      }
      fail('Should have thrown an error')
    })
  })
})
