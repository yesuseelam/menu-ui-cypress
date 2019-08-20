export default class LoginModel {
  static get userNameInp() {
    return cy.get('#okta-signin-username');
  }

  static get passWordInp() {
    return cy.get('#okta-signin-password');
  }

  static get submitBtn() {
    return cy.get('#okta-signin-submit').click({ force: true });
  }

  static visit() {
    cy
      .visit('/', {
        onBeforeLoad: (win) => {
          win.fetch = null;
        },
      });
  }

  static appLogin()//Username,Password)

  {

    this.userNameInp.type(Cypress.env('username'))//.should('have.value', 'yesu.seelam');
    this.passWordInp.type(Cypress.env('password'))//.should('have.value','Unlockmesystem1');
    this.submitBtn;//.click({force:true});

  }


}
