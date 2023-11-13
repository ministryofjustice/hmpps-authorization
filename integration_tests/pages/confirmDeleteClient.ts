import Page, { PageElement } from './page'

export default class ConfirmDeleteClientPage extends Page {
  constructor() {
    super('Delete client?')
  }

  warningMessage = (): PageElement => cy.get('[data-qa="delete-warning"]')

  confirmInput = (): PageElement => cy.get('[data-qa="confirm-input"]')

  errorMessage = (): PageElement => cy.get('[data-qa="error-message"]')

  deleteButton = (): PageElement => cy.get('[data-qa="delete-button"]')

  cancelButton = (): PageElement => cy.get('[data-qa="cancel-button"]')
}
