import Page, { PageElement } from './page'

export default class EditBaseClientDeploymentDetailsPage extends Page {
  constructor() {
    super('Edit deployment details')
  }

  baseClientSummaryList = (): PageElement => cy.get('[data-qa="base-client-summary-list"]')

  deploymentServiceRadioButton = (): PageElement => cy.get('[data-qa="deployment-service-radio"]')

  deploymentPersonalRadioButton = (): PageElement => cy.get('[data-qa="deployment-personal-radio"]')

  deploymentTypeRadios = (): PageElement => cy.get('[data-qa="deployment-type-radios"]')

  deploymentTeamInput = (): PageElement => cy.get('[data-qa="deployment-team-input"]')

  deploymentTeamContactInput = (): PageElement => cy.get('[data-qa="deployment-team-contact-input"]')

  deploymentTeamSlackInput = (): PageElement => cy.get('[data-qa="deployment-team-slack-input"]')

  platformHostingRadios = (): PageElement => cy.get('[data-qa="platform-hosting-radios"]')

  platformNamespaceInput = (): PageElement => cy.get('[data-qa="platform-namespace-input"]')

  platformDeploymentInput = (): PageElement => cy.get('[data-qa="platform-deployment-input"]')

  platformSecretNameInput = (): PageElement => cy.get('[data-qa="platform-secret-name-input"]')

  platformSecretKeyInput = (): PageElement => cy.get('[data-qa="platform-secret-key-input"]')

  platformClientIdInput = (): PageElement => cy.get('[data-qa="platform-client-id-input"]')

  platformDeploymentInfoInput = (): PageElement => cy.get('[data-qa="platform-deployment-info-input"]')

  saveButton = (): PageElement => cy.get('[data-qa="save-button"]')

  cancelLink = (): PageElement => cy.get('[data-qa="cancel-link"]')
}
