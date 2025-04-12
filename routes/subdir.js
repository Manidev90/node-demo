const express = require('express');
const router = express.Router(); // Create a new router instance
const path = require('path'); // Import the path module

router.get(['/index', '/'], (req, res) => { // Define a route for the new page
  res.sendFile(path.join(__dirname, '..', 'views', 'subdir','index.html')); // Send the new page HTML file
});

router.get('/test', (req, res) => { // Define a route for the new page
  res.sendFile(path.join(__dirname, '..', 'views', 'subdir','test.html')); // Send the new page HTML file
});

module.exports = router; // Export the router instance