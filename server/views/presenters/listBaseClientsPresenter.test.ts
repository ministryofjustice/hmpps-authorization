import { BaseClient, BaseClientListFilter } from '../../interfaces/baseClientApi/baseClient'
import { baseClientFactory, filterFactory } from '../../testutils/factories'
import listBaseClientsPresenter, { filterBaseClient } from './listBaseClientsPresenter'
import { GrantTypes } from '../../data/enums/grantTypes'
import { ClientType } from '../../data/enums/clientTypes'

let baseClients: BaseClient[]

describe('listBaseClientsPresenter', () => {
  beforeEach(() => {
    // Given some base clients
    const baseClientA = baseClientFactory.build({
      baseClientId: 'baseClientIdA',
      count: 1,
      clientCredentials: { authorities: ['ONE', 'TWO'] },
    })
    const baseClientB = baseClientFactory.build({
      baseClientId: 'baseClientIdB',
      count: 2,
      clientCredentials: { authorities: ['ALPHA'] },
    })
    baseClients = [baseClientA, baseClientB]
  })

  it('contains a constant for table head', () => {
    // When we map to a presenter
    const presenter = listBaseClientsPresenter(baseClients, filterFactory.build())

    // Then it contains a table head constant
    expect(presenter.tableHead).not.toBeNull()
  })

  describe('tableHeadRows', () => {
    it('maps a link to the view page in the first column', () => {
      // When we map to a presenter
      const presenter = listBaseClientsPresenter(baseClients, filterFactory.build())

      const expected = [
        "<a href='/base-clients/baseClientIdA'>baseClientIdA</a>",
        "<a href='/base-clients/baseClientIdB'>baseClientIdB</a>",
      ]
      const actual = presenter.tableRows.map(row => row[0].html)
      expect(actual).toEqual(expected)
    })

    it('maps moj-badge for count to the second column if count > 1', () => {
      // When we map to a presenter
      const presenter = listBaseClientsPresenter(baseClients)
      const expected = ['', "<span class='moj-badge'>2</span>"]
      const actual = presenter.tableRows.map(row => row[1].html)
      expect(actual).toEqual(expected)
    })

    it('maps client credentials authorities to the sixth column joining using html breaks', () => {
      // When we map to a presenter
      const presenter = listBaseClientsPresenter(baseClients)
      const expected = ['ONE<br>TWO', 'ALPHA']
      const actual = presenter.tableRows.map(row => row[5].html)
      expect(actual).toEqual(expected)
    })
  })

  describe('filter', () => {
    describe('by role - free text search', () => {
      it('matches if the free text matches a client credentials authority', () => {
        const filter = filterFactory.build({ roleSearch: 'ONE' })
        const baseClient = baseClientFactory.build({ clientCredentials: { authorities: ['ONE', 'TWO'] } })

        const passesFilter = filterBaseClient(baseClient, filter)

        expect(passesFilter).toBeTruthy()
      })

      it('is case insensitive', () => {
        const filter = filterFactory.build({ roleSearch: 'onE' })
        const baseClient = baseClientFactory.build({ clientCredentials: { authorities: ['ONE', 'TWO'] } })

        const passesFilter = filterBaseClient(baseClient, filter)

        expect(passesFilter).toBeTruthy()
      })

      it('ignores whitespace', () => {
        const filter = filterFactory.build({ roleSearch: ' one ' })
        const baseClient = baseClientFactory.build({ clientCredentials: { authorities: ['ONE', 'TWO'] } })

        const passesFilter = filterBaseClient(baseClient, filter)

        expect(passesFilter).toBeTruthy()
      })

      it('does not filter if search is empty', () => {
        const filter = filterFactory.build({ roleSearch: '' })
        const baseClient = baseClientFactory.build({ clientCredentials: { authorities: ['ONE', 'TWO'] } })

        const passesFilter = filterBaseClient(baseClient, filter)

        expect(passesFilter).toBeTruthy()
      })

      it('does not matches if the free text not contained in a client credentials authority', () => {
        const filter = filterFactory.build({ roleSearch: 'ONE' })
        const baseClient = baseClientFactory.build({ clientCredentials: { authorities: ['alpha', 'beta'] } })

        const passesFilter = filterBaseClient(baseClient, filter)

        expect(passesFilter).toBeFalsy()
      })
    })

    describe('by grant type', () => {
      const clientCredentialsBaseClient = baseClientFactory.build({ grantType: GrantTypes.ClientCredentials })
      const authCodeBaseClient = baseClientFactory.build({ grantType: GrantTypes.AuthorizationCode })

      it('defaults to matching all types', () => {
        const filter = filterFactory.build()

        expect(filterBaseClient(clientCredentialsBaseClient, filter)).toBeTruthy()
        expect(filterBaseClient(authCodeBaseClient, filter)).toBeTruthy()
      })

      it('can filter out only client credentials', () => {
        const filter = filterFactory.build({ clientCredentials: false })

        expect(filterBaseClient(clientCredentialsBaseClient, filter)).toBeFalsy()
        expect(filterBaseClient(authCodeBaseClient, filter)).toBeTruthy()
      })

      it('can filter out only auth code', () => {
        const filter = filterFactory.build({ authorisationCode: false })

        expect(filterBaseClient(clientCredentialsBaseClient, filter)).toBeTruthy()
        expect(filterBaseClient(authCodeBaseClient, filter)).toBeFalsy()
      })
    })

    describe('by client type', () => {
      const serviceBaseClient = baseClientFactory.build({ deployment: { clientType: ClientType.Service } })
      const personalBaseClient = baseClientFactory.build({ deployment: { clientType: ClientType.Personal } })
      const blankBaseClient = baseClientFactory.build({ deployment: { clientType: '' } })

      it('defaults to matching all types', () => {
        const filter = filterFactory.build()

        expect(filterBaseClient(serviceBaseClient, filter)).toBeTruthy()
        expect(filterBaseClient(personalBaseClient, filter)).toBeTruthy()
        expect(filterBaseClient(blankBaseClient, filter)).toBeTruthy()
      })

      it('can filter out service clients', () => {
        const filter = filterFactory.build({ serviceClientType: false })

        expect(filterBaseClient(serviceBaseClient, filter)).toBeFalsy()
        expect(filterBaseClient(personalBaseClient, filter)).toBeTruthy()
        expect(filterBaseClient(blankBaseClient, filter)).toBeTruthy()
      })

      it('can filter out personal clients', () => {
        const filter = filterFactory.build({ personalClientType: false })

        expect(filterBaseClient(serviceBaseClient, filter)).toBeTruthy()
        expect(filterBaseClient(personalBaseClient, filter)).toBeFalsy()
        expect(filterBaseClient(blankBaseClient, filter)).toBeTruthy()
      })

      it('can filter out blank clients', () => {
        const filter = filterFactory.build({ blankClientType: false })

        expect(filterBaseClient(serviceBaseClient, filter)).toBeTruthy()
        expect(filterBaseClient(personalBaseClient, filter)).toBeTruthy()
        expect(filterBaseClient(blankBaseClient, filter)).toBeFalsy()
      })
    })
  })

  describe('filter presenter values', () => {
    describe('showSelectedFilters', () => {
      it('returns false if no filter is given', () => {
        const presenter = listBaseClientsPresenter(baseClients)

        expect(presenter.showSelectedFilters).toBeFalsy()
      })

      it('returns false if no filters are selected', () => {
        const filter = filterFactory.build()
        const presenter = listBaseClientsPresenter(baseClients, filter)

        expect(presenter.showSelectedFilters).toBeFalsy()
      })

      it('returns true if any filters are selected', () => {
        const filter = filterFactory.build({ roleSearch: 'ONE' })
        const presenter = listBaseClientsPresenter(baseClients, filter)

        expect(presenter.showSelectedFilters).toBeTruthy()
      })
    })

    describe('selectedFilterCategories', () => {
      it('is empty by default', () => {
        const filter = filterFactory.build()
        const { selectedFilterCategories } = listBaseClientsPresenter(baseClients, filter)

        expect(selectedFilterCategories).toHaveLength(0)
      })

      it('has a role category if a role search string is applied', () => {
        const filter = filterFactory.build({ roleSearch: 'ONE' })
        const { selectedFilterCategories } = listBaseClientsPresenter(baseClients, filter)

        expect(selectedFilterCategories).toHaveLength(1)
        expect(selectedFilterCategories[0].heading.text).toEqual('Role')
        expect(selectedFilterCategories[0].items[0].text).toEqual('ONE')
      })

      it('has visible grant type category if either of the grant types are deselected', () => {
        const filter = filterFactory.build({ clientCredentials: false })
        const { selectedFilterCategories } = listBaseClientsPresenter(baseClients, filter)

        expect(selectedFilterCategories).toHaveLength(1)
        expect(selectedFilterCategories[0].heading.text).toEqual('Grant type')
        expect(selectedFilterCategories[0].items[0].text).toEqual('Authorisation code')
      })

      it('has no grant type category if all grant types are deselected', () => {
        const filter = filterFactory.build({ clientCredentials: false, authorisationCode: false })
        const { selectedFilterCategories } = listBaseClientsPresenter(baseClients, filter)

        expect(selectedFilterCategories).toHaveLength(0)
      })

      it('has visible client type category if single client type is selected', () => {
        const filter = filterFactory.build({ serviceClientType: false, personalClientType: false })
        const { selectedFilterCategories } = listBaseClientsPresenter(baseClients, filter)

        expect(selectedFilterCategories).toHaveLength(1)
        expect(selectedFilterCategories[0].heading.text).toEqual('Client type')
        expect(selectedFilterCategories[0].items[0].text).toEqual('Blank')
      })

      it('has two client type categories if single client type is selected', () => {
        const filter = filterFactory.build({ serviceClientType: false })
        const { selectedFilterCategories } = listBaseClientsPresenter(baseClients, filter)

        expect(selectedFilterCategories).toHaveLength(1)
        expect(selectedFilterCategories[0].heading.text).toEqual('Client type')
        expect(selectedFilterCategories[0].items[0].text).toEqual('Personal')
        expect(selectedFilterCategories[0].items[1].text).toEqual('Blank')
      })

      it('has no client type category if no client type is selected', () => {
        const filter = filterFactory.build({
          blankClientType: false,
          personalClientType: false,
          serviceClientType: false,
        })
        const { selectedFilterCategories } = listBaseClientsPresenter(baseClients, filter)

        expect(selectedFilterCategories).toHaveLength(0)
      })

      it('can have complex filters with multiple categories', () => {
        const filter = filterFactory.build({
          roleSearch: 'ONE',
          clientCredentials: false,
          serviceClientType: false,
        })
        const { selectedFilterCategories } = listBaseClientsPresenter(baseClients, filter)

        expect(selectedFilterCategories).toHaveLength(3)
        expect(selectedFilterCategories[0].heading.text).toEqual('Role')
        expect(selectedFilterCategories[0].items[0].text).toEqual('ONE')
        expect(selectedFilterCategories[1].heading.text).toEqual('Grant type')
        expect(selectedFilterCategories[1].items[0].text).toEqual('Authorisation code')
        expect(selectedFilterCategories[2].heading.text).toEqual('Client type')
        expect(selectedFilterCategories[2].items[0].text).toEqual('Personal')
        expect(selectedFilterCategories[2].items[1].text).toEqual('Blank')
      })
    })

    describe('removeFilterLink', () => {
      // Given some base clients
      const baseClientA = baseClientFactory.build({
        baseClientId: 'baseClientIdA',
        count: 1,
        clientCredentials: { authorities: ['ONE', 'TWO'] },
      })
      const baseClientB = baseClientFactory.build({
        baseClientId: 'baseClientIdB',
        count: 2,
        clientCredentials: { authorities: ['ALPHA'] },
      })
      baseClients = [baseClientA, baseClientB]

      // current URL is /?role=ONE&grantType=authorization-code&clientType=personal&clientType=blank
      const compoundFilter = filterFactory.build({
        roleSearch: 'ONE',
        clientCredentials: false,
        serviceClientType: false,
      })

      const presenter = listBaseClientsPresenter(baseClients, compoundFilter)

      it('removes the role search', () => {
        const roleItem = presenter.selectedFilterCategories[0].items[0]
        const expected = '/?grantType=authorization-code&clientType=personal&clientType=blank'
        const actual = roleItem.href
        expect(actual).toEqual(expected)
      })

      it('removes the grant category completely if all grant type items removed', () => {
        const grantTypeItem = presenter.selectedFilterCategories[1].items[0]
        const expected = '/?role=ONE&clientType=personal&clientType=blank'
        const actual = grantTypeItem.href
        expect(actual).toEqual(expected)
      })

      it('retains the blank clientType item if personal clientType removed', () => {
        const clientTypeItem = presenter.selectedFilterCategories[2].items[0]
        const expected = '/?role=ONE&grantType=authorization-code&clientType=blank'
        const actual = clientTypeItem.href
        expect(actual).toEqual(expected)
      })
    })
  })
})
