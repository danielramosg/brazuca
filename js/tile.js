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

const points = [
  [0.75 * Math.min(640, width), 80],
  [0.4 * Math.min(640, width), 20],
  [0.15 * Math.min(640, width), 150],
];

const b = new Bezier(points.flat());

drawCurve(tilectx, b);
drawSkeleton(tilectx, b);

function update() {
  const context = tilectx;
  const curve = new Bezier(points.flat());
  // const outline = curve.outline(offset1, offset1, offset2, offset2);
  context.clearRect(0, 0, width, height);
  drawSkeleton(context, curve);
  drawCurve(context, curve);
  // context.strokeStyle = "red";
  // outline.curves.forEach(c => drawCurve(context, c));
}

d3.select("#canvasMaker")
  .call(drag, { radius: 20, points: points, update })
  .call(update)
  .node();

export { haut, bas };
