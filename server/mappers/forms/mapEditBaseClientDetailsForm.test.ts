import type { Request } from 'express'
import { createMock } from '@golevelup/ts-jest'
import { baseClientFactory } from '../../testutils/factories'
import { dateISOString, offsetNow } from '../../utils/utils'
import { mapEditBaseClientDetailsForm } from '../index'
import { GrantType } from '../../data/enums/grantType'
import { MfaType } from '../../data/enums/mfaTypes'

const formRequest = (form: Record<string, unknown>) => {
  return createMock<Request>({ body: form })
}

describe('mapEditBaseClientDetailsForm', () => {
  describe('accessTokenValidity', () => {
    it.each([
      ['1200', '1200', '', 1200],
      ['3600', '3600', '', 3600],
      ['43200', '43200', '', 43200],
      ['Null selection', null, '', 0],
      ['Custom with value', 'custom', '25', 25],
      ['Custom with string value', 'custom', 'blah', 0],
    ])(
      'sets accessTokenValidity based on combination of dropdown selection %s and text box contents %s',
      (_: string, selection: string, text: string, expected: number) => {
        const baseClient = baseClientFactory.build({ accessTokenValidity: null })
        const request = formRequest({ accessTokenValidity: selection, customAccessTokenValidity: text })

        const updated = mapEditBaseClientDetailsForm(baseClient, request)

        expect(updated.accessTokenValidity).toEqual(expected)
      },
    )
  })

  describe('expiry', () => {
    it('defaults to null if expiry is null', () => {
      const expiry: boolean = null
      const expiryDays: string = null
      const baseClient = baseClientFactory.build({ accessTokenValidity: null })
      const request = formRequest({ expiry, expiryDays })

      const presenter = mapEditBaseClientDetailsForm(baseClient, request)

      expect(presenter.config.expiryDate).toBeNull()
    })

    it('defaults to already expired for non-numeric day count', () => {
      const expiry: boolean = true
      const expiryDays: string = 'blah'
      const baseClient = baseClientFactory.build({ accessTokenValidity: null })
      const request = formRequest({ expiry, expiryDays })

      const presenter = mapEditBaseClientDetailsForm(baseClient, request)

      const expected = dateISOString(offsetNow(0))
      expect(presenter.config.expiryDate).toEqual(expected)
    })

    it('can be in the past (negative expiry days)', () => {
      const expiry: boolean = true
      const expiryDays: string = '-1'
      const baseClient = baseClientFactory.build({ accessTokenValidity: null })
      const request = formRequest({ expiry, expiryDays })

      const presenter = mapEditBaseClientDetailsForm(baseClient, request)

      const expected = dateISOString(offsetNow(-1))
      expect(presenter.config.expiryDate).toEqual(expected)
    })

    it('can be in the future (positive expiry days)', () => {
      const expiry: boolean = true
      const expiryDays: string = '1'
      const baseClient = baseClientFactory.build({ accessTokenValidity: null })
      const request = formRequest({ expiry, expiryDays })

      const presenter = mapEditBaseClientDetailsForm(baseClient, request)

      const expected = dateISOString(offsetNow(1))
      expect(presenter.config.expiryDate).toEqual(expected)
    })
  })

  describe('updates details only', () => {
    it('updates Client_credentials details', () => {
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

      // and given an edit request with client credentials fields populated
      const request = formRequest({
        baseClientId: detailedBaseClient.baseClientId,
        approvedScopes: 'requestscope1,requestscope2',
        audit: 'request audit',
        grantType: GrantType.ClientCredentials,
        authorities: 'requestauthority1\r\nrequestauthority2',
        databaseUsername: 'request databaseUsername',
        allowedIPs: 'requestallowedIP1\r\nrequestallowedIP2',
        expiry: true,
        expiryDays: '1',
      })

      // when the form is mapped
      const update = mapEditBaseClientDetailsForm(detailedBaseClient, request)

      // then the client details are updated
      expect(update.baseClientId).toEqual(detailedBaseClient.baseClientId)
      expect(update.scopes).toEqual(['requestscope1', 'requestscope2'])
      expect(update.audit).toEqual('request audit')
      expect(update.grantType).toEqual(GrantType.ClientCredentials)
      expect(update.clientCredentials.authorities).toEqual(['requestauthority1', 'requestauthority2'])
      expect(update.clientCredentials.databaseUserName).toEqual('request databaseUsername')
      expect(update.config.allowedIPs).toEqual(['requestallowedIP1', 'requestallowedIP2'])

      // but deployment and service details are not updated
      expect(update.deployment.team).toEqual(detailedBaseClient.deployment.team)
      expect(update.service.serviceName).toEqual(detailedBaseClient.service.serviceName)
    })

    it('updates Authorization code details', () => {
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

      // and given an edit request with client credentials fields populated
      const request = formRequest({
        baseClientId: detailedBaseClient.baseClientId,
        approvedScopes: 'requestscope1,requestscope2',
        audit: 'request audit',
        grantType: GrantType.AuthorizationCode,
        redirectUris: 'requestredirectUri1\r\nrequestredirectUri2',
        jwtFields: 'request jwtFields',
        azureAdLoginFlow: 'redirect',
        mfa: MfaType.None,
        mfaRememberMe: false,
        expiry: true,
        expiryDays: '1',
      })

      // when the form is mapped
      const update = mapEditBaseClientDetailsForm(detailedBaseClient, request)

      // then the authorisationCode details are updated
      expect(update.authorisationCode.registeredRedirectURIs).toEqual(['requestredirectUri1', 'requestredirectUri2'])
      expect(update.authorisationCode.jwtFields).toEqual('request jwtFields')
      expect(update.authorisationCode.azureAdLoginFlow).toEqual(true)
      expect(update.authorisationCode.mfa).toEqual(MfaType.None)
      expect(update.authorisationCode.mfaRememberMe).toEqual(false)
    })
  })
})
