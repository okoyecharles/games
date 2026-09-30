import Entity from "./entity.js";

class Player extends Entity {
  constructor(camera, x, y) {
    super(camera, x, y, 32, 32, "hsla(160, 100%, 50%)");
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.xAcc = 1000;
		this.maxXSpeed = 300;
		this.jumpSpeed = 360;
  }
}

export default Player;
