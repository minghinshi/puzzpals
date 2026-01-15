import assert from "node:assert/strict";
import { after, afterEach, before, beforeEach, describe, it } from "node:test";
import { io } from "socket.io-client";
import request from "supertest";

import app from "src/app.js";
import { arrangeBeforeAll, arrangeBeforeEach, cleanUpAfterAll, cleanUpAfterEach } from "./utils/arrange.js";

describe("Socket", () => {
  before(arrangeBeforeAll);
  beforeEach(arrangeBeforeEach);
  afterEach(cleanUpAfterEach);
  after(cleanUpAfterAll);

  // As a player, I want to synchronise my progress with other players
  // so that we can collaborate on the same puzzle.
  it("synchronizes grid with all players in same room", async (t) => {
    // Open room
    const payload = {
      "type": "akari",
      "grid": [["."]]
    };

    const createRoomRes = await request(app).post("/api/rooms/create").send(payload);
    const token = createRoomRes.body.token;

    // Create client sockets
    const client1 = io(`http://localhost:3000`);
    const client2 = io(`http://localhost:3000`);

    // Client sockets emit to join room
    client1.emit("room:join", { token });
    client2.emit("room:join", { token });

    await Promise.all([
      new Promise<void>(resolve => client1.once("grid:state", resolve)),
      new Promise<void>(resolve => client2.once("grid:state", resolve)),
    ]);

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
    ]);

    // Assert broadcast reached clients in same room (including sender)
    assert.equal(events1.length, 1);
    assert.deepEqual(events1[0], { idx: 0, value: 0 });

    assert.equal(events2.length, 1);
    assert.deepEqual(events2[0], { idx: 0, value: 0 });

    // Cleanup
    client1.close();
    client2.close();
  });
});