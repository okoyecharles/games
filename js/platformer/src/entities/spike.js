import Entity from "./entity.js";

class Spike extends Entity {
  static color = "hsl(210, 50%, 90%)";
  static height = 28;
  static width = 20;

	// reduce spike hitbox
  set x(x) { this.hitbox.x = x + Spike.width * 0.1; this._x = x }
	get x() { return this._x }

  set y(y) { this.hitbox.y = y + Spike.height * 0.2; this._y = y }
  get y() { return this._y }

  set width(width) { this.hitbox.width = width * 0.8; this._width = width }
  get width() { return this._width }

  set height(height) { this.hitbox.height = height * 0.8; this._height = height }
  get height() { return this._height }

  constructor(camera, x, y, width = 20, height = 32) {
    super(camera, x, y, width, height);
  }

  draw(ctx) {
    // angle of the triangles' base drawn around the hitbox
    const baseAngle = (Math.PI * 72) / 180;
    ctx.fillStyle = this.color;
    const x = this.x - this.camera.x;
    const y = this.y - this.camera.y;
    const pointA = [x + this.width / 2, y];
    const pointB = [x, y + this.height];
    const pointC = [x + this.width, y + this.height];
    ctx.beginPath();
    ctx.moveTo(pointA[0], pointA[1]);
    ctx.lineTo(pointB[0], pointB[1]);
    ctx.lineTo(pointC[0], pointC[1]);
    ctx.lineTo(pointA[0], pointA[1]);
    ctx.fill();
  }
}

export default Spike;
