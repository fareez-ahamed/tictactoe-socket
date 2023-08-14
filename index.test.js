const { describe, test, beforeEach, before } = require("node:test");
const assert = require("node:assert");
const Game = require("./index");

describe("Game", () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  test("should start the game when two players join", (_, done) => {
    game.once("started", () => {
      done();
    });
    game.joinPlayer();
    game.joinPlayer();
  });

  test("should get requestToPlay for X when started", (_, done) => {
    game.on("requestToPlay", (player) => {
      assert.equal(player, "X");
      done();
    });
    game.joinPlayer();
    game.joinPlayer();
  });

  describe("Game Play", () => {
    let game;
    before(() => {
      game = new Game();
      game.joinPlayer();
      game.joinPlayer();
    });

    test("Step 1: should get requestToPlay for O when X has made his move", (_, done) => {
      game.once("requestToPlay", (player) => {
        assert.equal(game.board[1][1], "X");
        assert.equal(player, "O");
        done();
      });
      game.mark(1, 1, "X");
    });

    test("Step 2: should get requestToPlay for X when O has made his move", (_, done) => {
      game.once("requestToPlay", (player) => {
        assert.equal(game.board[1][2], "O");
        assert.equal(player, "X");
        done();
      });
      game.mark(1, 2, "O");
    });

    test("Step 3: should get requestToPlay for O when X has made his move", (_, done) => {
      game.once("requestToPlay", (player) => {
        assert.equal(game.board[0][1], "X");
        assert.equal(player, "O");
        done();
      });
      game.mark(0, 1, "X");
    });

    test("Step 4: should get requestToPlay for X when O has made his move", (_, done) => {
      game.once("requestToPlay", (player) => {
        assert.equal(game.board[0][2], "O");
        assert.equal(player, "X");
        done();
      });
      game.mark(0, 2, "O");
    });

    test("Step 5: should complete the game with X as winner", (_, done) => {
      game.once("completed", (result) => {
        assert.equal(game.board[2][1], "X");
        assert.deepEqual(result, { result: "won", player: "X" });
        done();
      });
      game.mark(2, 1, "X");
    });
  });
});
