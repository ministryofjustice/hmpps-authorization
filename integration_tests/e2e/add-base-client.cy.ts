import Page from '../pages/page'
import AddBaseClientGrantPage from '../pages/addBaseClientGrant'
import AddBaseClientDetailsPage from '../pages/addBaseClientDetails'
import ViewBaseClientListPage from '../pages/viewBaseClientList'

const visitAddBaseClientPage = (): AddBaseClientGrantPage => {
  cy.signIn({ failOnStatusCode: true, redirectPath: '/base-clients/new' })
  return Page.verifyOnPage(AddBaseClientGrantPage)
}

const visitAddWithClientCredentialsPage = (): AddBaseClientDetailsPage => {
  cy.signIn({ failOnStatusCode: true, redirectPath: '/base-clients/new?grant=client-credentials' })
  return Page.verifyOnPage(AddBaseClientDetailsPage)
}

context('Add client page', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('stubListBaseClients')
  })

  context('Add base client choose grant screen', () => {
    let addBaseClientGrantPage: AddBaseClientGrantPage

    beforeEach(() => {
      addBaseClientGrantPage = visitAddBaseClientPage()
    })

    it('User can see select a grant type radio buttons', () => {
      addBaseClientGrantPage.grantTypeRadioGroup().should('be.visible')
    })

    it('Client credentials is selected by default', () => {
      addBaseClientGrantPage.clientCredentialsRadio().should('have.attr', 'checked')
    })

    it('Authorization code is disabled (for now)', () => {
      addBaseClientGrantPage.authorizationCodeRadio().should('have.attr', 'disabled')
    })

    it('User clicks cancel to return to home screen', () => {
      addBaseClientGrantPage.cancelLink().click()
      Page.verifyOnPage(ViewBaseClientListPage)
    })

    it('User clicks continue to got to add base client details screen', () => {
      addBaseClientGrantPage.continueButton().click()
      Page.verifyOnPage(AddBaseClientDetailsPage)
    })
  })

  context('Add base client enter details screen - client credentials', () => {
    let addBaseClientDetailsPage: AddBaseClientDetailsPage

    beforeEach(() => {
      addBaseClientDetailsPage = visitAddWithClientCredentialsPage()
    })

    it('User can see base-client form inputs', () => {
      addBaseClientDetailsPage.baseClientIdInput().should('be.visible')
      addBaseClientDetailsPage.baseClientServiceRadioButton().should('exist')
      addBaseClientDetailsPage.baseClientPersonalRadioButton().should('exist')
      addBaseClientDetailsPage.baseClientAccessTokenValidityDropdown().should('be.visible')
      addBaseClientDetailsPage.baseClientApprovedScopesInput().should('be.visible')
    })

    it('User can see audit trail form inputs', () => {
      addBaseClientDetailsPage.auditTrailDetailsInput().should('be.visible')
    })

    it('User can see grant details form inputs', () => {
      addBaseClientDetailsPage.grantTypeInput().should('be.visible')
      addBaseClientDetailsPage.grantAuthoritiesInput().should('be.visible')
      addBaseClientDetailsPage.grantDatabaseUsernameInput().should('be.visible')
    })

    it('User can see config form inputs', () => {
      addBaseClientDetailsPage.configDoesExpireCheckbox().should('exist')
      addBaseClientDetailsPage.configAllowedIpsInput().should('be.visible')
    })

    context('Access token validity dropdown', () => {
      it('Custom input is initially hidden', () => {
        addBaseClientDetailsPage.baseClientAccessTokenValidityInput().should('not.be.visible')
      })

      it('Custom input is shown when custom option is selected', () => {
        addBaseClientDetailsPage.baseClientAccessTokenValidityDropdown().select('Custom')
        addBaseClientDetailsPage.baseClientAccessTokenValidityInput().should('be.visible')
      })
    })

    context('Allow client to expire ', () => {
      it('Does expire checkbox is unchecked by default', () => {
        addBaseClientDetailsPage.configDoesExpireCheckbox().should('not.be.checked')
      })

      it('Expiry days input is shown if checkbox is selected', () => {
        addBaseClientDetailsPage.configDoesExpireCheckbox().click()
        addBaseClientDetailsPage.configExpiryDaysInput().should('be.visible')
      })
    })

    it('User clicks cancel to return to home screen', () => {
      addBaseClientDetailsPage.cancelLink().click()
      Page.verifyOnPage(ViewBaseClientListPage)
    })

    it('User clicks continue to post new client details screen', () => {
      // enter a base client id
      addBaseClientDetailsPage.baseClientIdInput().type('new-client-id')

      // set up to check the POST request
      cy.intercept('POST', '/base-clients/new', req => {
        const { body } = req
        expect(body).to.contain('baseClientId=new-client-id')
      })

      addBaseClientDetailsPage.saveButton().click()
    })
  })
})
