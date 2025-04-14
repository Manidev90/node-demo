const express = require('express'); // Import the express module
const router = express.Router(); // Create a new router instance
const refreshTokenController = require('../controllers/refreshTokenController'); // Import the refresh controller

router.get('/', refreshTokenController.handleRefreshToken); // Handle new user registration

module.exports = router; // Export the router instance