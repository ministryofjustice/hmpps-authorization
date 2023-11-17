import Page from '../pages/page'
import ViewBaseClientListPage from '../pages/viewBaseClientList'
import ViewBaseClientPage from '../pages/viewBaseClient'
import NewBaseClientGrantPage from '../pages/newBaseClientGrant'

const visitBaseClientListPage = (): ViewBaseClientListPage => {
  cy.signIn()
  cy.visit('/')
  return Page.verifyOnPage(ViewBaseClientListPage)
}

context('Homepage - list base-clients', () => {
  let listBaseClientsPage: ViewBaseClientListPage

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubListBaseClients')
    cy.task('stubGetBaseClient')
    cy.task('stubManageUser')
    cy.task('stubGetListClientInstancesList')

    listBaseClientsPage = visitBaseClientListPage()
  })

  it('User can see base-client list', () => {
    listBaseClientsPage.baseClientList().should('have.length', 3)
  })

  it('User can click through to base-client', () => {
    listBaseClientsPage.baseClientList().first().children('a').click()
    Page.verifyOnPage(ViewBaseClientPage)
  })

  it('User can see Add New button', () => {
    listBaseClientsPage.addNewBaseClient().should('exist')
  })

  it('User can click through to new base-client page', () => {
    listBaseClientsPage.addNewBaseClient().click()
    Page.verifyOnPage(NewBaseClientGrantPage)
  })

  it('Filter page is hidden', () => {
    listBaseClientsPage.filterPanel().should('not.be.visible')
  })

  it('Toggle filter button has text Show filter', () => {
    listBaseClientsPage.toggleFilterButton().should('have.text', 'Show filter')
  })

  it('On click shows filter panel and updates text to Hide filter', () => {
    listBaseClientsPage.toggleFilterButton().click()
    listBaseClientsPage.filterPanel().should('be.visible')
    listBaseClientsPage.toggleFilterButton().should('have.text', 'Hide filter')
  })

  it('On second click hides filter panel and reverts text to Show filter', () => {
    listBaseClientsPage.toggleFilterButton().click()
    listBaseClientsPage.toggleFilterButton().click()
    listBaseClientsPage.filterPanel().should('not.be.visible')
    listBaseClientsPage.toggleFilterButton().should('have.text', 'Show filter')
  })

  it('On second click hides filter panel and reverts text to Show filter', () => {
    listBaseClientsPage.toggleFilterButton().click()
    listBaseClientsPage.toggleFilterButton().click()
    listBaseClientsPage.filterPanel().should('not.be.visible')
    listBaseClientsPage.toggleFilterButton().should('have.text', 'Show filter')
  })

  it('On click Apply filter hides the filter', () => {
    listBaseClientsPage.toggleFilterButton().click()
    listBaseClientsPage.applyFilterButton().click()

    listBaseClientsPage.filterPanel().should('not.be.visible')
  })

  it('On click Apply with filter content limits rows in table', () => {
    listBaseClientsPage.toggleFilterButton().click()
    listBaseClientsPage.roleFilterInputBox().type('ROLE_TWO')

    listBaseClientsPage.applyFilterButton().click()

    listBaseClientsPage.filterPanel().should('not.be.visible')
    listBaseClientsPage.baseClientList().should('have.length', 2)
  })
})
