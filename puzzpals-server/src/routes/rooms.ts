import { Router } from 'express';
import { getRoomFromStore, createRoomInStore } from 'src/memorystore.js';
import { parsePuzzle } from '@puzzpals/puzzle-parser';

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

// TODO: Fix concurrency issue where token has a very small chance of clashing
async function generateToken() {
  let token;
  // Collision check
  for (let i = 0; i < 5; i++) {
    token = makeToken(6);
    const exists = await getRoomFromStore(token);
    if (!exists) break;
  }
  if (!token) 
    return null;

  return token;
}

// Create room by uploading a file
router.post('/create', async (req, res) => {

  // Test parse file 
  const puzzleData = req.body;
  try {
    const puzzle = parsePuzzle(puzzleData);

    const token = await generateToken();
    if (token === null) {
      return res.status(500).json({ error: 'Could not create room, please try again' });
    }

    createRoomInStore(token, puzzle);

    res.json({
      token: token
    })
  } catch (e) {
    return res.status(400).json({ error: 'Invalid puzzle data' });
  }

});

// Get room by token
router.get('/:token', async (req, res) => {
  const { token } = req.params;
  const room = await getRoomFromStore(token);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json({ room });
});

// Join room
router.post('/:token/join', async (req, res) => {
  const { token } = req.params;
  const room = await getRoomFromStore(token);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json({ room });
});

// Leave room
router.post('/:token/leave', async (req, res) => {
  const { token } = req.params;
  const room = await getRoomFromStore(token);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json({ room });
})

export default router;
