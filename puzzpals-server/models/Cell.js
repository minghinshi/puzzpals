module.exports = class Cell {
  constructor() {
    this.backgroundColor = "#ffffff";
    this.textColor = "#000000";
    this.symbol = "";
  }

  setBlack() {
    this.backgroundColor = "#000000";
  }

  setClue(number) {
    this.backgroundColor = "#000000";
    this.textColor = "#ffffff";
    this.symbol = number.toString();
  }
}