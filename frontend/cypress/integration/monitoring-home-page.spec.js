// import {homeMonitoring}from "../fixtures/moduleconfig.json";
import { ModuleConfig } from '../../app/module.config.ts';

describe('Testing Monitoring Page', () => {
  before(() => {
    cy.geonatureLogout();
    cy.geonatureLogin();
    cy.initialLoadRequest();
    cy.monitoringsHomePage();
  });

  it('should display title module', () => {
    // cy.fixture('../fixtures/moduleconfig.js').then((config)=>{
    // this.config = config
    // print(this.config)
    cy.get('.title-module').contains(ModuleConfig.TITLE_MODULE);
    // })
  });

  it('should display desc modules', () => {
    cy.get('[data-cy="desc-modules"]').contains(ModuleConfig.DESCRIPTION_MODULE);
  });

  it('should have button name Accès aux sites', () => {
    cy.get('div.modules  button').should('have.text', ' Accès aux sites ');
  });

  it('should have 4 protocoles installed', () => {
    cy.get('[data-cy="card-protocoles"]').children().should('have.length', 4);
  });
});
