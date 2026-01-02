const NO_INPUT = 2;

type Clue = number | null;

type CellData = {
    isBlack: boolean;
    number: Clue;
    input: number;
}

type Grid = {
    rows: number;
    cols: number;
    cells: Cell[];
}

class Cell {
  isBlack = false;
  number: number | null = null;
  input: number = NO_INPUT;

  setClue(number: Clue) {
    this.isBlack = true;
    this.number = number;
  }

  setData(data: CellData) {
    this.isBlack = data.isBlack;
    this.number = data.number;
    this.input = data.input;
  }
}

function createEmptyGrid(): Grid {

    const grid: Grid = {
        rows: 7,
        cols: 7,
        cells: Array.from({ length: 7 * 7 }, () => new Cell())
    };

    const updateCell = (row: number, col: number, clue: number | null) => {
        const index = row * grid.cols + col;
        if (index < 0 || index >= grid.cells.length) {
            throw new Error(`Cell index out of bounds: ${index}`);
        }
      const cell = grid.cells[index];
      if (cell === undefined) {
        throw new Error(`Cell is undefined at index: ${index}`);
      }
      cell.setClue(clue);
    }

    updateCell(1, 2, null);
    updateCell(1, 4, null);
    updateCell(2, 1, 2);
    updateCell(2, 5, 2);
    updateCell(4, 1, null);
    updateCell(4, 5, 3);
    updateCell(5, 2, 4);
    updateCell(5, 4, null);

    return grid;
}

export { createEmptyGrid };