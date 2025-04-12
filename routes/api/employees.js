const express = require('express'); // Import the express module
const router = express.Router(); // Create a new router instance
const path = require('path'); // Import the path module

const data = {};
data.employees = require('../../data/employees.json'); // Load employee data from a JSON file

router.route('/')
  .get((req, res) => { // Define a route for the root URL of this router
    res.json(data.employees); // Send the employee data as a JSON response
  })
  .post((req, res) => { // Define a route for POST requests to this router
    res.json({
      "firstName": req.body.firstName,
      "lastName": req.body.lastName
    })
  })
  .put((req, res) => { // Define a route for PUT requests to this router
    res.json({
      "firstName": req.body.firstName,
      "lastName": req.body.lastName
    })
  })
  .delete((req, res) => { // Define a route for DELETE requests to this router
    res.json({ "id": req.body.id })
  });

  router.route('/:id')
    .get((req, res) => { // Define a route for GET requests to this router with an ID parameter
      res.json({"id": req.params.id}); // Send the employee data as a JSON response
    })

module.exports = router; // Export the router instance