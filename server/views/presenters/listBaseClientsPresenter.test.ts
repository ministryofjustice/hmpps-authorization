import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { baseClientFactory } from '../../testutils/factories'
import listBaseClientsPresenter from './listBaseClientsPresenter'

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
    const presenter = listBaseClientsPresenter(baseClients)

    // Then it contains a table head constant
    expect(presenter.tableHead).not.toBeNull()
  })

  describe('tableHeadRows', () => {
    it('maps a link to the view page in the first column', () => {
      // When we map to a presenter
      const presenter = listBaseClientsPresenter(baseClients)

      const expected = [
        '<a href="/base-clients/baseClientIdA">baseClientIdA</a>',
        '<a href="/base-clients/baseClientIdB">baseClientIdB</a>',
      ]
      const actual = presenter.tableRows.map(row => row[0].html)
      expect(actual).toEqual(expected)
    })

    it('maps moj-badge for count to the second column if count > 1', () => {
      // When we map to a presenter
      const presenter = listBaseClientsPresenter(baseClients)
      const expected = ['', '<span class="moj-badge">2</span>']
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
})
