// @ts-check
const EventEmitter = require("events");

class Game extends EventEmitter {
  board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  players = 0;

  constructor() {
    super();
    this.on("started", () => this.emit("requestToPlay", "X"));
  }

  joinPlayer() {
    this.players++;
    if (this.players === 2) {
      this.emit("started");
    }
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {'X' | 'O'} forPlayer
   */
  mark(x, y, forPlayer) {
    checkBoardPosition(x, y);
    if (this.board[x][y] !== null) {
      throw new Error(`${x}, ${y} is already marked for ${forPlayer}`);
    }
    this.board[x][y] = forPlayer;
    const result = this.#checkIfGameCompleted();
    if (result[0]) {
      this.emit("completed", {
        result: result[1] !== null ? "won" : "draw",
        player: result[1],
      });
    } else {
      this.emit("requestToPlay", forPlayer === "X" ? "O" : "X");
    }
  }

  /**
   * @param {number} i
   * @returns {[false, null] | [true, 'X'|'O']}
   */
  #checkRow(i) {
    for (let k = 0; k < 3; k++) {
      if (!this.board[i][k]) {
        return [false, null];
      }
    }
    const wonRow =
      this.board[i][0] === this.board[i][1] &&
      this.board[i][1] === this.board[i][2];
    return [wonRow, wonRow ? this.board[i][0] : null];
  }

  /**
   * @param {number} j
   * @returns {[false, null] | [true, 'X'|'O']}
   */
  #checkCol(j) {
    for (let k = 0; k < 3; k++) {
      if (!this.board[k][j]) {
        return [false, null];
      }
    }
    const wonCol =
      this.board[0][j] === this.board[1][j] &&
      this.board[1][j] === this.board[2][j];
    return [wonCol, wonCol ? this.board[0][j] : null];
  }

  /**
   * @returns {[false, null] | [true, 'X'|'O']}
   */
  #checkDiagonals() {
    if (
      this.board !== null &&
      ((this.board[0][0] === this.board[1][1] &&
        this.board[1][1] === this.board[2][2]) ||
        (this.board[0][2] === this.board[1][1] &&
          this.board[1][1] === this.board[2][0]))
    ) {
      return [true, this.board[1][1]];
    }
    return [false, null];
  }

  /**
   * @returns {[boolean, 'X'|'O'|null]}
   */
  #checkIfGameCompleted() {
    for (const i of [0, 1, 2]) {
      let result = this.#checkRow(i);
      if (result[0]) {
        return result;
      }
      result = this.#checkCol(i);
      if (result[0]) {
        return result;
      }
    }
    let result = this.#checkDiagonals();
    if (result[0]) {
      return result;
    }
    for (const i of [0, 1, 2]) {
      for (const j of [0, 1, 2]) {
        if (this.board[i][j] === null) {
          return [false, null]; // Not won but game still running
        }
      }
    }
    return [true, null]; // Draw
  }
}

/**
 * @param {number} x
 * @param {number} y
 * @returns {void | never}
 */
function checkBoardPosition(x, y) {
  if (x < 0 || x > 3 || y < 0 || y > 3) {
    throw Error(`Invalid board position ${x}, ${y}`);
  }
}

module.exports = Game;
