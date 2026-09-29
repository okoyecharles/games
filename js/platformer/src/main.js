import Game from "./game.js";
import InputListener from "./input.js";

function main() {
  const canvas = document.getElementById("game");
  const gameOverScreen = document.getElementById("game-over");
  const input = new InputListener();
  let game;
  input.onKeyDown = (key) => {
    if (key === "Enter" && game.isGameOver()) {
      setTimeout(() => {
        game = new Game(canvas, input, gameOverScreen);
        game.start();
      });
    }
  };
  input.listen();

  setTimeout(() => {
    game = new Game(canvas, input, gameOverScreen);
    game.start();
  });
}

main();
