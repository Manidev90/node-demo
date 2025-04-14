const express = require('express'); // Import the express module
const router = express.Router(); // Create a new router instance
const logoutController = require('../controllers/logoutController'); // Import the refresh controller

router.get('/', logoutController.handleLogout); // Handle new user registration

module.exports = router; // Export the router instance