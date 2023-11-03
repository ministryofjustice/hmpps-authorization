import { baseClientFactory, clientFactory } from '../../testutils/factories'
import viewBaseClientPresenter from './viewBaseClientPresenter'
import { offsetNow } from '../../utils/utils'

describe('viewBaseClientPresenter', () => {
  describe('clientsTable', () => {
    it('formats dates as DD/MM/YYYY', () => {
      // Given some base clients with some clients
      const baseClient = baseClientFactory.build()
      const clients = [
        clientFactory.build({
          clientId: 'clientIdA',
          created: new Date('2020-01-01'),
          accessed: new Date('2020-01-02'),
        }),
        clientFactory.build({
          clientId: 'clientIdB',
          created: new Date('2020-02-01'),
          accessed: new Date('2020-02-02'),
        }),
      ]

      // When we map to a presenter
      const presenter = viewBaseClientPresenter(baseClient, clients)

      // Then the dates are formatted as DD/MM/YYYY
      const expectedCreated = ['01/01/2020', '01/02/2020']
      const actualCreated = presenter.clientsTable.map(row => row[1].html)
      expect(expectedCreated).toEqual(actualCreated)

      const expectedAccessed = ['02/01/2020', '02/02/2020']
      const actualAccessed = presenter.clientsTable.map(row => row[2].html)
      expect(expectedAccessed).toEqual(actualAccessed)
    })

    it('links to a delete page for each client', () => {
      // Given some base clients with some clients
      const baseClient = baseClientFactory.build({ baseClientId: 'baseClientId' })
      const clients = [clientFactory.build({ clientId: 'clientIdA' }), clientFactory.build({ clientId: 'clientIdB' })]

      // When we map to a presenter
      const presenter = viewBaseClientPresenter(baseClient, clients)

      // Then the dates are formatted as DD/MM/YYYY
      const expected = [
        '<a class="govuk-link" href="/base-clients/baseClientId/clients/clientIdA/delete">delete</a>',
        '<a class="govuk-link" href="/base-clients/baseClientId/clients/clientIdB/delete">delete</a>',
      ]
      const actual = presenter.clientsTable.map(row => row[3].html)
      expect(expected).toEqual(actual)
    })
  })

  describe('expiry', () => {
    it('expiryDate is null returns "No"', () => {
      // Given a base client with no expiry date
      const baseClient = baseClientFactory.build({ config: { expiryDate: null } })
      const clients = clientFactory.buildList(2)

      // When we map to a presenter
      const presenter = viewBaseClientPresenter(baseClient, clients)

      // Then the expiry is "No"
      expect(presenter.expiry).toEqual('No')
    })

    it('expiryDate is in the past returns "Yes - days remaining 0"', () => {
      // Given a base client with expiry date in the past
      const baseClient = baseClientFactory.build({ config: { expiryDate: '2020-01-01' } })
      const clients = clientFactory.buildList(2)

      // When we map to a presenter
      const presenter = viewBaseClientPresenter(baseClient, clients)

      // Then the expiry is "No"
      expect(presenter.expiry).toEqual('Yes - days remaining 0')
    })

    it('expiryDate is in two days returns "Yes - days remaining 2"', () => {
      // Given a base client with expiry date in two days
      const expiryDate = offsetNow(2).toISOString()
      const baseClient = baseClientFactory.build({ config: { expiryDate } })
      const clients = clientFactory.buildList(2)

      // When we map to a presenter
      const presenter = viewBaseClientPresenter(baseClient, clients)

      // Then the expiry is "No"
      expect(presenter.expiry).toEqual('Yes - days remaining 2')
    })
  })
})
