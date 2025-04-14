const express = require("express"); // Import the express module
const router = express.Router(); // Create a new router instance
const employeeController = require("../../controllers/employeesController"); // Import the employee controller
//const verifyJWT = require('../../middleware/verifyJWT'); // Import the JWT verification middleware
const ROLES_LIST = require("../../config/roles_list"); // Import the roles list
const verifyRoles = require("../../middleware/verifyRoles"); // Import the role verification middleware

router
  .route("/")
  .get(employeeController.getAllEmployees)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeeController.createNewEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeeController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.Admin), employeeController.deleteEmployee);

router.route("/:id").get(employeeController.getEmployee);

module.exports = router; // Export the router instance
