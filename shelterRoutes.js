
const { getAllShelters, addShelter, editShelter, deleteShelter, registerShelterEvent } = require('../modules/shelter');
const { parse, format } = require('url');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

// Register the eventEmitter
registerShelterEvent(eventEmitter);

function logRequest(req) {
  const { method, url, headers } = req;
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);
  console.log('Headers:', headers);
}

function logResponse(res) {
  const { statusCode, statusMessage } = res;
  console.log(`[${new Date().toISOString()}] Response: ${statusCode} ${statusMessage}`);
  console.log('Headers:', res.getHeaders());
}

function shelterRoutes(req, res) {
  logRequest(req);

  const { method, url } = req;
  const { pathname, query } = parse(url, true);

  if (method === 'GET' && pathname === '/shelters') {
    const shelters = getAllShelters();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(shelters));

  } else if (method === 'POST' && pathname === '/shelters') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const newShelter = JSON.parse(body);
      eventEmitter.emit('shelterRegistered', newShelter);

      const createdShelter = addShelter(newShelter);
      const redirectUrl = format({
        pathname: '/',
        query: {},
      });

      res.writeHead(302, { 'Location': redirectUrl });
      res.end();
      logResponse(res);
    });

  } else if (method === 'PUT' && pathname.startsWith('/shelters/')) {
    const shelterId = parseInt(pathname.split('/')[2]);

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const updatedShelter = JSON.parse(body);

      // Emit the 'shelterUpdated' event
      eventEmitter.emit('shelterUpdated', { id: shelterId, updatedShelter });

      const editedShelter = editShelter(shelterId, updatedShelter);
      if (editedShelter) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(editedShelter));
        logResponse(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Shelter not found');
        logResponse(res);
      }
    });

  } else if (method === 'DELETE' && pathname.startsWith('/shelters/')) {
    const shelterId = parseInt(pathname.split('/')[2]);
    const deleted = deleteShelter(shelterId);
    if (deleted) {
      res.writeHead(204);
      res.end();
      logResponse(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Shelter not found');
      logResponse(res);
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    logResponse(res);
  }
}

module.exports = { shelterRoutes };
