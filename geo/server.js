const http = require('http');
const app = require('./app');
const sockets = require('./sockets');

let server = http.createServer(app);

server = sockets(server);

server.listen(8000);