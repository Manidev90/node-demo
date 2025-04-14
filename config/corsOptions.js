const allowedOrigins = require('./allowedOrigins'); // Import the whitelist of allowed origins

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // Check if the origin is in the whitelist or if it's a non-browser request
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Deny the request
    }
  },
  optionsSuccessStatus: 200 // Set the status code for successful OPTIONS requests
};

module.exports = corsOptions; // Export the CORS options for use in the server configuration