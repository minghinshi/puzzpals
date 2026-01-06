import type { Server } from 'socket.io';
import { createEmptyGrid, grids } from './grid.js';
import { parsePuzzle } from '#puzzle-parser/esm/index.js';
import Room from './models/Room.js';

function init(io: Server) {
  io.on('connection', socket => {
    socket.on('room:join', async data => {

      const token = data.token;
      console.log("joined");
      socket.join(token);

      let grid = grids.get(token);
      if (!grid) {
        const puzzleData = await Room.findOne({ token }).then(r => r === null ? null : r.puzzleData);
        grid = puzzleData === null ? createEmptyGrid() : parsePuzzle(puzzleData);
        grids.set(token, grid);
      }

      socket.emit('grid:state', grid);
    });

    socket.on('grid:updateCell', data => {
      const { token, idx, value } = data;
      const grid = grids.get(token);

      if (!grid) {
        return;
      }

      grids.get(token).cells[idx].setData(value);

      // Broadcast the update to clients
      socket.to(token).emit('grid:cellUpdated', { idx, value });
    });

    const handleDisconnect = (data: any) => {
      const token = data.token;
      socket.leave(token);
    };

    socket.on('room:leave', data => handleDisconnect(data));
    socket.on('disconnect', data => handleDisconnect(data));
  });
}

export default init;