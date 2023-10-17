import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { UpdateBaseClientDeploymentRequest } from '../../interfaces/baseClientApi/baseClientRequestBody'

export default (baseClient: BaseClient): UpdateBaseClientDeploymentRequest => {
  return {
    clientType: baseClient.clientType,
    team: baseClient.deployment.team,
    teamContact: baseClient.deployment.teamContact,
    teamSlack: baseClient.deployment.teamSlack,
    hosting: baseClient.deployment.hosting,
    namespace: baseClient.deployment.namespace,
    deployment: baseClient.deployment.deployment,
    secretName: baseClient.deployment.secretName,
    clientIdKey: baseClient.deployment.clientIdKey,
    secretKey: baseClient.deployment.secretKey,
    deploymentInfo: baseClient.deployment.deploymentInfo,
  }
}
