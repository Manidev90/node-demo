const express = require('express'); // Import the express module
const router = express.Router(); // Create a new router instance
const employeeController = require('../../controllers/employeesController'); // Import the employee controller

 // Load employee data from a JSON file

router.route('/')
  .get(employeeController.getAllEmployees)
  .post(employeeController.createNewEmployee)
  .put(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

  router.route('/:id')
    .get(employeeController.getEmployee)

module.exports = router; // Export the router instance