class loginElements {

  visitLoginPage() {
    return cy.visit('https://login.com/')
  }

  LoginPage() {
    return cy.url().should('include', '/login')
  }

  emailField() {
    return cy.get('#field-username')
  }

  passwordField() {
    return cy.get('#field-password')
  }

  signInbutton() {
    return cy.contains('button', 'Log In')
  }

  forgotpassbutton() {
    return cy.contains('button', 'Forgot Password')
  }

  toastmessage() {
    return cy.get('.theme-snackbar')
  }

  los() {
    return cy.get('div._landingPageContent_xe2gu_76').contains('Loan Origination');
  }

  landingpage() {
    return cy.url().should('eq', 'https://loans-page.com/')
  }

  homepage() {
    return cy.get("[data-testid='nav-menu-loans-sidebar']")
  }

  privacypolicy() {
    return cy.xpath("//a[.='Privacy Policy']")
  }

  termsofuse() {
    return cy.xpath("//a[.='Terms of use']")
  }

  cookiespolicy() {
    return cy.xpath("//a[.='Cookie Policy']")
  }

  newtab(){
    cy.window().then((win) => {
        win.focus() // Fokus ke tab baru
      })
}

}

export default new loginElements()
