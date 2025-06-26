Feature: Add New Customer for Wheeltek

    Background: Pre conditions
        Given user is in the login page
        When user input valid email 'hani@test.co' and password '123456'
        And user click Login button
        And user clicks on the LOS module
        Then User shall see login success message and redirect to LOS main page

    Scenario: Verify Cancel button
       Given User is on LOS main page
       When user clicks on New Customer
       Then user will direct to the New Customer Page
       When user clicks Cancel button
       Then Users will direct to the main page
    
    Scenario: Add New Customer
        Given User is on LOS main page
        When user clicks on New Customer
        When user clicks Save button
        Then Users will see the required fields cannot be empty
        When user fill the type of app
        And user input customer name 'Hani' and 'test' and 'Integration'
        When user fill all the mandatory fields
        And User input mobile number less than 10 digits
        And User input wrong email format
        And User Add social media account
        And user upload selfie image
        And user add identification ID
        When user submit the customer
        Then user will see toast message 'New customer have been added successfully.'
        When user clicks on View button
        Then user will see the customer added successfully
