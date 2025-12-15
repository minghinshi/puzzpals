export const BULB = 0;
export const DOT = 1;
export const NO_INPUT = 2;

export default class Cell {
  isBlack = false;
  number = null;
  input = NO_INPUT;

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

  setData(data) {
    this.isBlack = data.isBlack;
    this.number = data.number;
    this.input = data.input;
  }
}