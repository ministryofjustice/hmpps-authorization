import { stubFor } from './wiremock'
import {
  listBaseClientsResponseMock,
  getBaseClientResponseMock,
  getListClientInstancesResponseMock,
  getSecretsResponseMock,
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

  stubGetClientDeploymentDetails: () => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/baseClientsApi/base-clients/base_client_id_1/deployment`,
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

  stubAddClientInstance: () => {
    return stubFor({
      request: {
        method: 'POST',
        urlPattern: `/baseClientsApi/base-clients/base_client_id_1/clients`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: getSecretsResponseMock,
      },
    })
  },

  stubDeleteClientInstance: () => {
    return stubFor({
      request: {
        method: 'DELETE',
        urlPattern: `/baseClientsApi/base-clients/base_client_id_1/clients/base_client_id_1_01`,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      },
    })
  },
}
