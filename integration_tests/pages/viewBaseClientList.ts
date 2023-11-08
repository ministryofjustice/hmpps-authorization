import Page, { PageElement } from './page'

export default class ViewBaseClientListPage extends Page {
  constructor() {
    super('OAuth Client details')
  }

  public baseClientList = (): PageElement => cy.get('[data-qa=baseClientList]')

  public addNewBaseClient = (): PageElement => cy.get('[data-qa=addNewBaseClientButton]')

  public toggleFilterButton = (): PageElement => cy.get('.toggle-filter-button')

  public applyFilterButton = (): PageElement => cy.get('.govuk-button').contains('Apply filters')

  public filterPanel = (): PageElement => cy.get('.moj-filter')

  public roleFilterInputBox = (): PageElement => cy.get('[data-qa=roleFilterInputBox]')
}
