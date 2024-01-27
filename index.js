// index.js
const http = require('http');
const fs = require('fs');
const { shelterRoutes } = require('./shelterRoutes');
const { parse } = require('url');
const { EventEmitter } = require('events');
const shelterModule = require('./shelter');

global.registerShelterEvent = shelterModule.registerShelterEvent;
global.getAllShelters = shelterModule.getAllShelters;
global.addShelter = shelterModule.addShelter;
global.updateShelter = shelterModule.updateShelter;
global.deleteShelter = shelterModule.deleteShelter;

const eventEmitter = new EventEmitter();
shelterModule.registerShelterEvent(eventEmitter);

const server = http.createServer((req, res) => {
  const { method, url } = req;
  const { pathname } = parse(url, true);

  if (pathname === '/') {
    fs.readFile('./index.html', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (pathname.startsWith('/shelters')) {
    shelterRoutes(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = 8080;

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
