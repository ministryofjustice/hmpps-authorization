import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { UpdateBaseClientDeploymentRequest } from '../../interfaces/baseClientApi/baseClientRequestBody'
import { apiEnum } from '../../utils/utils'

export default (baseClient: BaseClient): UpdateBaseClientDeploymentRequest => {
  return {
    clientType: apiEnum(baseClient.deployment.clientType.toUpperCase()),
    team: baseClient.deployment.team,
    teamContact: baseClient.deployment.teamContact,
    teamSlack: baseClient.deployment.teamSlack,
    hosting: apiEnum(baseClient.deployment.hosting),
    namespace: baseClient.deployment.namespace,
    deployment: baseClient.deployment.deployment,
    secretName: baseClient.deployment.secretName,
    clientIdKey: baseClient.deployment.clientIdKey,
    secretKey: baseClient.deployment.secretKey,
    deploymentInfo: baseClient.deployment.deploymentInfo,
  }
}
