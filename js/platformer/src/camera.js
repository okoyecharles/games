class Camera {
  constructor(x, y, width, height) {
    if (
      typeof x !== "number" ||
      typeof y !== "number" ||
      typeof width !== "number" ||
      typeof height !== "number"
    )
      throw new Error("camera requires x, y, width and height");
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

export default Camera;
