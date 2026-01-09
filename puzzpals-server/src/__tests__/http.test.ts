import assert from "node:assert/strict";
import { describe, it } from "node:test";
import request from "supertest";

import app from "../app.js";

describe("HTTP endpoints", () => {
  const payload = {
    "type": "akari",
    "grid": [["."]]
  };

  it("can create rooms", async () => {
    const res = await request(app).post("/api/rooms/create").send(payload);
    assert.equal(res.status, 201);
  });

  it("can join players to rooms", async () => {
    const createRes = await request(app).post("/api/rooms/create").send(payload);
    const token = createRes.body.token;

    const joinRes = await request(app).post(`/api/rooms/${token}/join`);
    assert.equal(joinRes.status, 200);
  });
});