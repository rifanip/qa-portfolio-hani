import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import CustomerElements from "../object_repository/CustomerElements";
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
    CustomerElements.LoanMainPage().should('be.visible')
    cy.wait(1000)
})

When ('user clicks on New Customer', ()=>{
    cy.url().should('not.include', '/login')
    CustomerElements.AddNewbutton().click()
    cy.wait('@checkToken').its('response.statusCode').should('eq', 200)
    CustomerElements.Loader().should('not.be.visible')
})

Then ('user will direct to the New Customer Page', ()=>{
    CustomerElements.NewCustomerPage()
})

When ('user clicks Save button', ()=>{
    CustomerElements.savebutton().should('be.visible').click()
})

When ('user submit the customer', ()=>{
    CustomerElements.savebutton().should('be.visible').click()
    CustomerElements.Loader().should('not.be.visible')
    cy.wait('@postCustomerCreation').its('response.statusCode').should('eq', 200)
})

Then ('Users will see the required fields cannot be empty', ()=>{
    CustomerElements.mandatorychecking().should('be.visible')
})

Then ('user input customer name {string} and {string} and {string}', (firstname, middlename, lastname)=>{
    const fullName = '${firstname} ${middlename} ${lastname}'
    cy.wrap(fullName).as('customerName')
    CustomerElements.firstname().type(firstname)
    CustomerElements.Middlename().type(middlename)
    CustomerElements.lastname().type(lastname)
})

Then ('user will see toast message {string}', ()=>{
    CustomerElements.successtoastmessage().should('be.visible')
})

When ('user clicks Cancel button', ()=>{
    CustomerElements.cancelbutton().click()
    CustomerElements.Loader().should('not.be.visible')
})

Then ('Users will direct to the main page', ()=>{
    CustomerElements.LoanMainPage()
})

When ('user clicks on View button', ()=>{
    CustomerElements.viewCustomer().click()
    CustomerElements.Loader().should('not.be.visible')
})

Then ('user will see the customer added successfully', function(){
    cy.get('@customerName').then((fullName) => {
    CustomerElements.customerVerify().invoke('text').should('contain', fullName)
    })
})

When ('user fill the type of app', ()=>{    
    CustomerElements.typeofapp().click()
    cy.xpath("//button[.='Active Accounts']").click()
    CustomerElements.customersource().click()
    cy.contains('button.dropdown-item', 'SM (Others)').click()
})

When ('user add identification ID', ()=>{
    CustomerElements.ID().click({force: true})
    cy.contains('button.dropdown-item', 'Philhealth').click()
    cy.wait(1000)
    cy.get("[placeholder='Enter Philhealth Number']").scrollIntoView().should('be.visible').type('1234')
    // uploadimage
    cy.get('input[type="file"].inputFile').selectFile('cypress/fixtures/test.png', { force: true })
    CustomerElements.Loader().should('not.be.visible')
    cy.wait('@postIdentify').its('response.statusCode').should('eq', 200)
    cy.wait('@getIdentify').its('response.statusCode').should('eq', 200)
})

When ('user fill all the mandatory fields', ()=>{
    CustomerElements.branch().should('not.contain', 'Select Branch')
    CustomerElements.salesagent().should('not.contain', 'Select Sales Agent')
    CustomerElements.portofolio().click()
    cy.contains('button.dropdown-item', 'Two Wheeler').click()
    CustomerElements.purposeofpurchase().click()
    cy.contains('button.dropdown-item', 'Business').click()
    CustomerElements.interest().click()
    cy.contains('button.dropdown-item', 'Cold').click()
    CustomerElements.suffix().click()
    cy.xpath("//button[.='Jr.']").click({ force: true })
    CustomerElements.dob().click()
    cy.get('.theme-datepicker-header-year-selector .arrow-icon').eq(0).click();
    cy.xpath("//span[.='2000']").click()
    cy.get('.theme-datepicker-header-month-selector .arrow-icon').eq(0).click()
    cy.xpath("//span[.='Feb']").click()
    cy.get('.react-datepicker__day--023').click()
    // validate age
    CustomerElements.dob().invoke('val').then((birthdateStr) => {
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
    CustomerElements.mobilenoOwner().click()
    cy.contains('button.dropdown-item', 'Applicant').click()
    CustomerElements.checklist().click()
})

Then ('user upload selfie image', ()=>{
    CustomerElements.Image().first().selectFile('cypress/fixtures/example.png', { force: true });
    CustomerElements.Loader().should('not.be.visible')
    cy.wait('@postSelfie').its('response.statusCode').should('eq', 200)
    cy.wait('@getSelfie').its('response.statusCode').should('eq', 200)
    cy.wait(2000)
})
When ('User input mobile number less than 10 digits', ()=>{
    CustomerElements.mobileno().type('91182222')
    CustomerElements.savebutton().click()
    cy.xpath("//span[.='Invalid Number']").should('be.visible')
    CustomerElements.mobileno().clear().type('9167836271')
    cy.xpath("//span[.='Invalid Number']").should('not.exist')
})
When ('User input wrong email format', ()=>{
    CustomerElements.email().type('email@add')
    cy.xpath("//span[.='This Email is Invalid']").should('be.visible')
    CustomerElements.email().type('.com')
    cy.xpath("//span[.='This Email is Invalid']").should('not.exist')
})
When ('User Add social media account', ()=>{
    CustomerElements.socmeddropdown().click()
    cy.xpath("//button[.='Twitter']").click()
    CustomerElements.socmedlink().type('test social media')
    CustomerElements.addsocmed().click()
    CustomerElements.deletesocmed().should('be.visible')
})

Then ('user will see toast message Profile has been updated successfully', ()=>{
    cy.contains('div', 'Profile has been updated successfully')
    CustomerElements.AddNewbutton().should('be.visible')
})
