import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import loginElements from "../object_repository/loginElements";
import CustomerElements from "../object_repository/CustomerElements";

  beforeEach(() => {
    cy.intercept('GET', '**/check-token-validity').as('checkToken')
    cy.intercept ('GET', '**/notifications').as('getNotif')
    cy.intercept ('GET', '**/loans-summary*').as('getLoanSummary')
  });

  Given ('user is in the login page', () => {
    loginElements.visitLoginPage()
  })
  
  When('user verify the page', () => {
     loginElements.LoginPage()
  })
  
  Then('user will see email field, password field, Hide show Eye Icon, Login button and Forget password link', () => {
    loginElements.emailField().should('be.visible')
    loginElements.passwordField().should('be.visible')
    loginElements.signInbutton().should('be.visible')
    loginElements.forgotpassbutton().should('be.visible')
  })

  When ('the user enters email {string} and password {string}', (email, password)=>{
    loginElements.emailField().type(email)
    loginElements.passwordField().type(password)
    loginElements.signInbutton().click()
  })

  Then ('the system should {string} the login attempt', (result)=>{
    if (result === 'accept') {
      loginElements.landingpage();
    } else if (result === 'reject') {
      loginElements.toastmessage().should('contain.text', "The username or password you entered is incorrect. Please try again or reset your password using the 'Forgot Password' option.")
    }
  })
  
  When('user input invalid email {string} and password {string}', (email1,password1) => {
      loginElements.emailField().type(email1)
      loginElements.passwordField().type(password1)
  })
  
  Then('User shall see login success message and redirect to LOS main page', () => {
      loginElements.toastmessage().should('contain.text', 'You have logged in successfully')
      loginElements.homepage().should('be.visible')
      CustomerElements.Loader().should('not.be.visible')
  })
  
  Then('User shall see error message "The email or password is incorrect"', () => {
    loginElements.toastmessage().should('contain.text', "The username or password you entered is incorrect. Please try again or reset your password using the 'Forgot Password' option.");
  })
  
  When('user click SignIn button', () => {
    loginElements.signInbutton().click()
  })

  Then ('User click on Privacy Policy', ()=>{
    loginElements.privacypolicy().click()
    loginElements.newtab()
  })
  
  Then ('User click on Terms of use', ()=>{
    loginElements.termsofuse().click()
    loginElements.newtab()
  })
  
  Then ('User click on Cookie Policy', ()=>{
    loginElements.cookiespolicy().click()
    loginElements.newtab()
  })

  When ('user input valid email {string} and password {string}', (mail,pass)=>{
    loginElements.emailField().type(mail)
    loginElements.passwordField().type(pass)
  })
  
  When('user click Login button', () => {
    loginElements.signInbutton().click({ force: true })
  })

  When ('user clicks on the LOS module', ()=>{
    loginElements.los().parents('div').first().click({force:true})
    CustomerElements.Loader().should('not.be.visible')
    cy.wait('@checkToken').its('response.statusCode').should('eq', 200)
    cy.wait('@getNotif').its('response.statusCode').should('eq', 200)
    cy.wait('@getLoanSummary').its('response.statusCode').should('eq', 200)
  })
