export default class Cell {
  static lightBulbSymbol = "💡";

  constructor() {
    this.backgroundColor = "#ffffff";
    this.textColor = "#000000";
    this.symbol = "";
  }

  toggleLightBulb() {
    if (this.backgroundColor === "#000000") {
      return false;
    } else {
      this.symbol = (this.symbol === Cell.lightBulbSymbol ? "" : Cell.lightBulbSymbol);
      return true;
    }
  }

  setData(data) {
    this.backgroundColor = data.backgroundColor;
    this.textColor = data.textColor;
    this.symbol = data.symbol;
  }
}