import { Server } from "socket.io";

import { closeDb, initDb } from "src/db.js";
import { __resetForTests } from "src/memorystore.js";
import { init } from "src/socket.js";

let io: Server;

export async function arrangeBeforeAll() {
  io = new Server(3000);
  init(io);
}

export function arrangeBeforeEach() {
  // In-memory databases are deleted when closed
  initDb(":memory:");
}

export function cleanUpAfterEach() {
  closeDb();
  __resetForTests();
}

export function cleanUpAfterAll() {
  io.close();
}