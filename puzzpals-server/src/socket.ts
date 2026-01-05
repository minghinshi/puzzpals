import type { Server } from 'socket.io';
import { createEmptyGrid, grids } from './grid.js';

function init(io: Server) {
  io.on('connection', socket => {
    socket.on('room:join', data => {

      const token = data.token;
      console.log("joined");
      socket.join(token);

      let grid = grids.get(token);
      if (!grid) {
        grid = createEmptyGrid();
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

      // Broadcast the update to all clients including itself
      io.to(token).emit('grid:cellUpdated', { idx, value });
    });

    const handleDisconnect = data => {
      const token = data.token
      socket.leave(token);
    }

    socket.on('room:leave', data => handleDisconnect(data));
    socket.on('disconnect', data => handleDisconnect(data));
  })
}

export default init;