import { stubFor } from './wiremock'
import listBaseClientsResponseMock from '../../server/data/localMockData/baseClientsResponseMock'

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
}
