import Page from '../pages/page'
import ViewBaseClientListPage from '../pages/viewBaseClientList'
import ViewBaseClientPage from '../pages/viewBaseClient'

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
    listBaseClientsPage.baseClientList().first().click()
    Page.verifyOnPage(ViewBaseClientPage)
  })
})
