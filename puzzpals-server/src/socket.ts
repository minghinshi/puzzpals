import type { Server } from 'socket.io';
import { createEmptyGrid, grids } from './grid.js';
import { pushMessage, fetchChatRecords } from './chat.js';
import { randomUserID } from './user.js';

function init(io: Server) {
  io.on('connection', socket => {
    socket.on('room:join', data => {

      const token = data.token;
      const userID = randomUserID(token);
      console.log("joined", userID);
      socket.join(token);

      let grid = grids.get(token);
      if (!grid) {
        grid = createEmptyGrid();
        grids.set(token, grid);
      }


      socket.emit('user:id', userID);
      socket.emit('grid:state', grid);
      // socket.emit('chat:records', fetchChatRecords(token));
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

    socket.on('chat:newMessage', data => {
      const { token, message } = data;
      pushMessage(token, message);
      io.to(token).emit('chat:messageNew', message);
    });


    const handleDisconnect = (data?: { token?: string }) => {
      if (data?.token) {
        socket.leave(data.token);
      }
    };

    socket.on('room:leave', data => handleDisconnect(data));
    socket.on('disconnect', () => handleDisconnect());
  })
}

export default init;