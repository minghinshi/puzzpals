import assert from "node:assert/strict";
import { after, afterEach, before, beforeEach, describe, it } from "node:test";
import request from "supertest";

import app from "src/app.js";
import { arrangeBeforeAll, arrangeBeforeEach, cleanUpAfterAll, cleanUpAfterEach } from "./utils/arrange.js";
import ClientWrapper from "./utils/client-wrapper.js";

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
    const client1 = new ClientWrapper();
    const client2 = new ClientWrapper();

    // Client sockets emit to join room
    client1.emit("room:join", { token });
    client2.emit("room:join", { token });

    await Promise.all([
      client1.waitFor("grid:state"),
      client2.waitFor("grid:state")
    ]);

    client1.listenTo("grid:cellUpdated");
    client2.listenTo("grid:cellUpdated");

    // Client1 updates a cell
    client1.emit("grid:updateCell", { token, idx: 0, value: 0 });

    // Wait briefly for broadcasts to propagate
    await Promise.all([
      client1.waitFor("grid:cellUpdated"),
      client2.waitFor("grid:cellUpdated")
    ]);

    // Assert broadcast reached clients in same room (including sender)
    assert.ok(client1.hasReceived("grid:cellUpdated", { idx: 0, value: 0 }))
    assert.ok(client2.hasReceived("grid:cellUpdated", { idx: 0, value: 0 }))

    // Cleanup
    client1.close();
    client2.close();
  });
});