const express = require('express'); // Import the express module
const router = express.Router(); // Create a new router instance
const path = require('path'); // Import the path module
const authController = require('../controllers/authController'); // Import the auth controller

router.post('/', authController.handleLogin); // Handle new user registration

module.exports = router; // Export the router instance