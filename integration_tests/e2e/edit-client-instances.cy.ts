import Page from '../pages/page'
import ViewBaseClientPage from '../pages/viewBaseClient'
import ViewClientSecretsPage from '../pages/viewClientSecrets'
import ConfirmDeleteClientPage from '../pages/confirmDeleteClient'
import { GrantTypes } from '../../server/data/enums/grantTypes'

const visitBaseClientPage = (): ViewBaseClientPage => {
  cy.signIn({ failOnStatusCode: true, redirectPath: '/base-clients/base_client_id_1' })
  return Page.verifyOnPage(ViewBaseClientPage)
}

const visitConfirmDeleteClientPage = (): ConfirmDeleteClientPage => {
  cy.signIn({
    failOnStatusCode: true,
    redirectPath: '/base-clients/base_client_id_1/clients/base_client_id_1_01/delete',
  })
  return Page.verifyOnPage(ConfirmDeleteClientPage)
}

context('Base client page - client instances', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubGetBaseClient', { grantType: GrantTypes.ClientCredentials })
    cy.task('stubManageUser')
    cy.task('stubGetListClientInstancesList')
  })

  context('Add client instances', () => {
    let baseClientsPage: ViewBaseClientPage

    beforeEach(() => {
      cy.task('stubAddClientInstance')
      baseClientsPage = visitBaseClientPage()
    })

    it('User can click Add on base-client page to create new client instance', () => {
      baseClientsPage.addClientInstanceButton().click()
      Page.verifyOnPage(ViewClientSecretsPage)
    })

    context('Client secrets page', () => {
      let clientSecretsPage: ViewClientSecretsPage

      beforeEach(() => {
        baseClientsPage.addClientInstanceButton().click()
        clientSecretsPage = Page.verifyOnPage(ViewClientSecretsPage)
      })

      it('User can see client secrets', () => {
        clientSecretsPage.secretsTable().should('be.visible')
      })

      it('User can click continue to be taken back to base client page', () => {
        clientSecretsPage.continueButton().click()
        Page.verifyOnPage(ViewBaseClientPage)
      })
    })
  })

  context('Delete client instances', () => {
    let confirmDeleteClientPage: ConfirmDeleteClientPage

    beforeEach(() => {
      cy.task('stubDeleteClientInstance')
      confirmDeleteClientPage = visitConfirmDeleteClientPage()
    })

    it('User can see warning message', () => {
      confirmDeleteClientPage.warningMessage().should('be.visible')
    })

    it('Should not have error message by default', () => {
      confirmDeleteClientPage.errorMessage().should('not.exist')
    })

    it('User can fill out confirm then click Delete on base-client page to delete client instance', () => {
      confirmDeleteClientPage.confirmInput().clear()
      confirmDeleteClientPage.confirmInput().type('base_client_id_1_01')

      confirmDeleteClientPage.deleteButton().click()
      Page.verifyOnPage(ViewBaseClientPage)
    })

    it('User does not fill out Confirmation input clicking delete returns to page with error', () => {
      confirmDeleteClientPage.confirmInput().clear()

      confirmDeleteClientPage.deleteButton().click()
      confirmDeleteClientPage = Page.verifyOnPage(ConfirmDeleteClientPage)

      confirmDeleteClientPage.errorMessage().should('be.visible')
    })

    it('User fills out incorrect Confirmation input clicking delete returns to page with error', () => {
      confirmDeleteClientPage.confirmInput().clear()
      confirmDeleteClientPage.confirmInput().type('incorrect_client_id')

      confirmDeleteClientPage.deleteButton().click()
      confirmDeleteClientPage = Page.verifyOnPage(ConfirmDeleteClientPage)

      confirmDeleteClientPage.errorMessage().should('be.visible')
    })

    it('User can click cancel to return to base client screen', () => {
      confirmDeleteClientPage.cancelButton().click()
      Page.verifyOnPage(ViewBaseClientPage)
    })
  })
})
