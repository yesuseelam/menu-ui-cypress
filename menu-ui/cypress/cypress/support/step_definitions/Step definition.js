/// <reference types="Cypress" />
import Login from '../models/emm_loginModel';


given('I launch CMT', () => {

    cy.on('uncaught:exception', (err, runnable) => {
        expect(err.message).to.include('something about the error');
        done();
        return false;

        cy.log('Welcome to EMDM')
    });
});

when('I see the title', () => {
   Login.visit();
    cy.log("Welcome to the EMDM ")
   //cy.title().should('enterprise-menu-management','enterprise-menu-management')
    
});


then('Login to EMM', () => {
    cy.visit('/menu')
    Login.appLogin();
   // cy.title().should('enterprise-menu-management','enterprise-menu-management')


});