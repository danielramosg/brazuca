import { Bezier } from "./vendor/bezier-js/src/bezier.js";
import { drawCurve, drawSkeleton, drag } from "./bezier-helpers.js";

class BezierEditor {
  points = [
    [0, 0],
    [45, 25],
    [0, 0],
    [90, 50],
    [150, 50],
    [192.79491924311228, 78],
    [260, 136],
    [449.60254037844385, 40],
    [476, -65],
    [261, -60],
    [125, -64],
    [50, -30],
    [50, -90],
    [0, 0],
    [25, -45],
    [0, 0],
  ].map((p) => [p[0], -p[1] + 200]);

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
    const k = 830;
    this.ctx.drawImage(this.bgImage, -k / 2, this.height / 2 - k / 2, k, k);

    this.curves = this.polyBezier(this.points);

    for (let i = 0; i < this.curves.length; i += 1) {
      drawSkeleton(this.ctx, this.curves[i]);
      drawCurve(this.ctx, this.curves[i]);
    }

    window.updateTileShape();
  }

  constructor(cnv) {
    this.width = cnv.width;
    this.height = cnv.height;
    this.ctx = cnv.getContext("2d");

    this.curves = this.polyBezier(this.points);

    window.exportPoints = () => {
      console.log(this.points.map((p) => [p[0], -p[1] + 200]));
    };

    this.bgImage = document.createElement("img");
    this.bgImage.width = 400;
    this.bgImage.height = 400;
    this.bgImage.src = "../img/brazuca_patron.png";
    document.body.appendChild(this.bgImage);

    window.onload = () => this.update();

    d3.select("#canvasMaker").call(drag, {
      radius: 20,
      points: this.points,
      update: this.update.bind(this),
    });
  }

  segment(X) {
    //   console.log(X);
    const x = 40 * X;
    const intersections = [];

    this.curves.forEach((curve, i) => {
      const ys = curve
        .intersects({
          p1: { x: x, y: 0 },
          p2: { x: x, y: this.height },
        })
        .map((t) => curve.get(t).y - 200);

      if (ys.length) {
        intersections.push(...ys);
      }
      // console.log(X, intersections);
    });
    if (intersections.length > 0) {
      const m = Math.min(...intersections);
      const M = Math.max(...intersections);
      return [m / 40, M / 40];
    }
    return [0, 0];
  }
}

export { BezierEditor };
