import { baseClientFactory } from '../../testutils/factories'
import editBaseClientPresenter from './editBaseClientPresenter'

describe('editBaseClientPresenter', () => {
  describe('accessTokenValidity', () => {
    it.each([
      [1200, '1200'],
      [3600, '3600'],
      [43200, '43200'],
    ])('sets accessTokenValidity dropdown value for preset %d', (a: number, expected: string) => {
      const baseClient = baseClientFactory.build({ accessTokenValidity: a })

      const presenter = editBaseClientPresenter(baseClient)

      expect(presenter.accessTokenValidityDropdown).toEqual(expected)
    })

    it.each([
      ['custom case', 900, 'custom', '900'],
      ['default to zero', null, null, ''],
    ])(
      'sets custom accessTokenValidity dropdown and text value for custom value',
      (_, a: number, expectedDropdown: string, expectedText: string) => {
        const baseClient = baseClientFactory.build({ accessTokenValidity: a })

        const presenter = editBaseClientPresenter(baseClient)

        expect(presenter.accessTokenValidityDropdown).toEqual(expectedDropdown)
        expect(presenter.accessTokenValidityText).toEqual(expectedText)
      },
    )

    it('sets custom accessTokenValidity dropdown and text value for custom value', () => {
      const custom = 900
      const baseClient = baseClientFactory.build({ accessTokenValidity: custom })

      const presenter = editBaseClientPresenter(baseClient)

      expect(presenter.accessTokenValidityDropdown).toEqual('custom')
      expect(presenter.accessTokenValidityText).toEqual('900')
    })

    it('sets custom accessTokenValidity dropdown and text value for custom value', () => {
      const custom = 900
      const baseClient = baseClientFactory.build({ accessTokenValidity: custom })

      const presenter = editBaseClientPresenter(baseClient)

      expect(presenter.accessTokenValidityDropdown).toEqual('custom')
      expect(presenter.accessTokenValidityText).toEqual('900')
    })
  })

  describe('expiry', () => {
    it('defaults to null and empty string if expiryDate is null', () => {
      const expiryDate: string = null
      const baseClient = baseClientFactory.build({ config: { expiryDate } })

      const presenter = editBaseClientPresenter(baseClient)

      expect(presenter.expiry).toBeFalsy()
      expect(presenter.daysRemaining).toEqual('')
    })

    it('sets expiry to true and days to 0 if expiry date is in the past', () => {
      const expiryDate: string = '2020-01-01'
      const baseClient = baseClientFactory.build({ config: { expiryDate } })

      const presenter = editBaseClientPresenter(baseClient)

      expect(presenter.expiry).toBeTruthy()
      expect(presenter.daysRemaining).toEqual(0)
    })

    it('sets expiry to true and days to 0 if expiry date is in the future', () => {
      const dateTomorrow = new Date()
      dateTomorrow.setDate(dateTomorrow.getDate() + 1)
      const expiryDate: string = dateTomorrow.toISOString()

      const baseClient = baseClientFactory.build({ config: { expiryDate } })

      const presenter = editBaseClientPresenter(baseClient)

      expect(presenter.expiry).toBeTruthy()
      expect(presenter.daysRemaining).toEqual(1)
    })
  })
})
