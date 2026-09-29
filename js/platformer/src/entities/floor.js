import Entity from "./entity.js";

export default class Floor extends Entity {
	#stripeWidth = 20;
  constructor(camera, x, y, width, height) {
    super(camera, x, y, width, height);
  }

	draw(ctx) {
		const stripeCount = Math.ceil(this.width / this.#stripeWidth);
		const [x, y] = [this.x - this.camera.x, this.y - this.camera.y];
    for (let i = 0; i < stripeCount; i++) {
      ctx.fillStyle = i % 2 === 0 ? "hsla(210, 50%, 20%)" : "hsla(210, 50%, 15%)";
			const [x1, y1] = [x + i * this.#stripeWidth, y];
      const [x2, y2] = [x1 + this.#stripeWidth, y];
			const [x3, y3] = [x1 - this.#stripeWidth, y + this.height];
			const [x4, y4] = [x2 - this.#stripeWidth, y + this.height];
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x4, y4);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x1, y1);
      ctx.fill();
    }
	}
}
