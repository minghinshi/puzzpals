import type { Server } from 'socket.io';
import { createEmptyGrid } from './grid.js';
import { getRoomFromStore } from './memorystore.js';
import { initDb } from './db.js';

let db: any = null;

function init(io: Server) {
  db = initDb();

  io.on('connection', socket => {
    socket.on('room:join', data => {
      const token = data.token;
      console.log("joined");
      socket.join(token);

      const grid = getRoomFromStore(token)?.puzzleData || null;
      if (!grid) {
        socket.emit('grid:state', createEmptyGrid());
      } else {
        socket.emit('grid:state', grid);
      }
    });

    socket.on('grid:updateCell', data => {
      const { token, idx, value } = data;
      const grid = getRoomFromStore(token)?.puzzleData;

      if (!grid) {
        return;
      }

      grid.cells[idx]?.setData(value);

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

  // placeholder: start autosave interval here in future (once implemented)
}

// Save to DB on shutdown to prevent data loss
function stop(io: Server) {
  io.close();

  if (db) {
    db.close();
    db = null;
  }
}

export { init, stop };