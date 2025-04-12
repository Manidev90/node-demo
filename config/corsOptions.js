const whitelist = ['http://localhost:3500']; // Define a whitelist of allowed origins for CORS
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) { // Check if the origin is in the whitelist or if it's a non-browser request
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Deny the request
    }
  },
  optionsSuccessStatus: 200 // Set the status code for successful OPTIONS requests
};

module.exports = corsOptions; // Export the CORS options for use in the server configuration