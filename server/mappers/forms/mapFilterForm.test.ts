import type { Request } from 'express'
import { createMock } from '@golevelup/ts-jest'
import mapFilterForm from './mapFilterForm'
import { BaseClientListFilter } from '../../interfaces/baseClientApi/baseClient'
import { GrantType } from '../../data/enums/grantType'
import { ClientType } from '../../data/enums/clientTypes'

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

  describe('grant radios', () => {
    it('processes single string', () => {
      const request = formRequest({
        grantType: 'client_credentials',
      })

      const result: BaseClientListFilter = mapFilterForm(request)

      expect(result.grantType).toEqual(GrantType.ClientCredentials)
    })
  })

  describe('client type radios', () => {
    it('parses filter on but no selection as select all', () => {
      const request = formRequest({
        filterClientType: 'clientFilter',
      })

      const result: BaseClientListFilter = mapFilterForm(request)

      expect(result.clientType).toBeUndefined()
    })
    it('parses filter on with all selected as select all', () => {
      const request = formRequest({
        filterClientType: 'clientFilter',
        clientType: ['personal', 'service', 'blank'],
      })

      const result: BaseClientListFilter = mapFilterForm(request)

      expect(result.clientType).toBeUndefined()
    })

    it('processes single string', () => {
      const request = formRequest({
        filterClientType: 'clientFilter',
        clientType: 'personal',
      })

      const result: BaseClientListFilter = mapFilterForm(request)

      expect(result.clientType).toEqual([ClientType.Personal])
    })
    it('processes array', () => {
      const request = formRequest({
        filterClientType: 'clientFilter',
        clientType: ['personal', 'service'],
      })

      const result: BaseClientListFilter = mapFilterForm(request)

      expect(result.clientType).toEqual([ClientType.Personal, ClientType.Service])
    })
  })
})
