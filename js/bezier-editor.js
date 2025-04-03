import { Bezier } from "./vendor/bezier-js/src/bezier.js";
import { drawCurve, drawSkeleton, drag } from "./bezier-helpers.js";

class BezierEditor {
  width = 900;
  height = 600;

  points = [
    [0, 0],
    [38, 30],
    [0, 0],
    [91, 67],
    [124, 31],
    [192.79491924311228, 78],
    [339, 168],
    [581, 7],
    [587, -94],
    [299, -69],
    [143, -65],
    [78, -39],
    [72, -91],
    [0, 0],
    [30, -39],
    [0, 0],
  ].map((p) => [p[0], -p[1] + this.height / 2]);

  polyBezier(pts) {
    return [
      new Bezier(pts.slice(0, 4).flat()),
      new Bezier(pts.slice(3, 7).flat()),
      new Bezier(pts.slice(6, 10).flat()),
      new Bezier(pts.slice(9, 13).flat()),
      new Bezier(pts.slice(12, 16).flat()),
    ];
  }

  update() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const k = 1090;
    this.ctx.filter = "opacity(30%)";
    this.ctx.drawImage(this.bgImage, -k / 2, this.height / 2 - k / 2, k, k);
    this.ctx.filter = "none";

    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height / 2);
    this.ctx.lineTo(((Math.PI / 2) * 1) / this.scale, this.height / 2);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(((Math.PI / 2) * 1) / this.scale, this.height / 2 - 5);
    this.ctx.lineTo(((Math.PI / 2) * 1) / this.scale, this.height / 2 + 5);
    this.ctx.stroke();

    this.ctx.font = "30px serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    this.ctx.fillText(
      "R𝜋/2",
      ((Math.PI / 2) * 1) / this.scale,
      this.height / 2 + 5
    );

    this.curves = this.polyBezier(this.points);

    for (let i = 0; i < this.curves.length; i += 1) {
      drawSkeleton(this.ctx, this.curves[i]);
      drawCurve(this.ctx, this.curves[i]);
    }

    window.updateTileShape();
  }

  constructor(cnv) {
    cnv.width = this.width;
    cnv.height = this.height;
    this.scale = (Math.PI * 3) / 4 / this.width; // the width of the diagram corresponds to pi/2 radians.

    this.ctx = cnv.getContext("2d");

    this.curves = this.polyBezier(this.points);

    window.exportPoints = () => {
      console.log(this.points.map((p) => [p[0], -p[1] + this.height / 2]));
    };

    this.bgImage = document.createElement("img");
    this.bgImage.width = cnv.height;
    this.bgImage.height = cnv.height;
    this.bgImage.src = "img/brazuca_tile.png";
    document.body.appendChild(this.bgImage);

    window.onload = () => this.update();

    d3.select("#canvasMaker").call(drag, {
      radius: 20,
      points: this.points,
      update: this.update.bind(this),
    });
  }

  /** A vertical segment of the tile.
   * Domain of the function: pi/2
   */
  segment(X) {
    // X in radians
    const x = X / this.scale; // x in pixels
    const intersections = [];

    this.curves.forEach((curve, i) => {
      const ys = curve
        .intersects({
          p1: { x: x, y: 0 },
          p2: { x: x, y: this.height },
        })
        .map((t) => curve.get(t).y - this.height / 2);

      if (ys.length) {
        intersections.push(...ys);
      }
      // console.log(X, intersections);
    });
    if (intersections.length > 0) {
      const m = Math.min(...intersections);
      const M = Math.max(...intersections);

      return [m, M].map((x) => x * this.scale);
    }
    return null;
  }
}

export { BezierEditor };
