class Entity {
	_x;
  _y;
  _width;
  _height;
	hitbox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
	}
  constructor(
    camera,
    x = 0,
    y = 0,
    width = 20,
    height = 20,
    color = "hsl(0, 100%, 100%)",
  ) {
    if (!camera) throw new Error("camera is required for entities");
    this.camera = camera;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  set x(x) { this.hitbox.x = x; this._x = x }
	get x() { return this._x }

	set y(y) { this.hitbox.y = y; this._y = y }
	get y() { return this._y }

  set width(width) { this.hitbox.width = width; this._width = width }
	get width() { return this._width }

  set height(height) { this.hitbox.height = height; this._height = height }
  get height() { return this._height }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x - this.camera.x,
      this.y - this.camera.y,
      this.width,
      this.height,
    );
  }

  collides(entity) {
		if (!(entity instanceof Entity)) throw new Error("entity is not an entity");
		if (!entity.hitbox) throw new Error("entity has no hitbox");
    return !(
      this.hitbox.x > entity.hitbox.x + entity.hitbox.width ||
      this.hitbox.x + this.hitbox.width < entity.hitbox.x ||
      this.hitbox.y > entity.hitbox.y + entity.hitbox.height ||
      this.hitbox.y + this.hitbox.height < entity.hitbox.y
    );
  }
}

export default Entity;
