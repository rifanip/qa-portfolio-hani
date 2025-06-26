Feature: Add New Customer

    Background: Pre conditions
        Given user is in the login page
        When user input valid email 'hani@test.com' and password '123456'
        And user click SignIn button
        Then User shall see login success message and redirect to LOS main page

    Scenario: Verify New Customer Page and Mandatory fields
        Given User is on LOS main page
        When user clicks on New Customer
        Then user will direct to the New Customer Page
        When user clicks Save button
        Then Users will see the required fields cannot be empty

    Scenario: Verify Cancel button
        Given User is on LOS main page
        When user clicks on New Customer
        Then user will direct to the New Customer Page
        When user clicks Cancel button
        Then Users will direct to the LOS main page
    
    Scenario: Add New Customer
        Given User is on LOS main page
        When user clicks on New Customer
        When user fill all the mandatory fields
        When user clicks Save button
        Then user will see toast message 'New customer have been added successfully.'
        When user clicks on View button
        Then user will see the customer added successfully
