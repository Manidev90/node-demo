const usersDB = {
  users: require('../model/users.json'), // Import the users data from a JSON file
  setUsers: function (data) { this.users = data; }, // Set the users data
}
const fsPromises = require('fs').promises; // Import the file system promises module
const path = require('path'); // Import the path module
const bcrypt = require('bcrypt'); // Import the bcrypt module for password hashing

const handlenewUser = async (req, res) => {
  const { user, password } = req.body; // Destructure the user and password from the request body
  if (!user || !password) return res.status(400).json({ 'message': 'Username and password are required.' }); // Check if user and password are provided
  //check for duplicate usernames in the database
  const duplicate = usersDB.users.find(person => person.username === user); // Check if the username already exists
  if (duplicate) return res.sendStatus(409); // If it does, send a 409 Conflict status
  try{
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10); // Hash the password with a salt rounds of 10
    const newUser = { "username": user, "password": hashedPwd }; // Create a new user object with the hashed password
    usersDB.setUsers([...usersDB.users, newUser]); // Add the new user to the users array
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users)); // Write the updated users array to the JSON file
    res.status(201).json({ 'success': `New user ${user} created!` }); // Send a 201 Created status with a success message
  } catch(err){
    res.status(500).json({ 'message': err.message }); // If an error occurs, send a 500 Internal Server Error status with the error message
  }
}

const handleLogout = (req, res) => {
  // On successful response, the client would delete the access and refresh tokens
  res.status(204).json({ 'message': 'User logged out' }); // Send a 204 No Content status with a message
}

module.exports = { handlenewUser, handleLogout }; // Export the functions for use in other modules