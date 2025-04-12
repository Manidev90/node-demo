const { logEvents } = require('./logEvents'); // Import the logEvents function from the logEvents module

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, 'errlog.txt'); // Log the error name and message to a file
  console.error(err.stack); // Log the error stack to the console
  res.status(500).sendFile(err.message); // Send a 500 error page
}

module.exports = errorHandler;