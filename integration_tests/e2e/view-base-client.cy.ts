import Page from '../pages/page'
import ViewBaseClientPage from '../pages/viewBaseClient'
import ViewClientSecretsPage from '../pages/viewClientSecrets'
import ConfirmDeleteClientPage from '../pages/confirmDeleteClient'
import EditBaseClientDetailsPage from '../pages/editBaseClientDetails'
import EditBaseClientDeploymentDetailsPage from '../pages/editBaseClientDeploymentDetails'

const visitBaseClientPage = (): ViewBaseClientPage => {
  cy.signIn({ failOnStatusCode: true, redirectPath: '/base-clients/base_client_id_1' })
  return Page.verifyOnPage(ViewBaseClientPage)
}

context('Base client page', () => {
  let baseClientsPage: ViewBaseClientPage

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubGetBaseClient')
    cy.task('stubManageUser')
    cy.task('stubGetListClientInstancesList')
    cy.task('stubAddClientInstance')

    baseClientsPage = visitBaseClientPage()
  })

  context('Client instances', () => {
    it('User can see client instance list', () => {
      baseClientsPage.clientInstanceRows().should('have.length', 3)
    })

    it('User can click add to create new client instance', () => {
      baseClientsPage.addClientInstanceButton().click()
      Page.verifyOnPage(ViewClientSecretsPage)
    })

    it('User can click delete to be taken to delete confirmation page', () => {
      baseClientsPage.clientInstanceDeleteButtons().first().click()
      Page.verifyOnPage(ConfirmDeleteClientPage)
    })
  })

  context('Base client details', () => {
    it('User can see base client details table', () => {
      baseClientsPage.baseClientDetailsTable().should('be.visible')
    })

    it('User can see audit trail table', () => {
      baseClientsPage.baseClientAuditTable().should('be.visible')
    })

    it('User can see client credentials table', () => {
      baseClientsPage.baseClientClientCredentialsTable().should('be.visible')
    })

    it('User can see config table', () => {
      baseClientsPage.baseClientConfigTable().should('be.visible')
    })

    it('User can click Change client details to be taken to edit page', () => {
      baseClientsPage.changeClientDetailsLink().click()
      Page.verifyOnPage(EditBaseClientDetailsPage)
    })
  })

  context('Deployment details', () => {
    it('User can see deployment contacts table', () => {
      baseClientsPage.baseClientDeploymentContactTable().should('be.visible')
    })

    it('User can see deployment platform table', () => {
      baseClientsPage.baseClientDeploymentPlatformTable().should('be.visible')
    })

    it('User can click Change client details to be taken to edit deployment page', () => {
      baseClientsPage.changeDeploymentDetailsLink().click()
      Page.verifyOnPage(EditBaseClientDeploymentDetailsPage)
    })
  })
})
