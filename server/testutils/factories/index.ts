/* istanbul ignore file */

import baseClientFactory from './baseClient'
import listBaseClientResponseFactory from './responses/listBaseClientResponse'
import getBaseClientResponseFactory from './responses/getBaseClientResponse'
import addBaseClientRequestFactory from './requests/addBaseClientRequest'
import clientSecretsResponseFactory from './responses/clientSecretsResponse'
import updateBaseClientRequestFactory from './requests/updateBaseClientRequest'
import updateBaseClientDeploymentFactory from './requests/updateBaseClientDeploymentRequest'
import listClientInstancesResponseFactory from './responses/listClientInstancesResponse'

export {
  baseClientFactory,
  listBaseClientResponseFactory,
  getBaseClientResponseFactory,
  clientSecretsResponseFactory,
  addBaseClientRequestFactory,
  updateBaseClientRequestFactory,
  updateBaseClientDeploymentFactory,
  listClientInstancesResponseFactory,
}
