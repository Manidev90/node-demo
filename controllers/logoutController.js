const usersDB = {
  users: require('../model/users.json'), // Import the users data from a JSON file
  setUsers: function (data) { this.users = data; }, // Set the users data
}
const fsPromises = require('fs').promises; // Import the file system promises module for file operations
const path = require('path'); // Import the path module for handling file paths

const handleLogout = async (req, res) => {
  // On Client, also delete the accessToken

  const cookies = req.cookies; // Get the cookies from the request
  if (!cookies?.jwt) return res.sendStatus(204); // If no refresh token, send a 204 No Content status

  const refreshToken = cookies.jwt; // Get the refresh token from the cookies
  const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken); // Find the user in the database
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true }); // Clear the cookie if no user found
    return res.sendStatus(204); // Send a 204 No Content status
  }

  // Delete the refresh token in the database
  const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken); // Filter out the user with the refresh token
  const currentUser = { ...foundUser, refreshToken: '' }; // Create a new user object with the refresh token removed
  usersDB.setUsers([...otherUsers, currentUser]); // Update the users database
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'), // Define the path to the users JSON file
    JSON.stringify(usersDB.users) // Write the updated users data to the file
  );

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' }); // Clear the cookie
  res.sendStatus(204); // Send a 204 No Content status
}

module.exports = { handleLogout }; // Export the function for use in other modules