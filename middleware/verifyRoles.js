const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if(!req?.roles) return res.sendStatus(401); // If no roles found, send a 401 Unauthorized status
    const rolesArray = [...allowedRoles]; // Convert the allowed roles to an array
    const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true); // Check if any of the user's roles are in the allowed roles array
    if(!result) return res.sendStatus(401); // If no match found, send a 401 Unauthorized status
    next(); // If match found, call the next middleware function
  }
}

module.exports = verifyRoles;