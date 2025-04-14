const jwt = require('jsonwebtoken'); // Import the jsonwebtoken module for creating JWTs
require('dotenv').config(); // Import the dotenv module for environment variables

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization; // Get the authorization header from the request
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401); // If not present, send a 401 Unauthorized status
  const token = authHeader.split(' ')[1]; // Extract the token from the authorization header
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => { // Verify the token using the secret key
    if (err) return res.sendStatus(403); // If verification fails, send a 403 Forbidden status
    req.user = decoded.UserInfo.username; // Store the decoded username in the request object
    req.roles = decoded.UserInfo.roles;
    next(); // Call the next middleware function
  });
  
}

module.exports = verifyJWT; // Export the verifyJWT function for use in other modules
// This code defines a middleware function called verifyJWT that verifies the JSON Web Token (JWT) provided in the request headers. If the token is valid, it extracts the username from the token and stores it in the request object for use in subsequent middleware or route handlers. If the token is missing or invalid, it sends an appropriate HTTP status response.