const NO_INPUT = 2;

module.exports = class Cell {
  isBlack = false;
  number = null;
  input = NO_INPUT;

  setBlack() {
    this.isBlack = true;
  }

  setClue(number) {
    this.isBlack = true;
    this.number = number;
  }

  setData(data) {
    this.isBlack = data.isBlack;
    this.number = data.number;
    this.input = data.input;
  }
}