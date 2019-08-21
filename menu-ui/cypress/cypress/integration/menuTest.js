/// <reference types="Cypress" />
import Login from '../support/models/emm_loginModel';

//Login Page
describe('Verify and login to EMM ', function () {

  beforeEach(() => {
    cy.visit('/menu')
    Login.appLogin();
  })

    /*afterEach( () =>{
      cy.get(':nth-child(1) > #signOut-button').click({ force: true });

            cy.log('Log out from the EMM');
            cy.window(close);
    })*/

    


  


//Click on Select Location Type

//describe('Location set type ', function () {
  it('Select Location set Type ', function () {
    cy.wait(5000)
    cy.get('[data-cy=SetType]').click({ force: true }).then(() => {
    cy.contains('Country').should('be.visible').click({froce:true})
     //cy.get(5000)
      cy.get('[data-cy=InputSetType]').click({ force: true }).then(() => {
        cy.contains('Canada').should('be.visible').click();
        cy.wait(5000)
        cy.get('span').contains(' Digital Menu Board ').click()
        //cy.wait(5000)
        //cy.get('span').contains(' Salads ').click()
  
    })
   
    })
    
   // })
  




describe('Logout from the Menu', function() {
  it('Log out', function() {

    cy.contains('signout').click({force:true});
    //cy.get.('[id="selection_option_375"]').click()
    //cy.get('#location-set-type').click();
    //cy.wait(3000);
    cy.log("Test case executed Successfully.")

  })
})
})
})



 