import Entity from "./entity.js";

class Player extends Entity {
  constructor(camera, x, y) {
    super(camera, x, y, 32, 32, "hsla(160, 100%, 50%)");
		this.accx = 13;
		this.maxvx = 3;
		this.vx = 0;
		this.vy = 0;
  }
}

export default Player;
