const { grids, createEmptyGrid } = require('./grid.js')

function init(io) {
  io.on('connection', socket => {
    socket.on('room:join', data => {
      const token = data.token
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
      grids.get(token).cells[idx].setData(value);

      // Broadcast the update to clients
      socket.to(token).emit('grid:cellUpdated', { idx, value });
    })

    socket.on('room:leave', data => {
      const token = data.token
      socket.leave(token);
    });
  })
}

module.exports = { init };