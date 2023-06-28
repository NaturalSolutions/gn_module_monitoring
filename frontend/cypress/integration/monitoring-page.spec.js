describe('Testing Monitoring Page', () => {
  before(() => {
    cy.geonatureLogout();
    cy.geonatureLogin();
  });

  it('should display monitoring page', () => {
    cy.get('[data-qa="gn-sidenav-link-MONITORINGS"]').click({ force: true });
    cy.url().should('include', 'monitorings');
    cy.wait(500);
  });

  // it('back to home', () => {
  //   cy.get('[data-qa="gn-sidenav-mat-card"]').click();
  // });
});
