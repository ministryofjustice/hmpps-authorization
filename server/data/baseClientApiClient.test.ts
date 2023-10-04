import nock from 'nock'
import config from '../config'
import { BaseClientApiClient } from './interfaces/baseClientApiClient'
import BaseClientApiRestClient from './baseClientApiClient'
import baseClientFactory from '../testutils/factories'

jest.mock('./tokenStore')

const token = { access_token: 'token-1', expires_in: 300 }

describe('baseClientApiClient', () => {
  let baseClientApi: nock.Scope
  let baseClientApiClient: BaseClientApiClient

  beforeEach(() => {
    baseClientApi = nock(config.apis.hmppsAuthorizationServer.url)
    baseClientApiClient = new BaseClientApiRestClient(token.access_token)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  const mockSuccessfulBaseClientRestApiCall = <TReturnData>(url: string, returnData: TReturnData) => {
    baseClientApi.get(url).matchHeader('authorization', `Bearer ${token.access_token}`).reply(200, returnData)
  }

  describe('getBaseClients', () => {
    it('Should return data from the API', async () => {
      const testBaseClients = baseClientFactory.buildList(2)

      mockSuccessfulBaseClientRestApiCall(`/base-clients`, testBaseClients)

      const promise = baseClientApiClient.getBaseClients()
      const output = await promise
      expect(output).toEqual(testBaseClients)
    })
  })
})
