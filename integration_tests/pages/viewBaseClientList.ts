import Page, { PageElement } from './page'

export default class ViewBaseClientListPage extends Page {
  constructor() {
    super('OAuth Client details')
  }

  public baseClientList = (): PageElement => cy.get('[data-qa=baseClientList]')
}
