import Page from '../pages/page'
import EditBaseClientDetailsPage from '../pages/editBaseClientDetails'
import ViewBaseClientPage from '../pages/viewBaseClient'
import { GrantTypes } from '../../server/data/enums/grantTypes'
import AuthSignInPage from '../pages/authSignIn'
import AuthErrorPage from '../pages/authError'

const visitEditBaseClientDetailsPage = (): EditBaseClientDetailsPage => {
  cy.signIn({ failOnStatusCode: true, redirectPath: '/base-clients/base_client_id_1/edit' })
  return Page.verifyOnPage(EditBaseClientDetailsPage)
}

context('Edit base client details: Auth', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('stubListBaseClients')
    cy.task('stubGetBaseClient')
    cy.task('stubGetListClientInstancesList')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/base-clients/base_client_id_1/deployment')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User without ROLE_OAUTH_ADMIN role denied access', () => {
    cy.task('stubSignIn', ['ROLE_OTHER'])
    cy.signIn({ failOnStatusCode: false, redirectPath: '/base-clients/base_client_id_1/edit' })

    Page.verifyOnPage(AuthErrorPage)
  })
})

context('Edit base client details page - client-credentials flow', () => {
  let editBaseClientDetailsPage: EditBaseClientDetailsPage

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('stubListBaseClients')
    cy.task('stubGetBaseClient', { grantType: GrantTypes.ClientCredentials })
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

  context('Grant section for client-credentials flow', () => {
    it('User can see client credentials form inputs', () => {
      editBaseClientDetailsPage.grantTypeInput().should('be.visible')
      editBaseClientDetailsPage.grantAuthoritiesInput().should('be.visible')
      editBaseClientDetailsPage.grantDatabaseUsernameInput().should('be.visible')
    })

    it('User cannot see authorization code form inputs', () => {
      editBaseClientDetailsPage.grantRedirectUrisInput().should('not.exist')
      editBaseClientDetailsPage.grantJwtFieldsInput().should('not.exist')
      editBaseClientDetailsPage.grantAzureAdLoginFlowCheckboxes().should('not.exist')
    })
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

context('Edit base client details page - authorization-code flow', () => {
  let editBaseClientDetailsPage: EditBaseClientDetailsPage

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('stubListBaseClients')
    cy.task('stubGetBaseClient', { grantType: GrantTypes.AuthorizationCode })
    cy.task('stubGetListClientInstancesList')
    editBaseClientDetailsPage = visitEditBaseClientDetailsPage()
  })

  it('User cannot see client credentials form inputs', () => {
    editBaseClientDetailsPage.grantAuthoritiesInput().should('not.exist')
    editBaseClientDetailsPage.grantDatabaseUsernameInput().should('not.exist')
  })

  it('User can see authorization code form inputs', () => {
    editBaseClientDetailsPage.grantTypeInput().should('be.visible')
    editBaseClientDetailsPage.grantRedirectUrisInput().should('be.visible')
    editBaseClientDetailsPage.grantJwtFieldsInput().should('be.visible')
    editBaseClientDetailsPage.grantAzureAdLoginFlowCheckboxes().should('exist')
  })
})
