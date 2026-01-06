import { Router } from 'express';
import Room from '../models/Room.js';
import { parsePuzzle } from '#puzzle-parser/esm/index.js';

const router = Router();

function makeToken(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i]! % chars.length];
  }
  return result;
}

async function createRoom() {
  let token;
  // Collision check
  for (let i = 0; i < 5; i++) {
    token = makeToken(6);
    const exists = await Room.findOne({ token });
    if (!exists) break;
    token = null;
  }
  if (!token) 
    return null;

  const room = new Room({ token });
  await room.save();

  return room;
}

// Create room by uploading a file
router.post('/create', async (req, res) => {

  // Test parse file 
  const puzzleData = req.body;
  try {
    parsePuzzle(puzzleData);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid puzzle data' });
  }

  const room = await createRoom();
  if (room === null) {
    return res.status(500).json({ error: 'Could not create room, please try again' });
  }

  room.puzzleData = puzzleData;
  await room.save();

  res.json({
    token: room.token
  })
});

// Get room by token
router.get('/:token', async (req, res) => {
  const { token } = req.params;
  const room = await Room.findOne({ token });
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json({ room });
});

// Join room
router.post('/:token/join', async (req, res) => {
  const { token } = req.params;
  const room = await Room.findOne({ token });
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json({ room });
});

// Leave room
router.post('/:token/leave', async (req, res) => {
  const { token } = req.params;
  const room = await Room.findOne({ token });
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json({ room });
})

export default router;
