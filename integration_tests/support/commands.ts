Cypress.Commands.add('signIn', (options = { failOnStatusCode: true, redirectPath: '/' }) => {
  const { failOnStatusCode, redirectPath } = options
  cy.request(redirectPath || '/')
  return cy.task('getSignInUrl').then((url: string) => cy.visit(url, { failOnStatusCode }))
})
