import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import CreateNewCustomerElements from "../object_repository/CreateNewCustomerElements";
import 'cypress-real-events/support'
import 'cypress-file-upload'
import SearchCustomerElements from "../object_repository/SearchCustomerElements";

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

When ('user fill all the mandatory fields', ()=>{
    CreateNewCustomerElements.branch().should('not.contain', 'Select Branch')
    CreateNewCustomerElements.portofolio().click()
    cy.contains('button.dropdown-item', 'Two Wheeler').click()
    CreateNewCustomerElements.purposeofpurchase().click()
    cy.contains('button.dropdown-item', 'Business').click()
    CreateNewCustomerElements.interest().click()
    cy.contains('button.dropdown-item', 'Cold').click()
    CreateNewCustomerElements.customersource().click()
    cy.contains('button.dropdown-item', 'PSR').click()
    CreateNewCustomerElements.suffix().click()
    cy.contains('button.dropdown-item', 'Jr.').click({force: true});
    CreateNewCustomerElements.dob().type('14/04/1999')
    CreateNewCustomerElements.mobileno().type('93312121')
    CreateNewCustomerElements.savebutton().click()
    cy.xpath("//span[.='Invalid Number']").should('be.visible')
    CreateNewCustomerElements.mobileno().type('91')
    CreateNewCustomerElements.mobileNoOwner().click()
    cy.contains('button.dropdown-item', 'Parents').click()
    CreateNewCustomerElements.checklist().click()
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

// wheeltek & newnemar
When ('user fill all the mandatory fields for wheeltek and newnemar', ()=>{
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
    // CreateNewCustomerElements.alias().click()
    CreateNewCustomerElements.mobileno().type('9118228322')
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
When ('user type wrong mobile number and see the Validation', ()=>{
    CreateNewCustomerElements.mobileno().type('91182222')
    CreateNewCustomerElements.savebutton().click()
    cy.xpath("//span[.='Invalid Number']").should('be.visible')
})
Then ('user type valid mobile number and validation is gone', ()=>{
    CreateNewCustomerElements.mobileno().clear().type('9167836271')
    cy.xpath("//span[.='Invalid Number']").should('not.exist')
})
When ('user type wrong email address and see the Validation', ()=>{
    CreateNewCustomerElements.email().type('email@add')
    cy.xpath("//span[.='This Email is Invalid']").should('be.visible')
})
Then ('user type valid email address and validation is gone', ()=>{
    CreateNewCustomerElements.email().type('.com')
    cy.xpath("//span[.='This Email is Invalid']").should('not.exist')
})
When ('user click on add social media button', ()=>{
    CreateNewCustomerElements.socmeddropdown().click()
    cy.xpath("//button[.='Twitter']").click()
    CreateNewCustomerElements.socmedlink().type('test social media')
    CreateNewCustomerElements.addsocmed().click()
})
Then ('user should see the placeholder for the second social media', ()=>{
    CreateNewCustomerElements.deletesocmed().should('be.visible')
})

When ('User select date of birth and validate today cannot be selected', ()=>{
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const formattedDate = `${dd}/${mm}/${yyyy}`;
  
    // open datepicker
    CreateNewCustomerElements.dob().click();
  
    // ensure value is not today
    CreateNewCustomerElements.dob().should('not.have.value', formattedDate);
  
    // find todays element and ensure is disabled
    const dayNumber = String(today.getDate()).padStart(3, '0');
    cy.get(`.react-datepicker__day--${dayNumber}`)
      .should('have.class', 'react-datepicker__day--disabled')
      .and('have.attr', 'aria-disabled', 'true');
})

Then ('Age automatically calculated', ()=>{
    CreateNewCustomerElements.dob().type('17/06/1996')
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
    CreateNewCustomerElements.alias().click()
})

When ('user clicks on month search and search the customer', ()=>{
    const today = new Date();
    const month = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear();
    const monthYear = `${month} ${year}`;
    SearchCustomerElements.years().type(monthYear)
    SearchCustomerElements.searchId().click()
    SearchCustomerElements.search().click()
    cy.get('.loader', { timeout: 10000 }).should('not.exist')
})

When ('user clicks on the existing customer', ()=>{
    SearchCustomerElements.customerList().click()
    cy.get('.loader', { timeout: 10000 }).should('not.exist')
    CreateNewCustomerElements.savebutton().should('be.visible')
})

When ('user update the last name and save', ()=>{
    CreateNewCustomerElements.lastname().type(' Update')
    CreateNewCustomerElements.savebutton().click()
})

Then ('user will see toast message Profile has been updated successfully', ()=>{
    cy.contains('div', 'Profile has been updated successfully')
    CreateNewCustomerElements.AddNewbutton().should('be.visible')
})
