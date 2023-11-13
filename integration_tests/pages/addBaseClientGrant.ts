import Page from './page'

export default class AddBaseClientGrantPage extends Page {
  constructor() {
    super('Select a grant type')
  }

  grantTypeRadioGroup = () => cy.get('[data-qa="grant-type-radio-group"]')

  clientCredentialsRadio = () => cy.get('[data-qa="client-credentials-radio"]')

  authorizationCodeRadio = () => cy.get('[data-qa="authorization-code-radio"]')

  continueButton = () => cy.get('[data-qa="continue-button"]')

  cancelLink = () => cy.get('[data-qa="cancel-link"]')
}
