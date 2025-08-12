"use strict";

const mouse = { x: 0, y: 0 };
window.onmousemove = (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

let frameId;
class FlowFieldEffect {
  #ctx;
  #width;
  #height;
  //
  lastTime = 0;
  interval = 1000 / 60;
  timer = 0;
  cellSize = 10;
  gradient;
  radius = 0;
  vr = 0.03;

  //
  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;
    //
    this.#ctx.lineWidth = 0.75;
    this.#createGradient();
    this.#ctx.strokeStyle = this.gradient;
  }

  //
  #createGradient = () => {
    this.gradient = this.#ctx.createLinearGradient(
      0,
      0,
      this.#width,
      this.#height
    );
    this.gradient.addColorStop("0.1", "#ff5c33");
    this.gradient.addColorStop("0.2", "#ff66b3");
    this.gradient.addColorStop("0.4", "#ccccff");
    this.gradient.addColorStop("0.6", "#b3ffff");
    this.gradient.addColorStop("0.8", "#80ff80");
    this.gradient.addColorStop("0.9", "#ffff33");
  };

  //
  #drawLine = (x, y, angle) => {
    let dx = mouse.x - x;
    let dy = mouse.y - y;
    const distance = Math.min((dx * dx + dy * dy) / 10000, 50);
    //
    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);
    this.#ctx.lineTo(
      x + Math.cos(angle) * distance,
      y + Math.sin(angle) * distance
    );
    this.#ctx.stroke();
    this.#ctx.closePath();
  };

  //
  animate = (timeStamp) => {
    cancelAnimationFrame(frameId);
    const deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;

    if (this.timer > this.interval) {
      this.#ctx.clearRect(0, 0, this.#width, this.#height);
      this.radius += this.vr;
      if (Math.abs(this.radius) > 5) this.vr *= -1;

      for (let y = 0; y < this.#height; y += this.cellSize) {
        for (let x = 0; x < this.#width; x += this.cellSize) {
          const angle = (Math.sin(x / 100) + Math.cos(y / 100)) * this.radius;
          this.#drawLine(x, y, angle);
        }
      }
      // this.#drawLine(
      //   this.#width / 2, // + Math.cos(Date.now() / 1) * 100,
      //   this.#height / 2 // + Math.sin(Date.now() / 1) * 100
      // );
      this.timer = 0;
    } else this.timer += deltaTime;

    frameId = requestAnimationFrame(this.animate);
  };
}

const f = () => {
  const canvas = document.getElementById("canvas1");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext("2d");
  const flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
  flowField.animate(new Date().getTime());
};

window.onload = f;
window.onresize = f;
