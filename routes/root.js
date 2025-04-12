const express = require('express');
const router = express.Router(); // Create a new router instance
const path = require('path'); // Import the path module

router.get(['/index.html', '/', '/index'], (req, res) => { // Define a route for the root URL
  res.sendFile(path.join(__dirname, '..','views', 'index.html'));
});

router.get('/new-page.html', (req, res) => { // Define a route for the root URL
  res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

router.get('/old-page.html', (req, res) => { // Define a route for the root URL
  res.redirect(301, '/new-page.html'); // Redirect to the new page with a 301 status code
});

router.get('/www-page.html', (req, res) => { // Define a route for the root URL
  res.redirect(301, '/'); // Redirect to the root with a 301 status code
});

module.exports = router; // Export the router instance