const usersDB = {
  users: require('../model/users.json'), // Import the users data from a JSON file
  setUsers: function (data) { this.users = data; }, // Set the users data
}
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken module for creating JWTs
require('dotenv').config(); // Import the dotenv module for environment variables

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies; // Get the cookies from the request
  if(!cookies?.jwt) return res.sendStatus(401); // If no refresh token, send a 401 Unauthorized status
  const refreshToken = cookies.jwt; // Get the refresh token from the cookies
  const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken); // Find the user in the database
  if (!foundUser) return res.sendStatus(403); // If no user found with the refresh token, send a 403 Forbidden status
  // Evaluate the refresh token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.username !== decoded.username) return res.sendStatus(403); // If verification fails or username doesn't match, send a 403 Forbidden status
      const accessToken = jwt.sign(
        { "username": decoded.username }, // Payload containing the username
        process.env.ACCESS_TOKEN_SECRET, // Secret key for signing the token
        { expiresIn: '30s' } // Token expiration time
      );
      res.json({ accessToken }); // Send the access token in the response
    }
  );
}

module.exports = { handleRefreshToken }; // Export the function for use in other modules