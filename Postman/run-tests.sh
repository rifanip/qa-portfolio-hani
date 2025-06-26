// Check status code 201
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

// Check if the response have property "id
pm.test("Response has ID", function (){
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
});

// Get the expected title from environment/global variable
let expectedTitle = pm.variables.get("randomTitle")
let jsonData = pm.response.json()
pm.test("Title Match", function(){
    var jsonData = pm.response.json();
    pm.expect(jsonData.title).to.eql(expectedTitle);
});

// Check the content type is JSON
pm.test("Content-Type is application/json", function () {
    pm.response.to.have.header("Content-Type", /application\/json/);
});

