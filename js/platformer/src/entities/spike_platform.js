import Entity from "./entity.js";
import Spike from "./spike.js";

class SpikePlatform extends Entity {
  constructor(camera, x, y, width, height) {
    super(camera, x, y, width, height);
		this.xSpeed = 70;
		this.xAcc = 5;
		this.maxXSpeed = 280;
  }

	// reduce spike hitbox
	get width() { return this._width }
	set width(width) { this.hitbox.width = width - 5; this._width = width }

  draw(ctx) {
    const [x, y] = [this.x - this.camera.x, this.y - this.camera.y];
		const spikeHeight = Spike.height;
    const spikeWidth = Spike.width;
    const spikeCount = Math.ceil(this.height / spikeWidth);

    ctx.fillStyle = "hsl(210, 50%, 30%)";
    ctx.fillRect(x, y, this.width - spikeHeight, this.height);
		ctx.fillStyle = "hsl(210, 50%, 20%)";
		ctx.fillRect(x + this.width - spikeHeight - 20, y, 20, this.height);
    ctx.fillStyle = Spike.color;
    for (let i = spikeCount - 1; i >= 0; i--) {
      const [x1, y1] = [x + this.width - spikeHeight, y + this.height - i * spikeWidth];
      const [x2, y2] = [x1, y1 - spikeWidth];
      const [x3, y3] = [x + this.width, y1 - spikeWidth / 2];
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x1, y1);
      ctx.fill();
    }
  }
}

export default SpikePlatform;
