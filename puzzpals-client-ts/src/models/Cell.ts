import type CellState from "./CellState";

const bulbText = '💡';
const dotText = '·';

export const BULB = 0;
export const DOT = 1;
export const NO_INPUT = 2;

export default class Cell {
  readonly idx: number;

  private _isBlack = false;
  private _number: number | null = null;
  private _input = NO_INPUT;
  private _lightLevel = 0;

  constructor(idx: number) {
    this.idx = idx;
  }

  toggleLightBulb() {
    if (this._isBlack) {
      // Prevent modifying black cells
      return false;
    } else {
      // If the cell is marked with something else, this will clear it first
      this._input = (this._input === NO_INPUT ? BULB : NO_INPUT);
      return true;
    }
  }

  toggleNote() {
    if (this._isBlack) {
      return false;
    } else {
      this._input = (this._input === NO_INPUT ? DOT : NO_INPUT);
      return true;
    }
  }

  setState(data: CellState) {
    this._isBlack = data.isBlack;
    this._number = data.number;
    this._input = data.input;
  }

  changeLightLevel(increase: boolean) {
    this._lightLevel += (increase ? 1 : -1);
  }

  get isBlack() {
    return this._isBlack;
  }

  get hasBulb() {
    return this._input === BULB;
  }

  get text() {
    if (this._isBlack) {
      if (this._number === null) {
        return '';
      } else {
        return this._number.toString();
      }
    } else {
      switch (this._input) {
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
    if (this._isBlack) {
      return "#000000";
    } else if (this._lightLevel > 1 && this._input == BULB) {
      return "#7f0000";
    } else if (this._lightLevel > 0) {
      return "#ffff7f";
    } else {
      return "#ffffff";
    }
  }

  get textColor() {
    return this._isBlack ? "#ffffff" : "#000000";
  }

  get state() {
    return {
      isBlack: this._isBlack,
      number: this._number,
      input: this._input
    };
  }
}