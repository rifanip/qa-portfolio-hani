class CustomerElements {

    LoanMainPage() {
        return cy.get('[data-testid="loan-origination-title"]')
    }
    AddNewbutton() {
        return cy.contains('button', 'New Customers')
    }
    NewCustomerPage() {
        return cy.url().should('include', '/new-customer')
    }
    savebutton() {
        return cy.xpath("//button[.='Save']")
    }
    cancelbutton() {
        return cy.xpath("//button[.='Cancel']")
    }
    mandatorychecking() {
        return cy.contains('span', 'Required Field')
    }
    branch() {
        return cy.get('#cust-creation-page-select-branch-dropdown-toggle')
    }
    salesagent() {
        return cy.get('#cust-creation-page-select-sales-agent-dropdown-toggle')
    }
    portofolio() {
        return cy.get('#cust-creation-page-select-portfolio-dropdown-toggle')
    }
    interest() {
        return cy.get('#cust-creation-page-select-interest-level-dropdown-toggle')
    }
    customersource() {
        return cy.get('#cust-creation-page-select-cust-source-dropdown-toggle')
    }
    remarks() {
        return cy.xpath("//textarea[@id='undefined-input']")
    }
    suffix() {
        return cy.get('#cust-creation-page-select-suffix-dropdown-toggle')
    }
    firstname() {
        return cy.get("[placeholder='First Name']")
    }
    Middlename() {
        return cy.get("[placeholder='Middle Name']")
    }
    lastname() {
        return cy.get("[placeholder='Last Name']")
    }
    alias() {
        return cy.get("[placeholder='Alias (Optional)']")
    }
    mobileno() {
        return cy.get("[placeholder='Mobile Number']")
    }
    mobilenoOwner() {
        return cy.get("#cust-creation-page-select-mobileNoOwner-dropdown-toggle")
    }
    dob() {
        return cy.get("[placeholder='Search By Date Of Birth']")
    }
    alternatePhone() {
        return cy.get("[placeholder='Alternate Mobile Number']")
    }
    email() {
        return cy.get("[placeholder='Email Address (Optional)']")
    }
    socmeddropdown() {
        return cy.get("#cust-creation-page-select-social-media-dropdown-toggle")
    }
    socmedlink() {
        return cy.get("[placeholder='Social Media Link']")
    }
    addsocmed() {
        return cy.get("[name='socialMedia'] > div:nth-of-type(3) > .btn")
    }
    deletesocmed() {
        return cy.get("[name='socialMedia'] > .MuiGrid-root > button:nth-of-type(2)")
    }
    checklist() {
        return cy.get("#cust-creation-page-cust-consent-check-box")
    }
    successtoastmessage() {
        return cy.contains('span', 'New customer have been added successfully.')
    }
    viewCustomer() {
        return cy.xpath("//span[.='VIEW']")
    }
    customerVerify() {
        return cy.get(".sc-fifgRP")
    }
    typeofapp(){
        return cy.get('#cust-creation-page-select-type-of-application-dropdown-toggle')
    }
    purposeofpurchase(){
        return cy.get('#cust-creation-page-select-purpose-of-purchase-dropdown-toggle')
    }
    Image(){
        return cy.get('.inputFile')
    }
    ID(){
        return cy.get("#cust-creation-page-select-id-dropdown-toggle")
    }
    Loader(){
        return cy.get('iframe#launcher', { timeout: 10000 })
    }

}
export default new CustomerElements()
