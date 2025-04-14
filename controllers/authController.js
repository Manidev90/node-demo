const usersDB = {
  users: require('../model/users.json'), // Import the users data from a JSON file
  setUsers: function (data) { this.users = data; }, // Set the users data
}
const bcrypt = require('bcrypt'); // Import the bcrypt module for password hashing
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken module for creating JWTs
require('dotenv').config(); // Import the dotenv module for environment variables
const fsPromises = require('fs').promises; // Import the fs module for file system operations
const path = require('path'); // Import the path module for handling file paths

const handleLogin = async (req, res) => {
  const { user, password } = req.body; // Destructure the user and password from the request body
  if (!user || !password) return res.status(400).json({ 'message': 'Username and password are required.' }); // Check if user and password are provided
  const foundUser = usersDB.users.find(person => person.username === user); // Find the user in the database
  if (!foundUser) return res.sendStatus(401); // If not found, send a 401 Unauthorized status
  //evaluate password
  const match = await bcrypt.compare(password, foundUser.password); // Compare the provided password with the hashed password in the database
  if (match) {
    //create JWTs
    const accessToken = jwt.sign(
      { "username": foundUser.username }, // Payload containing the username
      process.env.ACCESS_TOKEN_SECRET, // Secret key for signing the token
      { expiresIn: '30s' } // Token expiration time
    );
    const refreshToken = jwt.sign(
      { "username": foundUser.username }, // Payload containing the username
      process.env.REFRESH_TOKEN_SECRET, // Secret key for signing the token
      { expiresIn: '1d' } // Token expiration time
    );
    //store refresh token in the database
    const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username); // Filter out the current user from the users list
    const currentUser = { ...foundUser, refreshToken }; // Create a new user object with the refresh token
    usersDB.setUsers([...otherUsers, currentUser]); // Update the users database with the new user object
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'users.json'), // Path to the users JSON file
      JSON.stringify(usersDB.users) // Write the updated users data to the file
    );
    //send JWTs to the user
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); // Set the refresh token as a cookie in the response
    res.json({ accessToken }); // Send the access token in the response
    //res.status(200).json({ 'success': `User ${user} is logged in!` }); // If it matches, send a 200 OK status with a success message
  } else {
    res.sendStatus(401); // If it doesn't match, send a 401 Unauthorized status
  }
}

module.exports = { handleLogin }; // Export the function for use in other modules