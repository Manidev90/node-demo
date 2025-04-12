const express = require('express');
const router = express.Router(); // Create a new router instance
const registerController = require('../controllers/registerController'); // Import the register controller

router.post('/', registerController.handlenewUser); // Route for handling new user registration

module.exports = router; // Export the router instance