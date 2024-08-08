import Page from '../pages/page'
import ViewBaseClientPage from '../pages/viewBaseClient'
import ViewClientSecretsPage from '../pages/viewClientSecrets'
import ConfirmDeleteClientPage from '../pages/confirmDeleteClient'
import EditBaseClientDetailsPage from '../pages/editBaseClientDetails'
import EditBaseClientDeploymentDetailsPage from '../pages/editBaseClientDeploymentDetails'
import { GrantType } from '../../server/data/enums/grantType'
import AuthSignInPage from '../pages/authSignIn'
import AuthErrorPage from '../pages/authError'

const visitBaseClientPage = (): ViewBaseClientPage => {
  cy.signIn({ failOnStatusCode: true, redirectPath: '/base-clients/base_client_id_1' })
  return Page.verifyOnPage(ViewBaseClientPage)
}

context('Base client page - Auth', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubGetBaseClient', { grantType: GrantType.ClientCredentials, includeService: false })
    cy.task('stubManageUser')
    cy.task('stubGetListClientInstancesList')
    cy.task('stubAddClientInstance')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/base-clients/base_client_id_1')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User without ROLE_OAUTH_ADMIN role denied access', () => {
    cy.task('stubSignIn', ['ROLE_OTHER'])
    cy.signIn({ failOnStatusCode: false, redirectPath: '/base-clients/base_client_id_1' })

    Page.verifyOnPage(AuthErrorPage)
  })
})

context('Base client page - client credentials flow', () => {
  let baseClientsPage: ViewBaseClientPage

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubGetBaseClient', { grantType: GrantType.ClientCredentials, includeService: false })
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

    it('User cannot see authorization-code table', () => {
      baseClientsPage.baseClientAuthorizationCodeTable().should('not.exist')
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

context('Base client page - authorization-code flow', () => {
  let baseClientsPage: ViewBaseClientPage

  context('Base client details - response includes service details', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn')
      cy.task('stubGetBaseClient', { grantType: GrantType.AuthorizationCode, includeService: true })
      cy.task('stubManageUser')
      cy.task('stubGetListClientInstancesList')
      cy.task('stubAddClientInstance')
      baseClientsPage = visitBaseClientPage()
    })

    it('User can see base client details table', () => {
      baseClientsPage.baseClientDetailsTable().should('be.visible')
    })

    it('User can see audit trail table', () => {
      baseClientsPage.baseClientAuditTable().should('be.visible')
    })

    it('User cannot see client credentials table', () => {
      baseClientsPage.baseClientClientCredentialsTable().should('not.exist')
    })

    it('User can see authorization-code table', () => {
      baseClientsPage.baseClientAuthorizationCodeTable().should('be.visible')
    })

    it('User can see config table', () => {
      baseClientsPage.baseClientConfigTable().should('be.visible')
    })

    it('User can see service details panel', () => {
      baseClientsPage.baseClientServiceDetailsTable().should('be.visible')
    })
  })

  context('Base client details - response has null service details', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubSignIn')
      cy.task('stubGetBaseClient', { grantType: GrantType.AuthorizationCode, includeService: false })
      cy.task('stubManageUser')
      cy.task('stubGetListClientInstancesList')
      cy.task('stubAddClientInstance')
      baseClientsPage = visitBaseClientPage()
    })

    it('User can see base client details table', () => {
      baseClientsPage.baseClientDetailsTable().should('be.visible')
    })

    it('User can see audit trail table', () => {
      baseClientsPage.baseClientAuditTable().should('be.visible')
    })

    it('User cannot see client credentials table', () => {
      baseClientsPage.baseClientClientCredentialsTable().should('not.exist')
    })

    it('User can see authorization-code table', () => {
      baseClientsPage.baseClientAuthorizationCodeTable().should('be.visible')
    })

    it('User can see config table', () => {
      baseClientsPage.baseClientConfigTable().should('be.visible')
    })

    it('User cannot see service details panel', () => {
      baseClientsPage.baseClientServiceDetailsTable().should('not.exist')
    })
  })
})
