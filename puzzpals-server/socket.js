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
      const { token, row, col, value } = data;
      const grid = grids.get(token);
      const idx = row * grid.cols + col;
      grid.cells[idx] = value;

      // Broadcast
      socket.to(token).emit('grid:cellUpdated', { row, col, value });
    })

    socket.on('room:leave', data => {
      const token = data.token
      socket.leave(token);
    });
  })
}

module.exports = { init };