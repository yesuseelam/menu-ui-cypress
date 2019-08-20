/// <reference types="Cypress" />
import Login from '../support/models/emm_loginModel';

describe('Verifying Functionality in Management ', function () {

    beforeEach(() => {
        cy.visit('/management/items')
        Login.appLogin();


        cy.get('#tab1 > .row > .col-8').click({ force: true });
    })
    afterEach(function () {
        cy.contains('signout').click({force:true});
         
          cy.log("Test case executed Successfully and Logged out from the Menu")
          
      })
      
    it('Login to the EMM-Management ', function () {

        cy.log('Successfully loggged into the Management Pge')


    })
    //Create New item

    it('Create New Item ', function () {
        cy.wait(5000)
        cy.get('[data-cy=NewitemAdd]').click({force:true})
        
       
        cy.log('Create New Item Successfully')


    })



    /*it('items Groupings Testing', function () {


        cy.get('a').contains('Item Groupings').click({ force: true });

        cy.contains('1/2 Lemonade 1/2 Diet Lemonade').click({ force: true });


    })

    it('Items   Testing', function () {


        cy.get('a').contains('Items').click({ force: true });
        cy.wait(5000)
        cy.contains('Apples').click({ force: true });



    })


    it('item Types  Testing', function () {



        cy.get('a').contains('Item Types').click({ force: true });

        cy.contains('Beverages').click({ force: true });

    })


    it('Attributes   Testing', function () {


        cy.get('a').contains('Attributes').click({ force: true });

        cy.contains('Abbreviation').click({ force: true });


    })




    describe('Verifying Functionality in Management for Logout', function () {

        it('Logout from the Menu', function () {

            cy.get(':nth-child(1) > #signOut-button').click({ force: true });

            cy.log('Log out from the Management');
            cy.window(close);
        })

    })*/
})




