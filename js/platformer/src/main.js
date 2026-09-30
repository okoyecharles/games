import Game from "./game.js";
import InputListener from "./input.js";

function main() {
  const canvas = document.getElementById("game");
  const gameOverScreen = document.getElementById("game-over");

  // Inputs
  const leftButton = document.getElementById("Left");
  const rightButton = document.getElementById("Right");
  const restartButton = document.getElementById("Restart");
  const jumpButton = document.getElementById("Jump");
  const input = new InputListener({
    buttons: {
      left: leftButton,
      right: rightButton,
      jump: jumpButton,
    },
  });
  let game;
  function startGame() {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    if (!game || game.isGameOver()) {
      game = new Game(canvas, input);
      gameOverScreen.classList.add("hidden");
      if (isMobile) {
        leftButton.classList.remove("hidden");
        rightButton.classList.remove("hidden");
        jumpButton.classList.remove("hidden");
      }
      restartButton.classList.add("hidden");
      game.onGameOver = () => {
        gameOverScreen.classList.remove("hidden");
        leftButton.classList.add("hidden");
        rightButton.classList.add("hidden");
        jumpButton.classList.add("hidden");
        restartButton.classList.remove("hidden");
      };
      game.start();
    }
  }
  input.onKeyDown = (key) => {
    if (key === "Enter") startGame();
  };
  input.listen();
  restartButton.addEventListener("click", startGame);

  startGame();
}

main();
