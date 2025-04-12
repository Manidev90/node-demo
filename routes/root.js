const express = require('express');
const router = express.Router(); // Create a new router instance
const path = require('path'); // Import the path module

router.get(['/index.html', '/', '/index'], (req, res) => { // Define a route for the root URL
  res.sendFile(path.join(__dirname, '..','views', 'index.html'));
});

module.exports = router; // Export the router instance