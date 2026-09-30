class InputListener {
  onKeyDown = null;
  #buttons = {
    left: null,
    right: null,
    jump: null,
  };

  constructor({ buttons }) {
    this.dirs = {
      left: false,
      right: false,
      jump: false,
    };
    for (const dir in this.#buttons) {
      if (dir in buttons && buttons[dir]) {
        this.#buttons[dir] = buttons[dir];
      }
    }
  }

  #onkeydown(dirs, onKeyDown) {
    return function (e) {
      if (onKeyDown) onKeyDown(e.key);
      switch (e.key.toUpperCase()) {
        case "ARROWLEFT":
        case "A":
          dirs.left = true;
          break;
        case "ARROWRIGHT":
        case "D":
          dirs.right = true;
          break;
        case "ARROWUP":
        case " ":
          dirs.jump = true;
          break;
      }
    };
  }
  #onkeyup(dirs) {
    return function (e) {
      switch (e.key.toUpperCase()) {
        case "ARROWLEFT":
        case "A":
          dirs.left = false;
          break;
        case "ARROWRIGHT":
        case "D":
          dirs.right = false;
          break;
        case "ARROWUP":
        case " ":
          dirs.jump = false;
          break;
      }
    };
  }

  listen() {
    window.addEventListener(
      "keydown",
      this.#onkeydown(this.dirs, this.onKeyDown),
    );
    window.addEventListener("keyup", this.#onkeyup(this.dirs));

    // Format: { pointerId: button }
    const activePointers = new Map();
    for (const dir in this.#buttons) {
      if (!this.#buttons[dir]) continue;

      this.#buttons[dir].addEventListener("pointerdown", (e) => {
        this.dirs[dir] = true;
        this.#buttons[dir].classList.add("pressed");
        activePointers.set(e.pointerId, this.#buttons[dir]);
      });
			const undoPress = (e) => {
        this.dirs[dir] = false;
        this.#buttons[dir].classList.remove("pressed");
        activePointers.delete(e.pointerId);
      }
      this.#buttons[dir].addEventListener("pointerup", undoPress);
      this.#buttons[dir].addEventListener("pointerout", undoPress);
      this.#buttons[dir].addEventListener("pointercancel", undoPress);
    }
  }
}

export default InputListener;
