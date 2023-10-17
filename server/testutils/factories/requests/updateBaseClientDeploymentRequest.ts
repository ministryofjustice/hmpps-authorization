import { Factory } from 'fishery'
import { UpdateBaseClientDeploymentRequest } from '../../../interfaces/baseClientApi/baseClientRequestBody'

export default Factory.define<UpdateBaseClientDeploymentRequest>(() => ({
  clientType: 'SERVICE',
  team: 'Example Team',
  teamContact: 'teamContact',
  teamSlack: 'teamSlack',
  hosting: 'hosting',
  namespace: 'namespace',
  deployment: 'deployment',
  secretName: 'secretName',
  clientIdKey: 'clientIdKey',
  secretKey: 'secretKey',
  deploymentInfo: 'deploymentInfo',
}))
