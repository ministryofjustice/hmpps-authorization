import { stubFor } from './wiremock'
import {
  listBaseClientsResponseMock,
  getBaseClientResponseMock,
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
        urlPattern: `/baseClientsApi/base-clients/baseClientId`,
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
}
