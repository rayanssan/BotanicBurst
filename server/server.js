const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3100;
const baseDirectory = path.join(__dirname, '..');

const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (url === '/' && method === 'GET') {
    // Serve index.html for the root URL
    serveFile(res, '/homepage.html');
  } 
  else if (url.endsWith('.html')) {
    serveFile(res, url);
  } 
  else if (url.endsWith('.css')) {
    serveFile(res, url);
  } 
  else if (url.endsWith('.js')) {
    serveFile(res, url);
  } 
  else if (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.gif')) {
    serveFile(res, url);
  } 
  else if (url.endsWith('.woff') || url.endsWith('.woff2') || url.endsWith('.ttf') || url.endsWith('.otf')) {
    serveFile(res, url);
  } 
  else if (url.endsWith('.wav')) {
    serveFile(res, url);
  } 
  else {
    res.statusCode = 404;
    res.end('404 - Not Found');
  }
});

/**
 * Serves a file to the response object.
 *
 * @param {Object} res - The response object.
 * @param {String} filename - The filename or path of the file to be served.
 */
function serveFile(res, filename) {
  const filePath = path.join(baseDirectory, filename);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('Internal Server Error');
      return;
    }

    res.statusCode = 200;
    res.end(data);
  });
}

server.listen(port, () => {
  console.log(`Server running at ${port}`);
});
