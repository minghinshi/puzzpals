#!/usr/bin/env node

// Load environment variables
import 'dotenv/config';

function assertEnvExists(variable: string | undefined, name: string): asserts variable is string {
  if (variable === undefined) {
    throw new Error(`The .env variable ${name} is missing`);
  }
}

assertEnvExists(process.env.PORT, "PORT");
assertEnvExists(process.env.MONGO_URI, "MONGO_URI");
assertEnvExists(process.env.CLIENT_BASE_URL, "CLIENT_BASE_URL");

import debug from 'debug';
import { createServer } from 'http';
import { connect } from 'mongoose';
import { Server } from 'socket.io';
import app from '../app.js';
import init from '../socket.js';

const serverDebugger = debug('puzzpals-server:server');

// Get port from environment and store in Express
const port = normalizePort(process.env.PORT);
app.set('port', port);

// Create HTTP server
const server = createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_BASE_URL]
  }
});

app.set('io', io);
init(io);

// Connect to Mongoose
connect(process.env.MONGO_URI);

// Listen on provided port, on all network interfaces
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr!.port;
  serverDebugger('Listening on ' + bind);
}
