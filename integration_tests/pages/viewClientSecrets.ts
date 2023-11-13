import Page, { PageElement } from './page'

export default class ViewClientSecretsPage extends Page {
  constructor() {
    super('Client has been added')
  }

  secretsTable = (): PageElement => cy.get('[data-qa="secrets-table"]')

  continueButton = (): PageElement => cy.get('[data-qa="continue-button"]')
}
