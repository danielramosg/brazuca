import "./vendor/d3-bundle.js";
import { Bezier } from "./vendor/bezier-js/src/bezier.js";
import { drawCurve, drawSkeleton, drag } from "./bezier-helpers.js";

//- - - - - - - - - - - - - - - - - -
//- - - - Fonctions pour la courbe paramétrée
//- - - - - - - - - - - - - - - - - -
//

// dessin du domaine fondamental avec deux fonctions, domaine : [0,10]

// function haut(x) {
//   var r = 0;
//   if (0 <= x && x <= 1.5) r = x;
//   if (1.5 < x && x <= 2.5) r = 1 + 0.5 * (x - 2.5) * (x - 2.5);
//   if (2.5 < x && x <= 6.5)
//     r =
//       1 +
//       0.23 * (x - 2.5) * (x - 2.5) -
//       0.025 * (x - 2.5) * (x - 2.5) * (x - 2.5); //
//   if (6.5 < x && x <= 10) r = 3 * Math.sqrt((20 - 2 * x) / 7);
//   return -r;
// }

// function bas(x) {
//   var r = 0;
//   if (x < 0) return 0;
//   if (0 <= x && x <= 1.5) r = -x;
//   if (1.5 < x && x <= 2.5) r = -1 - 0.5 * (x - 2.5) * (x - 2.5);
//   if (2.5 < x && x <= 6.5) r = -1;
//   if (6.5 < x && x <= 10)
//     r = -Math.sqrt(1 - ((x - 6.5) * (x - 6.5)) / (3.5 * 3.5));
//   return -r;
// }
// var h = 3.3;

// function haut(x) {
//   var r = 0;
//   if (x < 0) return 0;
//   if (x < 1.5) return x;
//   if (x < 4.5) return 1.5;
//   if (x < 6.5) return (x - 6.5) / Math.sqrt(3) + h + Math.sin((x - 6.5) / 3);
//   if (x < 10)
//     return -(x - 6.5) / Math.sqrt(3) + h + 0.25 * Math.sin((x - 6.5) / 3);
//   return 0;
// }

// function bas(x) {
//   var r = 0;
//   if (x < 0) return 0;
//   if (x < 1.5) return -x;
//   if (x < 10) return -(h / 3 + 0.25 * Math.sin((x - 1.5) / 3));
//   //   if (x < 10) return -(x - 6.5) / Math.sqrt(3) + h;
//   return 0;
// }

const tilecnv = document.getElementById("canvasMaker");
const tilectx = tilecnv.getContext("2d");

const width = tilecnv.width;
const height = tilecnv.height;
// tilectx.transform(1, 0, 0, -1, 0, height / 2);

const points = [
  [0, 0],
  [50, 50],
  [0, 0],
  [50, 50],
  [90, 10],
  [300 - 100 * Math.sqrt(3), 0],
  [300, 100],
  [300 + 50 * Math.sqrt(3), 50],
  [475, -50],
  [300, -50],
  [125, -50],
  [90, -10],
  [50, -50],
  [0, 0],
  [50, -50],
  [0, 0],
].map((p) => [p[0], -p[1] + 200]);

// const b = new Bezier(points.flat());
// drawCurve(tilectx, b);
// drawSkeleton(tilectx, b);

const polyBezier = (pts) => [
  new Bezier(pts.slice(0, 4).flat()),
  new Bezier(pts.slice(3, 7).flat()),
  new Bezier(pts.slice(6, 10).flat()),
  new Bezier(pts.slice(9, 13).flat()),
  new Bezier(pts.slice(12, 16).flat()),
];

let curves = polyBezier(points);

window.updateTileShape = () => {};

function update() {
  tilectx.clearRect(0, 0, width, height);
  curves = polyBezier(points);
  for (let i = 0; i < curves.length; i += 1) {
    drawSkeleton(tilectx, curves[i]);
    drawCurve(tilectx, curves[i]);
  }
  //   const curve = new Bezier(points.flat());
  //   drawSkeleton(tilectx, curve);
  //   drawCurve(tilectx, curve);
  window.updateTileShape();
}

d3.select("#canvasMaker")
  .call(drag, { radius: 20, points: points, update })
  .call(update)
  .node();

const tileSegment = (X) => {
  //   console.log(X);
  const x = 40 * X;
  const intersections = [];

  curves.forEach((curve, i) => {
    const ys = curve
      .intersects({
        p1: { x: x, y: 0 },
        p2: { x: x, y: height },
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
};

const createBentTile = (R, nbLignes) => {
  // var theta = 75 * (Math.PI / 180); // (arc) length of the tile
  var theta = (50.5 * (Math.PI / 180) * 10) / 6.5;
  var tuile = new Array(); // coordonnées des points d'une seule tuile

  for (var i = 0; i < nbLignes; i++) {
    const segment = tileSegment(10 * (i / nbLignes)); // [haut, bas] = [min, max]

    tuile.push([
      R * Math.cos(theta * (i / nbLignes)),
      R * Math.sin(theta * (i / nbLignes)),
      segment[0] * ((R * theta) / 10),
    ]);
    tuile.push([
      R * Math.cos(theta * (i / nbLignes)),
      R * Math.sin(theta * (i / nbLignes)),
      segment[1] * ((R * theta) / 10),
    ]);
  }
  return tuile;
};

const drawFlatTile = (ctx, N, ox, oy) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let i = 0; i < N; i++) {
    const segment = tileSegment(i * (10 / N));

    ctx.beginPath();
    ctx.moveTo(ox + (10 * i * 10) / N, oy + 10 * segment[1]);
    ctx.lineTo(ox + (10 * i * 10) / N, oy + 10 * segment[0]);
    ctx.stroke();
  }
};

const draw4FoldFlatTile = (ctx, N, ox, oy) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (let i = 0; i < N; i++) {
    const segment = tileSegment(i * (10 / N));

    ctx.beginPath();
    ctx.moveTo(ox + (10 * i * 10) / N, oy + 10 * segment[1]);
    ctx.lineTo(ox + (10 * i * 10) / N, oy + 10 * segment[0]);

    ctx.moveTo(oy - 10 * segment[1], ox + (10 * i * 10) / N);
    ctx.lineTo(oy - 10 * segment[0], ox + (10 * i * 10) / N);

    ctx.moveTo(ox - (10 * i * 10) / N, oy - 10 * segment[1]);
    ctx.lineTo(ox - (10 * i * 10) / N, oy - 10 * segment[0]);

    ctx.moveTo(oy + 10 * segment[1], ox - (10 * i * 10) / N);
    ctx.lineTo(oy + 10 * segment[0], ox - (10 * i * 10) / N);

    ctx.stroke();
  }
};

export { createBentTile, drawFlatTile, draw4FoldFlatTile };
