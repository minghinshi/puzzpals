import { createServer, Server as HttpServer } from 'http';
import { Server as SocketServer } from "socket.io";

import app from "src/app.js";
import { closeDb, initDb } from "src/db.js";
import { __resetForTests } from "src/memorystore.js";
import { init } from "src/socket.js";
import ClientWrapper from "./client-wrapper.js";

let io: SocketServer;
let httpServer: HttpServer;

const clients: ClientWrapper[] = [];

export async function arrangeBeforeAll() {
  httpServer = createServer(app);
  io = new SocketServer(httpServer);
  init(io);

  await new Promise<void>(resolve => httpServer.listen(0, () => resolve()));

  const addr = httpServer.address();
  if (addr !== null && typeof addr === "object") {
    process.env.TEST_SOCKET_URL = `http://localhost:${addr.port}`
  } else {
    throw new Error("Failed to get address port");
  }
}

export function arrangeBeforeEach() {
  // In-memory databases are deleted when closed
  initDb(":memory:");
}

export function createClient() {
  const client = new ClientWrapper();
  clients.push(client);
  return client;
}

export function cleanUpAfterEach() {
  closeDb();
  __resetForTests();

  while (clients.length > 0) {
    clients.pop()!.close();
  }
}

export function cleanUpAfterAll() {
  io.close();
  httpServer.close();
}