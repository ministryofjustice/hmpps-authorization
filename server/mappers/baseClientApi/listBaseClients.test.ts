import { createMock } from '@golevelup/ts-jest'
import { Request } from 'express'
import { mapFilterToUrlQuery, mapListBaseClientRequest } from './listBaseClients'

describe('Mappers for filtering base client list', () => {
  describe('mapListBaseClientRequest', () => {
    it('maps to a default filter when the query is empty', async () => {
      // GIVEN a request with an empty query
      const request = createMock<Request>({
        query: {},
      })

      // WHEN we map the request to a filter
      const filter = mapListBaseClientRequest(request)

      // THEN the filter defaults to include all values
      const expected = {
        roleSearch: '',
        clientCredentials: true,
        authorisationCode: true,
        serviceClientType: true,
        personalClientType: true,
        blankClientType: true,
      }
      expect(filter).toEqual(expected)
    })

    it('maps role parameter to roleSearch', async () => {
      // GIVEN a request with a role parameter
      const request = createMock<Request>({
        query: {
          role: 'test role',
        },
      })

      // WHEN we map the request to a filter
      const filter = mapListBaseClientRequest(request)

      // THEN the filter defaults to include the roleSearch value
      const expected = {
        roleSearch: 'test role',
        clientCredentials: true,
        authorisationCode: true,
        serviceClientType: true,
        personalClientType: true,
        blankClientType: true,
      }
      expect(filter).toEqual(expected)
    })

    it('maps grantType parameters', async () => {
      // GIVEN a request with a grantType parameter
      const request = createMock<Request>({
        query: {
          grantType: 'client-credentials',
        },
      })

      // WHEN we map the request to a filter
      const filter = mapListBaseClientRequest(request)

      // THEN the filter includes specified grantType only
      const expected = {
        roleSearch: '',
        clientCredentials: true,
        authorisationCode: false,
        serviceClientType: true,
        personalClientType: true,
        blankClientType: true,
      }
      expect(filter).toEqual(expected)
    })

    it('maps multiple grantType parameters', async () => {
      // GIVEN a request with a grantType parameter
      const request = createMock<Request>({
        query: {
          grantType: ['client-credentials', 'authorization-code'],
        },
      })

      // WHEN we map the request to a filter
      const filter = mapListBaseClientRequest(request)

      // THEN the filter includes all specified grantTypes
      const expected = {
        roleSearch: '',
        clientCredentials: true,
        authorisationCode: true,
        serviceClientType: true,
        personalClientType: true,
        blankClientType: true,
      }
      expect(filter).toEqual(expected)
    })

    it('maps clientType parameters', async () => {
      // GIVEN a request with a client parameter
      const request = createMock<Request>({
        query: {
          clientType: 'personal',
        },
      })

      // WHEN we map the request to a filter
      const filter = mapListBaseClientRequest(request)

      // THEN the filter includes specified grantType only
      const expected = {
        roleSearch: '',
        clientCredentials: true,
        authorisationCode: true,
        serviceClientType: false,
        personalClientType: true,
        blankClientType: false,
      }
      expect(filter).toEqual(expected)
    })

    it('maps multiple clientType parameters', async () => {
      // GIVEN a request with a client parameter
      const request = createMock<Request>({
        query: {
          clientType: ['personal', 'service'],
        },
      })

      // WHEN we map the request to a filter
      const filter = mapListBaseClientRequest(request)

      // THEN the filter includes all specified clientTypes
      const expected = {
        roleSearch: '',
        clientCredentials: true,
        authorisationCode: true,
        serviceClientType: true,
        personalClientType: true,
        blankClientType: false,
      }
      expect(filter).toEqual(expected)
    })
  })

  describe('mapFilterToUrlQuery', () => {
    it('maps to an empty string when the filter is empty', async () => {
      // GIVEN an empty filter
      const filter = {
        roleSearch: '',
        clientCredentials: true,
        authorisationCode: true,
        serviceClientType: true,
        personalClientType: true,
        blankClientType: true,
      }

      // WHEN we map the filter to a query string
      const query = mapFilterToUrlQuery(filter)

      // THEN the query is empty
      expect(query).toEqual('')
    })

    it('maps roleSearch to role', async () => {
      // GIVEN a filter with a roleSearch
      const filter = {
        roleSearch: 'test',
        clientCredentials: true,
        authorisationCode: true,
        serviceClientType: true,
        personalClientType: true,
        blankClientType: true,
      }

      // WHEN we map the filter to a query string
      const query = mapFilterToUrlQuery(filter)

      // THEN the query includes the roleSearch value
      expect(query).toEqual('role=test')
    })

    it('maps roleSearch to role with encoded characters', async () => {
      // GIVEN a filter with a roleSearch
      const filter = {
        roleSearch: 'test role',
        clientCredentials: true,
        authorisationCode: true,
        serviceClientType: true,
        personalClientType: true,
        blankClientType: true,
      }

      // WHEN we map the filter to a query string
      const query = mapFilterToUrlQuery(filter)

      // THEN the query includes the roleSearch value with encoded characters
      expect(query).toEqual('role=test%20role')
    })

    it('maps grantType parameters', async () => {
      // GIVEN a filter with a grantType parameter
      const filter = {
        roleSearch: '',
        clientCredentials: true,
        authorisationCode: false,
        serviceClientType: true,
        personalClientType: true,
        blankClientType: true,
      }

      // WHEN we map the filter to a query string
      const query = mapFilterToUrlQuery(filter)

      // THEN the query includes specified grantType only
      expect(query).toEqual('grantType=client-credentials')
    })

    it('maps clientType parameters', async () => {
      // GIVEN a filter with a client parameter
      const filter = {
        roleSearch: '',
        clientCredentials: true,
        authorisationCode: true,
        serviceClientType: false,
        personalClientType: true,
        blankClientType: false,
      }

      // WHEN we map the filter to a query string
      const query = mapFilterToUrlQuery(filter)

      // THEN the query includes specified grantType only
      expect(query).toEqual('clientType=personal')
    })

    it('maps multiple clientType parameters', async () => {
      // GIVEN a filter with a client parameter
      const filter = {
        roleSearch: '',
        clientCredentials: true,
        authorisationCode: true,
        serviceClientType: true,
        personalClientType: true,
        blankClientType: false,
      }

      // WHEN we map the filter to a query string
      const query = mapFilterToUrlQuery(filter)

      // THEN the query includes all specified clientTypes
      expect(query).toEqual('clientType=personal&clientType=service')
    })

    it('maps all parameters', async () => {
      // GIVEN a filter with a client parameter
      const filter = {
        roleSearch: 'test role',
        clientCredentials: true,
        authorisationCode: false,
        serviceClientType: true,
        personalClientType: true,
        blankClientType: false,
      }

      // WHEN we map the filter to a query string
      const query = mapFilterToUrlQuery(filter)

      // THEN the query includes all specified clientTypes
      expect(query).toEqual('role=test%20role&grantType=client-credentials&clientType=personal&clientType=service')
    })
  })
})
