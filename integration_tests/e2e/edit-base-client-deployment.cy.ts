import Page from '../pages/page'
import ViewBaseClientPage from '../pages/viewBaseClient'
import EditBaseClientDeploymentDetailsPage from '../pages/editBaseClientDeploymentDetails'
import { GrantType } from '../../server/data/enums/grantType'
import AuthSignInPage from '../pages/authSignIn'
import AuthErrorPage from '../pages/authError'

const visitEditBaseClientDeploymentDetailsPage = (): EditBaseClientDeploymentDetailsPage => {
  cy.signIn({ failOnStatusCode: true, redirectPath: '/base-clients/base_client_id_1/deployment' })
  return Page.verifyOnPage(EditBaseClientDeploymentDetailsPage)
}

context('Edit base client deployment: Auth', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('stubListBaseClients')
    cy.task('stubGetBaseClient', { grantType: GrantType.ClientCredentials, includeService: true })
    cy.task('stubGetListClientInstancesList')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/base-clients/base_client_id_1/deployment')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User without ROLE_OAUTH_ADMIN role denied access', () => {
    cy.task('stubSignIn', ['ROLE_OTHER'])
    cy.signIn({ failOnStatusCode: false, redirectPath: '/base-clients/base_client_id_1/deployment' })

    Page.verifyOnPage(AuthErrorPage)
  })
})

context('Edit base client deployment details page', () => {
  let editBaseClientDeploymentDetailsPage: EditBaseClientDeploymentDetailsPage

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('stubListBaseClients')
    cy.task('stubGetBaseClient', { grantType: GrantType.ClientCredentials, includeService: true })
    cy.task('stubGetListClientInstancesList')
    editBaseClientDeploymentDetailsPage = visitEditBaseClientDeploymentDetailsPage()
  })

  it('User can see contact details form inputs', () => {
    editBaseClientDeploymentDetailsPage.baseClientSummaryList().should('be.visible')
    editBaseClientDeploymentDetailsPage.deploymentTypeRadios().should('be.visible')
    editBaseClientDeploymentDetailsPage.deploymentTeamInput().should('be.visible')
    editBaseClientDeploymentDetailsPage.deploymentTeamContactInput().should('be.visible')
    editBaseClientDeploymentDetailsPage.deploymentTeamSlackInput().should('be.visible')
  })

  it('User can see platform details form inputs', () => {
    editBaseClientDeploymentDetailsPage.platformHostingRadios().should('be.visible')
    editBaseClientDeploymentDetailsPage.platformNamespaceInput().should('be.visible')
    editBaseClientDeploymentDetailsPage.platformDeploymentInput().should('be.visible')
    editBaseClientDeploymentDetailsPage.platformSecretNameInput().should('be.visible')
    editBaseClientDeploymentDetailsPage.platformSecretKeyInput().should('be.visible')
    editBaseClientDeploymentDetailsPage.platformClientIdInput().should('be.visible')
    editBaseClientDeploymentDetailsPage.platformDeploymentInfoInput().should('be.visible')
  })

  it('User clicks cancel to return to base-client screen', () => {
    editBaseClientDeploymentDetailsPage.cancelLink().click()
    Page.verifyOnPage(ViewBaseClientPage)
  })

  it('User clicks continue to post new client deployment details', () => {
    // enter new audit details
    editBaseClientDeploymentDetailsPage.deploymentTeamInput().clear()
    editBaseClientDeploymentDetailsPage.deploymentTeamInput().type('HAHA')

    // set up to check the POST request
    cy.intercept('POST', '/base-clients/base_client_id_1/deployment', req => {
      const { body } = req
      expect(body).to.contain('team=HAHA')
    })

    editBaseClientDeploymentDetailsPage.saveButton().click()
  })
})
