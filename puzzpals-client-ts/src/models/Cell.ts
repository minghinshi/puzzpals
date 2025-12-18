import type CellState from "./CellState";

const bulbText = '💡';
const dotText = '·';

export const BULB = 0;
export const DOT = 1;
export const NO_INPUT = 2;

export default class Cell {
  readonly idx: number;

  private isBlack = false;
  private number: number | null = null;
  private input = NO_INPUT;

  constructor(idx: number) {
    this.idx = idx;
  }

  toggleLightBulb() {
    if (this.isBlack) {
      // Prevent modifying black cells
      return false;
    } else {
      // If the cell is marked with something else, this will clear it first
      this.input = (this.input === NO_INPUT ? BULB : NO_INPUT);
      return true;
    }
  }

  toggleNote() {
    if (this.isBlack) {
      return false;
    } else {
      this.input = (this.input === NO_INPUT ? DOT : NO_INPUT);
      return true;
    }
  }

  setState(data: CellState) {
    this.isBlack = data.isBlack;
    this.number = data.number;
    this.input = data.input;
  }

  get text() {
    if (this.isBlack) {
      if (this.number === null) {
        return '';
      } else {
        return this.number.toString();
      }
    } else {
      switch (this.input) {
        case BULB:
          return bulbText;
        case DOT:
          return dotText;
        case NO_INPUT:
          return '';
        default:
          throw new Error("Cell has invalid input");
      }
    }
  }

  get backgroundColor() {
    return this.isBlack ? "#000000" : "#ffffff";
  }

  get textColor() {
    return this.isBlack ? "#ffffff" : "#000000";
  }

  get state() {
    return {
      isBlack: this.isBlack,
      number: this.number,
      input: this.input
    };
  }
}