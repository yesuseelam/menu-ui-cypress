/// <reference types="Cypress" />
import Login from '../support/models/emm_loginModel'

describe('Verifying and Download Reports - API  ', function () {

  beforeEach(() => {
    cy.visit('/reports')
    Login.appLogin();
    cy.get('#tab2 > .row > .col-8').click({ force: true });
  })
  afterEach(function () {
    cy.contains('signout').click({force:true});
     
      cy.log("Test case executed Successfully and Logged out from the Menu")
      
  })

  //Nutrition Data download verification
  /*it('Login to the EMM and Nutrition Data  API import ', function () {

    cy.get('span').contains('Select a Country').click({ force: true });
    cy.contains('Canada').click();
    cy.contains('Download').click();
    cy.log('File Downloaded successfully.');


  })*/

  //Global Menus Data Down load verification
  it('Global Menus API Import', function () {

    cy.get('#tab2 > .row > .col-8').click({ force: true }).debug();
    cy.get('span').contains(' Global Menus ').click({ force: true })
    cy.wait(5000)
    
      cy.get('span').contains('Select a Destination').click({ force: true }).then(() => {

     
        cy.contains('Digital Menu Board').click({force:true})
      
      
      cy.get('button').contains('Download').click({ force: true });
      cy.log('Global File Downloaded successfully.');

    })

    

  })



  /*describe('Location set type ', function() {
    it('Select Location set Type ', function() {
  
      cy.get('[role="listbox"]').click({force:true});
     
      
      
    })
  })*/
  //Log out from Menu
  /*describe('Logout from the Menu', function() {
    
    it('Log out', function() {
    
      cy.get('#tab2 > .row > .col-8').click({force:true}).debug();
      cy.url().should('include', '/reports')
      
      cy.contains('signout').click({force:true});
     
      cy.log("Test case executed Successfully and Logged out from the Menu")
      
    })
  })*/


})





