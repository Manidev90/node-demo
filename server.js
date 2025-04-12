const express = require('express');
const app = express(); // Create an instance of the Express application
const cors = require('cors'); // Import the CORS middleware
const path = require('path');
const PORT = process.env.PORT || 3500; // Set the port to listen on, defaulting to 3500 if not specified in the environment variables
const { logger } = require('./middleware/logEvents'); // Import the logEvents middleware
const errorHandler = require('./middleware/errorHandler'); // Import the errorHandler middleware

// custom middleware logger
app.use(logger);

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

app.use(cors(corsOptions)); // Enable CORS for all routes
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded data
app.use(express.json()); // Middleware to parse JSON data

// Serve static files from the 'public' directory
app.use('/',express.static(path.join(__dirname, '/public'))); 
app.use('/subdir',express.static(path.join(__dirname, '/public'))); 

//routes
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir')); // Serve static files from the 'views/subdir' directory
app.use('/employees', require('./routes/api/employees')); // Serve static files from the 'views/subdir' directory

app.use((req, res) => {
  if(req.accepts('html')) { // Check if the request accepts HTML
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html')); // Send a 404 HTML page
  }
  else if(req.accepts('json')) { // Check if the request accepts JSON
    res.status(404).json({ "message": "404 Not Found" }); // Send a 404 JSON response
  }
  else { // If neither HTML nor JSON is accepted
    res.status(404).type('txt').send('404 Not Found'); // Send a 404 plain text response
  }
});

app.use(errorHandler); // Use the error handler middleware

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start the server and log the port number to the console