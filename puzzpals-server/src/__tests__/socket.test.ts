import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { io as Client } from "socket.io-client";
import request from "supertest";

import { init } from "src/socket.js";
import { __resetForTests } from "src/memorystore.js";
import app from "src/app.js";

describe("Socket", () => {
  // As a player, I want to synchronise my progress with other players
  // so that we can collaborate on the same puzzle.
  it("synchronizes grid with all players in same room", async (t) => {
    // Create HTTP server
    const server = createServer();

    // Wait for server to start listening
    // This promisifies `server.listen` so that we can `await` it
    await new Promise<void>(resolve => server.listen(0, resolve));

    // Create Socket.IO server
    const io = new Server(server);
    init(io);

    // Get HTTP server port
    const address = server.address();
    if (address === null || typeof address === "string") {
      t.skip("Failed to get port");
      return;
    }
    const port = address.port;

    // Open room
    const payload = {
      "type": "akari",
      "grid": [["."]]
    };

    const createRoomRes = await request(app).post("/api/rooms/create").send(payload);
    const token = createRoomRes.body.token;

    // Create client sockets
    const client1 = Client(`http://localhost:${port}`);
    const client2 = Client(`http://localhost:${port}`);

    // Client sockets emit to join room
    client1.emit("room:join", { token });
    client2.emit("room:join", { token });

    await Promise.all([
      new Promise<void>(resolve => client1.once("grid:state", resolve)),
      new Promise<void>(resolve => client2.once("grid:state", resolve)),
    ])

    const events1: any[] = [];
    const events2: any[] = [];

    client1.on("grid:cellUpdated", (d: any) => events1.push(d));
    client2.on("grid:cellUpdated", (d: any) => events2.push(d));

    // Client1 updates a cell
    client1.emit("grid:updateCell", { token, idx: 0, value: 0 });

    // Wait briefly for broadcasts to propagate
    await Promise.all([
      new Promise<void>(resolve => client1.once("grid:cellUpdated", resolve)),
      new Promise<void>(resolve => client2.once("grid:cellUpdated", resolve)),
    ])

    // Assert broadcast reached clients in same room (including sender)
    assert.equal(events1.length, 1);
    assert.deepEqual(events1[0], { idx: 0, value: 0 });

    assert.equal(events2.length, 1);
    assert.deepEqual(events2[0], { idx: 0, value: 0 });

    // Cleanup
    client1.close();
    client2.close();
    io.close();
    server.close();
    __resetForTests();
  });
});