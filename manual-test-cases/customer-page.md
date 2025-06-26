# Manual Test Cases: Customer Page

### TC-001: Verify the Add New Customer button
- **Steps**:
  1. Login as sales
  2. Click Add New Customer in the homepage
- **Expected**: Redirect to Add New Customer page

---

### TC-002: Create New Customer: Success
- **Preconditions**: User login as sales
- **Steps**:
  1. Click Add New Customer in the homepage
  2. Input the mandatory information
  3. Click Save button
- **Expected**: Successfully creating new customer, toast message appear and Redirect to the homepage

---

### TC-003: Validate Required Field Validation
- **Preconditions**: User login as sales
- **Steps**:
  1. Click Add New Customer in the homepage
  2. Leave all fields blank
  3. Click Save button
- **Expected**: Validation messages appear: "Please Enter the Required field(s)" and remain on the new customer page

---

### TC-004: Unsuccessful customer creation
- **Preconditions**: User login as sales
- **Steps**:
  1. Click Add New Customer in the homepage
  2. Enter an ID number that is already used by an existing user
  3. Enter all fields
  4. Click Save button
- **Expected**: Validation messages appear: “Unsuccessful customer creation” and remain on the new customer page


