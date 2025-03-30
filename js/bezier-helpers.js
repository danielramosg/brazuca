/* https://observablehq.com/@mbostock/hello-bezier-js */
import "./vendor/d3-bundle.js"; // https://stackoverflow.com/questions/62805412/every-imported-function-comes-up-as-undefined-though-the-import-is-clearly-be

const clamp = (x, min, max) => Math.min(Math.max(x, min), max);

function drag(selection, { points, radius, update }) {
  function dragsubject(event) {
    console.log([event.x, event.y]);
    let S = null;
    let R = radius;
    for (const p of points) {
      let r = Math.hypot(event.x - p[0], event.y - p[1]);
      if (r < R) (R = r), (S = p);
    }
    return S ? { x: S[0], y: S[1], point: S } : { x: null, y: null, S: null };
  }

  function dragged(event) {
    if (event.subject.point) {
      event.subject.point[0] = clamp(event.x, 0, selection.node().width);
      event.subject.point[1] = clamp(event.y, 0, selection.node().height);
    }
  }

  selection.call(
    d3
      .drag()
      .subject(dragsubject)
      .container(function container() {
        return this;
      })
      .on("drag", dragged)
      .on("start.update drag.update end.update", update)
  );
}

function drawLine(ctx, p1, p2, offset) {
  offset = offset || { x: 0, y: 0 };
  var ox = offset.x;
  var oy = offset.y;
  ctx.beginPath();
  ctx.moveTo(p1.x + ox, p1.y + oy);
  ctx.lineTo(p2.x + ox, p2.y + oy);
  ctx.stroke();
}

function drawPoint(ctx, p, offset) {
  offset = offset || { x: 0, y: 0 };
  var ox = offset.x;
  var oy = offset.y;
  ctx.beginPath();
  ctx.arc(p.x + ox, p.y + oy, 5, 0, 2 * Math.PI);
  ctx.stroke();
}

function drawCircle(ctx, p, r, offset) {
  offset = offset || { x: 0, y: 0 };
  var ox = offset.x;
  var oy = offset.y;
  ctx.beginPath();
  ctx.arc(p.x + ox, p.y + oy, r, 0, 2 * Math.PI);
  ctx.stroke();
}

function drawPoints(ctx, points, offset) {
  offset = offset || { x: 0, y: 0 };
  points.forEach((p) => drawCircle(ctx, p, 3, offset));
}

function drawSkeleton(ctx, curve, offset = { x: 0, y: 0 }, nocoords) {
  var pts = curve.points;
  ctx.strokeStyle = "lightgrey";
  drawLine(ctx, pts[0], pts[1], offset);
  if (pts.length === 3) drawLine(ctx, pts[1], pts[2], offset);
  else drawLine(ctx, pts[2], pts[3], offset);
  ctx.strokeStyle = "black";
  if (!nocoords) drawPoints(ctx, pts, offset);
}

function drawCurve(ctx, curve, offset) {
  offset = offset || { x: 0, y: 0 };
  var ox = offset.x;
  var oy = offset.y;
  ctx.beginPath();
  var p = curve.points;
  ctx.moveTo(p[0].x + ox, p[0].y + oy);
  if (p.length === 3) {
    ctx.quadraticCurveTo(p[1].x + ox, p[1].y + oy, p[2].x + ox, p[2].y + oy);
  }
  if (p.length === 4) {
    ctx.bezierCurveTo(
      p[1].x + ox,
      p[1].y + oy,
      p[2].x + ox,
      p[2].y + oy,
      p[3].x + ox,
      p[3].y + oy
    );
  }
  ctx.stroke();
  ctx.closePath();
}

export { drawSkeleton, drawCurve, drag };
