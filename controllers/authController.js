const usersDB = {
  users: require('../model/users.json'), // Import the users data from a JSON file
  setUsers: function (data) { this.users = data; }, // Set the users data
}
const bcrypt = require('bcrypt'); // Import the bcrypt module for password hashing

const handleLogin = async (req, res) => {
  const { user, password } = req.body; // Destructure the user and password from the request body
  if (!user || !password) return res.status(400).json({ 'message': 'Username and password are required.' }); // Check if user and password are provided
  const foundUser = usersDB.users.find(person => person.username === user); // Find the user in the database
  if (!foundUser) return res.sendStatus(401); // If not found, send a 401 Unauthorized status
  //evaluate password
  const match = await bcrypt.compare(password, foundUser.password); // Compare the provided password with the hashed password in the database
  if (match) {
    res.status(200).json({ 'success': `User ${user} is logged in!` }); // If it matches, send a 200 OK status with a success message
  } else {
    res.sendStatus(401); // If it doesn't match, send a 401 Unauthorized status
  }
}

module.exports = { handleLogin }; // Export the function for use in other modules