Cypress.Commands.add('initialLoadRequest', () => {
  cy.intercept('gn_commons/modules').as('getModules');
  cy.intercept('notifications/*').as('getNotification');
  cy.intercept('synthese/*').as('getSynthese');
  cy.wait(['@getModules', '@getNotification', '@getSynthese']).then((interceptions) => {
    console.log(interceptions);
  });
});

Cypress.Commands.add('monitoringsHomePage', () => {
  cy.visit('/#/monitorings');
});
