export default class Cell {
  static lightBulbSymbol = '💡';
  static noteSymbol = '·';

  constructor() {
    this.backgroundColor = '#ffffff';
    this.textColor = '#000000';
    this.symbol = '';
  }

  toggleLightBulb() {
    if (this.backgroundColor === '#000000') {
      return false;
    } else {
      // If the cell is marked with something else, this will clear it first
      this.symbol = (this.symbol === '' ? Cell.lightBulbSymbol : '');
      return true;
    }
  }

  toggleNote() {
    if (this.backgroundColor === '#000000') {
      return false;
    } else {
      this.symbol = (this.symbol === '' ? Cell.noteSymbol : '');
      return true;
    }
  }

  setData(data) {
    this.backgroundColor = data.backgroundColor;
    this.textColor = data.textColor;
    this.symbol = data.symbol;
  }
}