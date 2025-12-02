const Cell = require('./models/Cell')

// roomId => grid
const grids = new Map();

function createEmptyGrid() {
  const grid = {
    rows: 7,
    cols: 7,
    cells: Array.from({ length: 7 * 7 }, () => new Cell())
  };

  // Clues
  grid.cells[1 * 7 + 2].setBlack();
  grid.cells[1 * 7 + 4].setBlack();
  grid.cells[2 * 7 + 1].setClue(2);
  grid.cells[2 * 7 + 5].setClue(2);
  grid.cells[4 * 7 + 1].setBlack();
  grid.cells[4 * 7 + 5].setClue(3);
  grid.cells[5 * 7 + 2].setClue(4);
  grid.cells[5 * 7 + 4].setBlack();

  return grid;
}

module.exports = { grids, createEmptyGrid };