import Entity from "./entity.js";

class Text extends Entity {
  constructor(camera, text = "", x, y) {
    super(camera, x, y);
    this.text = text;
  }

	draw (ctx) {
    ctx.fillStyle = "hsl(210, 50%, 70%)";
		ctx.font = "14px monospace";
		ctx.textAlign = "left";
    ctx.fillText(this.text, this.x - this.camera.x, this.y - this.camera.y);
  }
}

export default Text;
