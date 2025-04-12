const http = require('http'); // Import the http module to create a server
const fs = require('fs'); // Import the fs module to work with the file system
const path = require('path'); // Import the path module to work with file and directory paths
const fsPromises = fs.promises; // Use the promises API of the fs module for async file operations

const logEvents = require('./middleware/logEvents');   
const EventEmitter = require('events'); // Import the EventEmitter class from the 'events' module
class MyEmitter extends EventEmitter {};
// Create an instance of the MyEmitter class
const myEmitter = new MyEmitter(); 

myEmitter.on('log', (msg, filename) => logEvents(msg, filename)); // Listen for the 'log' event and call logEvents
//myEmitter.emit('log', 'Log event emitted!'); // Emit the 'log' event with a message

const PORT = process.env.PORT || 3500; // Set the port to listen on, defaulting to 3500 if not specified in the environment variables

const serveFile = async (filePath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath, 
      !contentType.includes('image') ? 'utf-8' : '' // Read the file as utf-8 if it's not an image
    );
    const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData; // Parse JSON data if the content type is application/json
    response.writeHead(200, {'Content-Type': contentType}); // Set the response status code to 200 (OK) and the content type
    response.end(
      contentType === 'application/json' ? JSON.stringify(data) : data, // Send the data as a response
    ); // End the response with the file data
  } catch (err) {
    console.error(err); // Log any errors to the console
    myEmitter.emit('log', `${err.name}:${err.message} `, 'errlog.txt');
    response.statusCode = 500; // Set the response status code to 500 (Internal Server Error)
    response.end(); // End the response
  }
}

const server = http.createServer((req, res) => {
  console.log(req.url, req.method); // Log the request URL and method to the console
  myEmitter.emit('log', `${req.url}\t${req.method} `, 'reqlog.txt'); // Emit a log event with the request method and URL
  const extension = path.extname(req.url); // Get the file extension from the request URL
  let contentType; // Initialize a variable to hold the content type

  switch(extension){
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.jpg':
      contentType = 'image/jpeg';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.txt':
      contentType = 'text/plain';
      break;
    default:
      contentType = 'text/html';
      break; 
  }

  // Set the content type in the response header
  res.setHeader('Content-Type', contentType);
  let filepath = 
    contentType === 'text/html' && req.url === '/' ? path.join(__dirname, 'views', 'index.html') : 
    contentType === 'text/html' && req.url.slice(-1) === '/' ? path.join(__dirname, 'views', req.url, 'index.html') : 
    contentType === 'text/html' ? path.join(__dirname, 'views', req.url) :
    path.join(__dirname, req.url); // Determine the file path based on the request URL and content type

  if(!extension && req.url.slice(-1) !== '/'){
    filepath += '.html'; // Append .html if no extension is present and the URL does not end with '/'
  }
   
  const fileExists = fs.existsSync(filepath); // Check if the file exists

  if(fileExists){
    serveFile(filepath, contentType, res); // Serve the file if it exists
  } else {
    switch(path.parse(filepath).base){
      case 'old-page.html':
        res.writeHead(301, {'Location': '/new-page.html'}); // Redirect to new-page.html with a 301 status code
        res.end();
        break;
      case 'www-page.html':
        res.writeHead(301, {'Location': '/'}); // Redirect to the root with a 301 status code
        res.end();
        break;
      default:
        serveFile(path.join(__dirname,'views', '404.html'), 'text/html', res);
    }
  }
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start the server and log the port it's running on