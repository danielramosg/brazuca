import "./vendor/d3-bundle.js";
import { Bezier } from "./vendor/bezier-js/src/bezier.js";
import { drawCurve, drawSkeleton, drag } from "./bezier-helpers.js";

//- - - - - - - - - - - - - - - - - -
//- - - - Fonctions pour la courbe paramétrée
//- - - - - - - - - - - - - - - - - -
//

// dessin du domaine fondamental avec deux fonctions, domaine : [0,10]

function haut(x) {
  var r = 0;
  if (0 <= x && x <= 1.5) r = x;
  if (1.5 < x && x <= 2.5) r = 1 + 0.5 * (x - 2.5) * (x - 2.5);
  if (2.5 < x && x <= 6.5)
    r =
      1 +
      0.23 * (x - 2.5) * (x - 2.5) -
      0.025 * (x - 2.5) * (x - 2.5) * (x - 2.5); //
  if (6.5 < x && x <= 10) r = 3 * Math.sqrt((20 - 2 * x) / 7);
  return -r;
}

function bas(x) {
  var r = 0;
  if (x < 0) return 0;
  if (0 <= x && x <= 1.5) r = -x;
  if (1.5 < x && x <= 2.5) r = -1 - 0.5 * (x - 2.5) * (x - 2.5);
  if (2.5 < x && x <= 6.5) r = -1;
  if (6.5 < x && x <= 10)
    r = -Math.sqrt(1 - ((x - 6.5) * (x - 6.5)) / (3.5 * 3.5));
  return -r;
}
var h = 3.3;

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
  [100, 0],
  [300 - 100 * Math.sqrt(3), 0],
  [300, 100],
  [300 + 50 * Math.sqrt(3), 50],
  [475, -50],
  [300, -50],
  [125, -50],
  [100, 0],
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

function update() {
  tilectx.clearRect(0, 0, width, height);
  const curves = polyBezier(points);
  for (let i = 0; i < curves.length; i += 1) {
    drawSkeleton(tilectx, curves[i]);
    drawCurve(tilectx, curves[i]);
  }
  //   const curve = new Bezier(points.flat());
  //   drawSkeleton(tilectx, curve);
  //   drawCurve(tilectx, curve);
}

d3.select("#canvasMaker")
  .call(drag, { radius: 20, points: points, update })
  .call(update)
  .node();

export { haut, bas };
