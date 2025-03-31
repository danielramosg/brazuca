import "./vendor/d3-bundle.js";
import { BezierEditor } from "./bezier-editor.js";

window.updateTileShape = () => {};

const tilecnv = document.getElementById("canvasMaker");

const BE = new BezierEditor(tilecnv);

const createBentTile = (R, nbLignes) => {
  // var theta = 75 * (Math.PI / 180); // (arc) length of the tile
  var theta = (50.5 * (Math.PI / 180) * 10) / 6.5;
  var tuile = new Array(); // coordonnées des points d'une seule tuile

  for (var i = 0; i < nbLignes; i++) {
    const segment = BE.segment(10 * (i / nbLignes)); // [haut, bas] = [min, max]

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
    const segment = BE.segment(i * (10 / N));

    ctx.beginPath();
    ctx.moveTo(ox + (10 * i * 10) / N, oy + 10 * segment[1]);
    ctx.lineTo(ox + (10 * i * 10) / N, oy + 10 * segment[0]);
    ctx.stroke();
  }
};

const draw4FoldFlatTile = (ctx, N, ox, oy) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (let i = 0; i < N; i++) {
    const segment = BE.segment(i * (10 / N));

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
