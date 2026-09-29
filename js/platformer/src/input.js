class InputListener {
	onKeyDown = null;

  constructor() {
    this.dirs = {
      left: false,
      right: false,
      jump: false,
    };
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
    window.addEventListener("keydown", this.#onkeydown(this.dirs, this.onKeyDown));
    window.addEventListener("keyup", this.#onkeyup(this.dirs));
  }

}

export default InputListener;
