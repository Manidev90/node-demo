const allowedOrigins = require('../config/allowedOrigins'); // Import the whitelist of allowed origins

const credentials = (req, res, next) => {
  const origin = req.headers.origin; // Get the origin of the request from the headers
  if(allowedOrigins.includes(origin)) { // Check if the origin is in the whitelist
    res.setHeader('Access-Control-Allow-Credentials', true); // Set the Access-Control-Allow-Credentials header to true
  }
  next(); // Call the next middleware function in the stack
}

module.exports = credentials; // Export the credentials middleware for use in the server configuration