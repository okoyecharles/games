import Camera from "./camera.js";
import Spike from "./entities/spike.js";
import SpikePlatform from "./entities/spike_platform.js";
import Player from "./entities/player.js";
import Floor from "./entities/floor.js";
import Text from "./entities/text.js";
import lerp from "./utils/lerp.js";

class Game {
  // Time
  #frameRate = 60;
  #tStart = 0;
  #t = 0;
  #tAcc = 0;
  #delta = 0;
  #frameID = null;

  // percent of the screen covered by the floor
  #floorPercent = 0.25;
  // percent of screen with no spikes
  #gracePeriodWidth = 400;
  #floorProperties = {
    y: 0,
    height: 0,
  };
  #spikesGenX = 0;

  // forces
  #gravity = 1080;
  #friction = 310;

  // game state
  #end = false;
  #score = 0;
  #highScore = 0;

  constructor(canvas, input) {
    let width = window.innerWidth - 48;
    let height = window.innerHeight - 48;
    width = Math.max(Math.min(width, 1000), 560);
    height = Math.max(Math.min(height, 600), 350);
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.camera = new Camera(0, 0, canvas.width, canvas.height);

    // Entities
    this.#floorProperties.y =
      this.camera.height - this.camera.height * this.#floorPercent;
    this.#floorProperties.height = this.camera.height * this.#floorPercent;
    this.floors = [];
    this.spikes = [];

    this.spikePlatform = new SpikePlatform(
      this.camera,
      this.camera.width * -1.5,
      this.camera.y - 45,
      this.camera.width * 1.5,
      this.camera.height * (1 - this.#floorPercent) + 45,
    );
    this.player = new Player(
      this.camera,
      this.spikePlatform.x +
        this.spikePlatform.width +
        this.#gracePeriodWidth / 2,
      this.#floorProperties.y - 32,
    );
    this.#spikesGenX =
      this.spikePlatform.x + this.spikePlatform.width + this.#gracePeriodWidth;

    const instructionsText = [
      "    ◀ / A > Move Left",
      "    ▶ / D > Move Right",
      "▲ / Space > Jump",
    ];
    this.instructions = instructionsText.map(
      (text, i) =>
        new Text(this.camera, text, this.player.x, this.camera.y + 20 + i * 20),
    );

    // Input State
    this.input = input;
		this.onGameOver = () => {};
  }

  start() {
    this.#highScore = Number(localStorage.getItem("highscore")) || 0;
    const cameraGoal = this.#getCameraGoal();
    this.camera.x = cameraGoal.x;
    this.camera.y = cameraGoal.y;
    this.#generateSpikes();
    this.#generateFloors();
    this.#loop();
  }

  isGameOver() {
    return this.#end;
  }
	
  // begin game loop
  #loop() {
    const isInitialFrame = this.#frameID === null;
    this.#frameID = requestAnimationFrame((t) => {
      if (isInitialFrame) this.#tStart = t / 1000;
      t = t / 1000 - this.#tStart;
      this.#delta = t - this.#t;
      this.#tAcc += this.#delta;
      this.#t = t;

      const frameT = 1 / this.#frameRate;
      while (this.#tAcc > frameT) {
        this.#update(frameT);
        this.#tAcc -= frameT;
      }

			this.#draw();
			this.#loop();
      if (this.#end) cancelAnimationFrame(this.#frameID);
    });
  }

  #update(dt) {
    // SCORE
    this.#score += dt; 

    // controls
    if (this.input.dirs.left) {
      this.player.xSpeed -= dt * this.player.xAcc;
    }
    if (this.input.dirs.right) {
      this.player.xSpeed += dt * this.player.xAcc;
    }
    if (this.input.dirs.jump) {
      if (this.player.y + this.player.height === this.#floorProperties.y) {
        this.player.ySpeed = -this.player.jumpSpeed;
      }
    }

    // Spike Platform
		this.spikePlatform.xSpeed += this.spikePlatform.xAcc * dt;
		this.spikePlatform.xSpeed = Math.min(
      Math.max(this.spikePlatform.xSpeed, -this.spikePlatform.maxXSpeed),
      this.spikePlatform.maxXSpeed
		)
    this.spikePlatform.x += this.spikePlatform.xSpeed * dt;

    // Game Over Rules
    if (this.spikes.some((s) => this.player.collides(s))) this.#gameOver();
    if (this.player.y > this.#floorProperties.y + this.#floorProperties.height)
      this.#gameOver();
    if (this.spikePlatform.collides(this.player)) this.#gameOver();

    // update player
    this.player.xSpeed = Math.min(
      Math.max(this.player.xSpeed, -this.player.maxXSpeed),
      this.player.maxXSpeed,
    );
    if (
      this.floors.some((f) => this.player.collides(f)) &&
      this.player.ySpeed > 0
    ) {
      this.player.y = this.#floorProperties.y - this.player.height;
      this.player.ySpeed = 0;
    }
    this.player.y += this.player.ySpeed * dt;
    this.player.x += this.player.xSpeed * dt;

    // Interpolate to camera goal
    const cameraGoal = this.#getCameraGoal();
    this.camera.x = lerp(this.camera.x, cameraGoal.x, 7 * dt);
    this.camera.y = lerp(this.camera.y, cameraGoal.y, 7 * dt);

    // physics
    this.player.ySpeed += dt * this.#gravity;
    const dir = this.player.xSpeed > 0 ? 1 : -1;
    this.player.xSpeed -= dt * this.#friction * dir;

    // procedural generation
    this.#generateSpikes();
    this.#generateFloors();
  }

  #draw() {
    const ctx = this.canvas.getContext("2d");
    // draw background
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "hsla(210, 70%, 10%)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.player.draw(ctx);
    this.spikes.forEach((s) => s.draw(ctx));
    this.instructions.forEach((inst) => inst.draw(ctx));
    this.spikePlatform.draw(ctx);
    this.floors.forEach((f) => f.draw(ctx));

    // draw score
    ctx.fillStyle = "white";
    ctx.font = "14px monospace";
    ctx.textAlign = "right";
    ctx.fillText(`Score: ${Math.floor(this.#score)}`, this.canvas.width - 10, 20);
    ctx.fillText(`High Score: ${Math.floor(this.#highScore)}`, this.canvas.width - 10, 40);
  }

  #getCameraGoal() {
    /*
     * follow player with camera
     * X - Center of player
     * Y - Floor Bottom offset by camera height - 20% of Player offset from floor
     */
    return {
      x: Math.max(
        0,
        this.player.x - this.camera.width / 2 + this.player.width / 2,
      ),
      y:
        this.#floorProperties.y +
        this.#floorProperties.height -
        this.camera.height -
        (this.#floorProperties.y - this.player.y) * 0.2,
    };
  }

  #generateFloors() {
    // Divide world X into segments of width W
    // Locate player's segment
    // Generate floor in that segment, the segment before, and the segment after
    // A Segment's ID is it's starting X
    const W = this.camera.width;

    const playerSegment = Math.floor(this.player.x / W) * W;
    const segmentBefore = playerSegment - W;
    const segmentAfter = playerSegment + W;
    const segments = [segmentBefore, playerSegment, segmentAfter];

    const floors = segments.map((x) => {
      const floorExists = this.floors.find((f) => f.x === x);
      if (floorExists) return floorExists;
      return new Floor(
        this.camera,
        x,
        this.#floorProperties.y,
        W,
        this.#floorProperties.height,
      );
    });

    this.floors = floors;
  }

  #generateSpikes() {
    // After grace period (#gracePeriodWidth from spike platform), generate spikes
    // #spikesGenX is the X position of the next spike to be generated
    // maxX is the X position of the last spike to be generated

    // clear spikes off screen
    this.spikes = this.spikes.filter(
      (s) => s.x > this.spikePlatform.x + this.spikePlatform.width - 40,
    );

    const maxX = this.player.x + this.camera.width + this.#gracePeriodWidth;
    while (this.#spikesGenX < maxX) {
      const x = this.#spikesGenX;
      const spikeClusterCount = Math.floor(Math.random() * 5) + 1;
      for (let i = 0; i < spikeClusterCount; i++) {
        const spike = new Spike(
          this.camera,
          x + i * Spike.width,
          this.#floorProperties.y - Spike.height,
        );
        this.spikes.push(spike);
      }
      this.#spikesGenX += spikeClusterCount * Spike.width;

      // create space after spikes
      const space =
        Spike.width * 6 + Math.floor(Math.random() * 15) * Spike.width;
      this.#spikesGenX += space;
    }
  }

  #gameOver() {
    localStorage.setItem("highscore", Math.max(this.#score, this.#highScore));
    this.#end = true;
		this.onGameOver();
  }
}

export default Game;
