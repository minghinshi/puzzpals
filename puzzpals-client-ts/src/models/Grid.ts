import Cell from './Cell';
import type CellState from './CellState';

export default class Grid {

  rows: number;
  cols: number
  cells: Cell[];

  constructor(rows: number, cols: number, cells: CellState[]) {
    this.rows = rows;
    this.cols = cols;
    this.cells = cells.map((state, idx) => {
      const cell = new Cell(idx);
      cell.setState(state);
      return cell;
    });
  }

  getCell(idx: number): Cell | null {
    if (idx < 0 || idx >= this.cells.length) {
      return null;
    }
    const cell = this.cells[idx];
    return cell ?? null;
  }

  setCellState(idx: number, value: CellState): void {
    const cell = this.getCell(idx);
    if (cell === null) {
      throw new Error(`Cell is undefined (idx = ${idx})`);
    }
    cell.setState(value);
  }
}