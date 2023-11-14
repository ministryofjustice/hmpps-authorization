import type { Request } from 'express'
import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { snake } from '../../utils/utils'

export default (baseClient: BaseClient, request: Request): BaseClient => {
  const data = request.body
  return {
    ...baseClient,
    deployment: {
      team: data.team,
      teamContact: data.teamContact,
      teamSlack: data.teamSlack,
      hosting: snake(data.hosting),
      namespace: data.namespace,
      deployment: data.deployment,
      secretName: data.secretName,
      clientIdKey: data.clientIdKey,
      secretKey: data.secretKey,
      deploymentInfo: data.deploymentInfo,
    },
  }
}
