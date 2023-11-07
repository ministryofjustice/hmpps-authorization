import { stubFor } from './wiremock'
import {
  listBaseClientsResponseMock,
  getBaseClientResponseMock,
  getListClientInstancesResponseMock,
} from '../../server/data/localMockData/baseClientsResponseMock'

export default {
  stubListBaseClients: () => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/baseClientsApi/base-clients`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: listBaseClientsResponseMock,
      },
    })
  },

  stubGetBaseClient: () => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/baseClientsApi/base-clients/base_client_id_1`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: getBaseClientResponseMock,
      },
    })
  },

  stubGetListClientInstancesList: () => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/baseClientsApi/base-clients/base_client_id_1/clients`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: getListClientInstancesResponseMock,
      },
    })
  },
}
