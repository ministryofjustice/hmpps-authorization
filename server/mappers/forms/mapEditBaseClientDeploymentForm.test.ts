import type { Request } from 'express'
import { createMock } from '@golevelup/ts-jest'
import { baseClientFactory } from '../../testutils/factories'
import { mapEditBaseClientDeploymentForm } from '../index'

const formRequest = (form: Record<string, unknown>) => {
  return createMock<Request>({ body: form })
}

describe('mapEditBaseClientDeploymentForm', () => {
  describe('updates deployment details only', () => {
    it('updates details only', () => {
      // Given a base client with fields populated
      const detailedBaseClient = baseClientFactory.build({
        accessTokenValidity: 3600,
        deployment: {
          team: 'deployment team',
        },
        service: {
          serviceName: 'service serviceName',
        },
      })

      // and given an edit deployment request with all fields populated
      const request = formRequest({
        team: 'team',
        teamContact: 'contact',
        teamSlack: 'slack',
        hosting: 'CLOUDPLATFORM',
        namespace: 'b',
        deployment: 'c',
        secretName: 'd',
        clientIdKey: 'e',
        secretKey: 'f',
        deploymentInfo: 'g',
      })

      // when the form is mapped
      const update = mapEditBaseClientDeploymentForm(detailedBaseClient, request)

      // then the deployment details are updated
      expect(update.deployment.team).toEqual('team')
      expect(update.deployment.teamContact).toEqual('contact')
      expect(update.deployment.teamSlack).toEqual('slack')
      expect(update.deployment.hosting).toEqual('CLOUDPLATFORM')
      expect(update.deployment.namespace).toEqual('b')
      expect(update.deployment.deployment).toEqual('c')
      expect(update.deployment.secretName).toEqual('d')
      expect(update.deployment.clientIdKey).toEqual('e')
      expect(update.deployment.secretKey).toEqual('f')
      expect(update.deployment.deploymentInfo).toEqual('g')

      // but regular client details and service details are not updated
      expect(update.accessTokenValidity).toEqual(3600)
      expect(update.service.serviceName).toEqual(detailedBaseClient.service.serviceName)
    })
  })
})
