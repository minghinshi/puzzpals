import type { Server } from 'socket.io';
import { createEmptyGrid } from './grid.js';
import { isDirty, markAsClean, markAsDirty, getRoomFromStore, getAllRoomsFromStore } from './memorystore.js';
import { initDb, closeDb, upsertRoom } from './db.js';

let interval: NodeJS.Timeout | null = null;
let saving = false;

function init(io: Server) {
  initDb();

  io.on('connection', socket => {
    socket.on('room:join', async data => {
      const token = data.token;
      console.log("joined");
      socket.join(token);

      const room = await getRoomFromStore(token);
      
      if (!room) {
        return;
      }

      const grid = room.puzzleData || null;
      if (!grid) {
        socket.emit('grid:state', createEmptyGrid());
      } else {
        socket.emit('grid:state', grid);
      }
    });

    socket.on('grid:updateCell', async data => {
      const { token, idx, value } = data;

      const room = await getRoomFromStore(token);
      if (!room) {
        return;
      }

      const grid = room.puzzleData;

      if (!grid) {
        return;
      }

      grid.cells[idx]?.setData(value);
      markAsDirty(room);

      // Emit the update to all clients in the room (including the sender)
      io.to(token).emit('grid:cellUpdated', { idx, value });
    });

    const handleDisconnect = (data: any) => {
      const token = data.token;
      socket.leave(token);
    };

    socket.on('room:leave', data => handleDisconnect(data));
    socket.on('disconnect', data => handleDisconnect(data));
  });

  interval = setInterval(autosave, 60 * 1000); // every 60 seconds
}

async function autosave() {
  for (const [token, room] of getAllRoomsFromStore()) {
    if (isDirty(room)) {
      await upsertRoom(token, JSON.stringify(room.puzzleData));
      markAsClean(room);
    }
  }
}

// Save to DB on shutdown to prevent data loss
async function stop(io: Server) {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  io.close();

  // Save to the database one last time
  await autosave();
  closeDb();
}

export { init, stop };