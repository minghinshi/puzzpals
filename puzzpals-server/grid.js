// roomId => grid
const grids = new Map();

function createEmptyGrid() {
  return {
    rows: 7,
    cols: 7,
    cells: new Array(7 * 7).fill(false)
  }
}

module.exports = { grids, createEmptyGrid };