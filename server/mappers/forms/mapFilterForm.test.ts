import type { Request } from 'express'
import { createMock } from '@golevelup/ts-jest'
import mapFilterForm from './mapFilterForm'
import { BaseClientListFilter } from '../../interfaces/baseClientApi/baseClient'

const formRequest = (form: Record<string, unknown>) => {
  return createMock<Request>({ body: form })
}

describe('mapFilterForm', () => {
  describe('role input', () => {
    it('submits roles', () => {
      const request = formRequest({
        role: 'role ',
      })

      const result = mapFilterForm(request)

      expect(result.roleSearch).toEqual('role')
    })
  })

  describe('grant checkbox', () => {
    it('processes undefined', () => {
      const request = formRequest({})

      const result: BaseClientListFilter = mapFilterForm(request)

      expect(result.authorisationCode).toBeFalsy()
      expect(result.clientCredentials).toBeFalsy()
    })
    it('processes single string', () => {
      const request = formRequest({
        grantType: 'client_credentials',
      })

      const result: BaseClientListFilter = mapFilterForm(request)

      expect(result.authorisationCode).toBeFalsy()
      expect(result.clientCredentials).toBeTruthy()
    })
    it('processes array', () => {
      const request = formRequest({
        grantType: ['client_credentials', 'authorization_code'],
      })

      const result: BaseClientListFilter = mapFilterForm(request)

      expect(result.authorisationCode).toBeTruthy()
      expect(result.clientCredentials).toBeTruthy()
    })
  })

  describe('client type checkbox', () => {
    it('processes undefined', () => {
      const request = formRequest({})

      const result: BaseClientListFilter = mapFilterForm(request)

      expect(result.personalClientType).toBeFalsy()
      expect(result.serviceClientType).toBeFalsy()
      expect(result.blankClientType).toBeFalsy()
    })
    it('processes single string', () => {
      const request = formRequest({
        clientType: 'personal',
      })

      const result: BaseClientListFilter = mapFilterForm(request)

      expect(result.personalClientType).toBeTruthy()
      expect(result.serviceClientType).toBeFalsy()
      expect(result.blankClientType).toBeFalsy()
    })
    it('processes array', () => {
      const request = formRequest({
        clientType: ['personal', 'service'],
      })

      const result: BaseClientListFilter = mapFilterForm(request)

      expect(result.personalClientType).toBeTruthy()
      expect(result.serviceClientType).toBeTruthy()
      expect(result.blankClientType).toBeFalsy()
    })
  })
})
