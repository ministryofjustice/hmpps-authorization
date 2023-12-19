import Page from '../pages/page'
import EditBaseClientDetailsPage from '../pages/editBaseClientDetails'
import ViewBaseClientPage from '../pages/viewBaseClient'

const visitEditBaseClientDetailsPage = (): EditBaseClientDetailsPage => {
  cy.signIn({ failOnStatusCode: true, redirectPath: '/base-clients/base_client_id_1/edit' })
  return Page.verifyOnPage(EditBaseClientDetailsPage)
}

context('Edit base client details page', () => {
  let editBaseClientDetailsPage: EditBaseClientDetailsPage

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('stubListBaseClients')
    cy.task('stubGetBaseClient')
    cy.task('stubGetListClientInstancesList')
    editBaseClientDetailsPage = visitEditBaseClientDetailsPage()
  })

  it('User can see base-client form inputs', () => {
    editBaseClientDetailsPage.baseClientIdInput().should('exist')
    editBaseClientDetailsPage.baseClientAccessTokenValidityDropdown().should('be.visible')
    editBaseClientDetailsPage.baseClientApprovedScopesInput().should('be.visible')
  })

  it('User can see audit trail form inputs', () => {
    editBaseClientDetailsPage.auditTrailDetailsInput().should('be.visible')
  })

  it('User can see grant details form inputs', () => {
    editBaseClientDetailsPage.grantTypeInput().should('be.visible')
    editBaseClientDetailsPage.grantAuthoritiesInput().should('be.visible')
    editBaseClientDetailsPage.grantDatabaseUsernameInput().should('be.visible')
  })

  it('User can see config form inputs', () => {
    editBaseClientDetailsPage.configDoesExpireCheckbox().should('exist')
    editBaseClientDetailsPage.configAllowedIpsInput().should('be.visible')
  })

  context('Access token validity dropdown', () => {
    it('Custom input is initially hidden', () => {
      editBaseClientDetailsPage.baseClientAccessTokenValidityInput().should('not.be.visible')
    })

    it('Custom input is shown when custom option is selected', () => {
      editBaseClientDetailsPage.baseClientAccessTokenValidityDropdown().select('Custom')
      editBaseClientDetailsPage.baseClientAccessTokenValidityInput().should('be.visible')
    })
  })

  context('Allow client to expire ', () => {
    it('Does expire checkbox is unchecked by default', () => {
      editBaseClientDetailsPage.configDoesExpireCheckbox().should('not.be.checked')
    })

    it('Expiry days input is shown if checkbox is selected', () => {
      editBaseClientDetailsPage.configDoesExpireCheckbox().click()
      editBaseClientDetailsPage.configExpiryDaysInput().should('be.visible')
    })
  })

  it('User clicks cancel to return to base-client screen', () => {
    editBaseClientDetailsPage.cancelLink().click()
    Page.verifyOnPage(ViewBaseClientPage)
  })

  it('User clicks continue to post new client details screen', () => {
    // enter new audit details
    editBaseClientDetailsPage.auditTrailDetailsInput().clear()
    editBaseClientDetailsPage.auditTrailDetailsInput().type('updated')

    // set up to check the POST request
    cy.intercept('POST', '/base-clients/base_client_id_1/edit', req => {
      const { body } = req
      expect(body).to.contain('audit=updated')
    })

    editBaseClientDetailsPage.saveButton().click()
  })
})
