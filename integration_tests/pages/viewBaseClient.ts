import Page from './page'

export default class ViewBaseClientPage extends Page {
  constructor() {
    super('Client:')
  }

  clientInstanceList = () => cy.get('[data-qa="client-instance-list"]')

  clientInstanceRows = () => this.clientInstanceList().find('tr')

  clientInstanceDeleteButtons = () => this.clientInstanceList().find('[data-qa="delete-client-instance-link"]')

  addClientInstanceButton = () => cy.get('[data-qa="add-new-client-button"]')

  baseClientDetailsTable = () => cy.get('[data-qa="base-client-details-table"]')

  baseClientAuditTable = () => cy.get('[data-qa="base-client-audit-table"]')

  baseClientClientCredentialsTable = () => cy.get('[data-qa="base-client-client-credentials-table"]')

  baseClientAuthorizationCodeTable = () => cy.get('[data-qa="base-client-authorization-code-table"]')

  baseClientConfigTable = () => cy.get('[data-qa="base-client-config-table"]')

  baseClientDeploymentContactTable = () => cy.get('[data-qa="base-client-deployment-contact-table"]')

  baseClientDeploymentPlatformTable = () => cy.get('[data-qa="base-client-deployment-platform-table"]')

  changeClientDetailsLink = () => cy.get('[data-qa="change-client-details-link"]')

  changeDeploymentDetailsLink = () => cy.get('[data-qa="change-deployment-details-link"]')
}
