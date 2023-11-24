import Page, { PageElement } from './page'

export default class EditBaseClientDetailsPage extends Page {
  constructor() {
    super('Edit base client details')
  }

  baseClientIdInput = (): PageElement => cy.get('[data-qa="base-client-id-input"]')

  baseClientAccessTokenValidityDropdown = (): PageElement =>
    cy.get('[data-qa="base-client-access-token-validity-dropdown"]')

  baseClientAccessTokenValidityInput = (): PageElement => cy.get('[data-qa="base-client-access-token-validity-input"]')

  baseClientApprovedScopesInput = (): PageElement => cy.get('[data-qa="base-client-approved-scopes-input"]')

  auditTrailDetailsInput = (): PageElement => cy.get('[data-qa="audit-trail-details-input"]')

  grantTypeInput = (): PageElement => cy.get('[data-qa="grant-type-input"]')

  grantAuthoritiesInput = (): PageElement => cy.get('[data-qa="grant-authorities-input"]')

  grantDatabaseUsernameInput = (): PageElement => cy.get('[data-qa="grant-database-username-input"]')

  grantRedirectUrisInput = (): PageElement => cy.get('[data-qa="grant-redirect-uris-input"]')

  grantJwtFieldsInput = (): PageElement => cy.get('[data-qa="grant-jwt-fields-input"]')

  grantAzureAdLoginFlowCheckboxes = (): PageElement => cy.get('[data-qa="grant-azure-ad-login-flow-checkboxes"]')

  configDoesExpireCheckbox = (): PageElement => cy.get('[data-qa="config-does-expire-checkbox"]')

  configExpiryDaysInput = (): PageElement => cy.get('[data-qa="config-expiry-days-input"]')

  configAllowedIpsInput = (): PageElement => cy.get('[data-qa="config-allowed-ips-input"]')

  saveButton = (): PageElement => cy.get('[data-qa="save-button"]')

  cancelLink = (): PageElement => cy.get('[data-qa="cancel-link"]')
}
