import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import CustomerElements from "../object_repository/CreateNewCustomerElements";
import 'cypress-real-events/support'
import 'cypress-file-upload'

beforeEach(() => {
  cy.intercept('GET', '**/check-token-validity').as('checkToken');
  cy.intercept('POST', '**/customer-creation/selfie').as('postSelfie');
  cy.intercept('GET', '**/customer-creation/selfie/*').as('getSelfie');
  cy.intercept('POST', '**/customer-creation/identification').as('postIdentify')
  cy.intercept('GET', '**/customer-creation/identification*').as('getIdentify')
  cy.intercept('POST', '**/customer-creation').as('postCustomerCreation')
})

afterEach(() => {
  cy.request({
    method: 'DELETE',
    url: '/api/delete-temp-customer',
    failOnStatusCode: false, // biar tidak fail test kalau API gagal
  });
});

Given ('User is on LOS main page', ()=>{
    CreateNewCustomerElements.LoanMainPage().should('be.visible')
    cy.wait(1000)
})

When ('user clicks on New Customer', ()=>{
    cy.url().should('not.include', '/login')
    CreateNewCustomerElements.AddNewbutton().click()
    cy.wait('@checkToken').its('response.statusCode').should('eq', 200)
    CreateNewCustomerElements.Loader().should('not.be.visible')
})

Then ('user will direct to the New Customer Page', ()=>{
    CreateNewCustomerElements.NewCustomerPage()
})

When ('user clicks Save button', ()=>{
    CreateNewCustomerElements.savebutton().should('be.visible').click()
})

When ('user submit the customer', ()=>{
    CreateNewCustomerElements.savebutton().should('be.visible').click()
    CreateNewCustomerElements.Loader().should('not.be.visible')
    cy.wait('@postCustomerCreation').its('response.statusCode').should('eq', 200)
})

Then ('Users will see the required fields cannot be empty', ()=>{
    CreateNewCustomerElements.mandatorychecking().should('be.visible')
})

Then ('user input customer name {string} and {string} and {string}', (firstname, middlename, lastname)=>{
    const fullName = '${firstname} ${middlename} ${lastname}'
    cy.wrap(fullName).as('customerName')
    CreateNewCustomerElements.firstname().type(firstname)
    CreateNewCustomerElements.Middlename().type(middlename)
    CreateNewCustomerElements.lastname().type(lastname)
})

Then ('user will see toast message {string}', ()=>{
    CreateNewCustomerElements.successtoastmessage().should('be.visible')
})

When ('user clicks Cancel button', ()=>{
    CreateNewCustomerElements.cancelbutton().click()
    CreateNewCustomerElements.Loader().should('not.be.visible')
})

Then ('Users will direct to the main page', ()=>{
    CreateNewCustomerElements.LoanMainPage()
})

When ('user clicks on View button', ()=>{
    CreateNewCustomerElements.viewCustomer().click()
    CreateNewCustomerElements.Loader().should('not.be.visible')
})

Then ('user will see the customer added successfully', function(){
    cy.get('@customerName').then((fullName) => {
    CreateNewCustomerElements.customerVerify().invoke('text').should('contain', fullName)
    })
})

When ('user fill the type of app', ()=>{    
    CreateNewCustomerElements.typeofapp().click()
    cy.xpath("//button[.='Active Accounts']").click()
    CreateNewCustomerElements.customersource().click()
    cy.contains('button.dropdown-item', 'SM (Others)').click()
})

When ('user add identification ID', ()=>{
    CreateNewCustomerElements.ID().click({force: true})
    cy.contains('button.dropdown-item', 'Philhealth').click()
    cy.wait(1000)
    cy.get("[placeholder='Enter Philhealth Number']").scrollIntoView().should('be.visible').type('1234')
    // uploadimage
    cy.get('input[type="file"].inputFile').selectFile('cypress/fixtures/test.png', { force: true })
    CreateNewCustomerElements.Loader().should('not.be.visible')
    cy.wait('@postIdentify').its('response.statusCode').should('eq', 200)
    cy.wait('@getIdentify').its('response.statusCode').should('eq', 200)
})

When ('user fill all the mandatory fields', ()=>{
    CreateNewCustomerElements.branch().should('not.contain', 'Select Branch')
    CreateNewCustomerElements.salesagent().should('not.contain', 'Select Sales Agent')
    CreateNewCustomerElements.portofolio().click()
    cy.contains('button.dropdown-item', 'Two Wheeler').click()
    CreateNewCustomerElements.purposeofpurchase().click()
    cy.contains('button.dropdown-item', 'Business').click()
    CreateNewCustomerElements.interest().click()
    cy.contains('button.dropdown-item', 'Cold').click()
    CreateNewCustomerElements.suffix().click()
    cy.xpath("//button[.='Jr.']").click({ force: true })
    CreateNewCustomerElements.dob().click()
    cy.get('.theme-datepicker-header-year-selector .arrow-icon').eq(0).click();
    cy.xpath("//span[.='2000']").click()
    cy.get('.theme-datepicker-header-month-selector .arrow-icon').eq(0).click()
    cy.xpath("//span[.='Feb']").click()
    cy.get('.react-datepicker__day--023').click()
    // validate age
    CreateNewCustomerElements.dob().invoke('val').then((birthdateStr) => {
    // format DD/MM/YYYY)
    const [day, month, year] = birthdateStr.split('/');
    const dob = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    // Calculate
    let expectedAge = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      expectedAge--;
    }
    // Age Validation
    cy.get("[placeholder='Enter Age']").should('have.value', expectedAge.toString());
    })
    CreateNewCustomerElements.mobilenoOwner().click()
    cy.contains('button.dropdown-item', 'Applicant').click()
    CreateNewCustomerElements.checklist().click()
})

Then ('user upload selfie image', ()=>{
    CreateNewCustomerElements.Image().first().selectFile('cypress/fixtures/example.png', { force: true });
    CreateNewCustomerElements.Loader().should('not.be.visible')
    cy.wait('@postSelfie').its('response.statusCode').should('eq', 200)
    cy.wait('@getSelfie').its('response.statusCode').should('eq', 200)
    cy.wait(2000)
})
When ('User input mobile number less than 10 digits', ()=>{
    CreateNewCustomerElements.mobileno().type('91182222')
    CreateNewCustomerElements.savebutton().click()
    cy.xpath("//span[.='Invalid Number']").should('be.visible')
    CreateNewCustomerElements.mobileno().clear().type('9167836271')
    cy.xpath("//span[.='Invalid Number']").should('not.exist')
})
When ('User input wrong email format', ()=>{
    CreateNewCustomerElements.email().type('email@add')
    cy.xpath("//span[.='This Email is Invalid']").should('be.visible')
    CreateNewCustomerElements.email().type('.com')
    cy.xpath("//span[.='This Email is Invalid']").should('not.exist')
})
When ('User Add social media account', ()=>{
    CreateNewCustomerElements.socmeddropdown().click()
    cy.xpath("//button[.='Twitter']").click()
    CreateNewCustomerElements.socmedlink().type('test social media')
    CreateNewCustomerElements.addsocmed().click()
    CreateNewCustomerElements.deletesocmed().should('be.visible')
})

Then ('user will see toast message Profile has been updated successfully', ()=>{
    cy.contains('div', 'Profile has been updated successfully')
    CreateNewCustomerElements.AddNewbutton().should('be.visible')
})
