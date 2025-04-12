const data = {
  employees: require('../model/employees.json'),
  setEmployees: function (data) { this.employees = data } // Function to set the employee data
};

const getAllEmployees = (req, res) => { // Define a route for the root URL of this router
  res.json(data.employees); // Send the employee data as a JSON response
}

const createNewEmployee = (req, res) => { // Define a route for POST requests to this router
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1, // Generate a new ID for the employee
    firstname: req.body.firstname,
    lastname: req.body.lastname  
  }
  
  if(!newEmployee.firstname || !newEmployee.lastname) { // Check if the first name and last name are provided
    return res.status(400).json({ 'message': 'First and last names are required' }); // Return a 400 error if not
  }

  data.setEmployees([...data.employees, newEmployee])
  res.status(201).json(data.employees); // Send the updated employee data as a JSON response
}

const updateEmployee = (req, res) => { // Define a route for PUT requests to this router
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id)); // Find the employee by ID
  if(!employee) { // Check if the employee exists
    return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` }); // Return a 204 error if not
  }
  if(req.body.firstname) employee.firstname = req.body.firstname; // Update the first name if provided
  if(req.body.lastname) employee.lastname = req.body.lastname; // Update the last name if provided
  const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id)); // Filter out the employee from the array
  const unsortedArray = [...filteredArray, employee]; // Create a new array with the updated employee
  data.setEmployees(unsortedArray.sort((a, b) => a.id - b.id)); // Sort the array by ID and set it as the new employee data
  res.json(data.employees); // Send the updated employee data as a JSON response
}

const deleteEmployee = (req, res) => { // Define a route for DELETE requests to this router
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id)); // Find the employee by ID
  if(!employee) { // Check if the employee exists
    return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` }); // Return a 204 error if not
  }
  const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id)); // Filter out the employee from the array
  data.setEmployees([...filteredArray]); // Set the filtered array as the new employee data
  res.json(data.employees); // Send the updated employee data as a JSON response
}

const getEmployee = (req, res) => { // Define a route for GET requests to this router with an ID parameter
  const employee = data.employees.find(emp => emp.id === parseInt(req.params.id)); // Find the employee by ID
  
  if(!employee) { // Check if the employee exists
    return res.status(204).json({ "message": `No employee matches ID ${req.params.id}.` }); // Return a 204 error if not
  }
  res.json(employee); // Send the updated employee data as a JSON response
}

module.exports = { // Export the route handler functions as an object
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee
} // Export the route handler functions as an object