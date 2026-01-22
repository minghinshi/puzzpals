import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, todo } from "node:test";
import request from "supertest";

import app from "src/app.js";
import { arrangeBeforeEach, cleanUpAfterEach, } from "./utils/arrange.js";
import { createMockSocket, mockBroadcast, mockIo } from "src/__mocks__/io.js";

describe("Socket", () => {
  beforeEach(arrangeBeforeEach);
  afterEach(cleanUpAfterEach);

  // As a player, I want to synchronise my progress with other players
  // so that we can collaborate on the same puzzle.
  todo("synchronizes grid with all players in same room", async () => {
    // Open room
    const payload = {
      type: "akari",
      grid: [["."]],
    };

    const res = await request(app).post("/api/rooms/create").send(payload);
    const token = res.body.token;

    const socket = createMockSocket();
    socket.call("room:join", { token });

    const expectedGrid = {
      rows: 1,
      cols: 1,
      cells: [
        {
          isBlack: false,
          number: null,
          input: 2,
        },
      ],
      type: "akari",
    };

    assert.deepEqual(socket.emit.mock.calls[1]!.arguments, ["grid:state", expectedGrid]);

    socket.call("grid:updateCell", { token, idx: 0, value: 0 });
    assert.deepEqual(mockIo.to.mock.calls[0]!.arguments, [token]);
    assert.deepEqual(mockBroadcast.mock.calls[0]!.arguments, ["grid:cellUpdated", { idx: 0, value: 0 }]);
  });
});
