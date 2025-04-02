import "./vendor/d3-bundle.js";
import { BezierEditor } from "./bezier-editor.js";

window.updateTileShape = () => {};

const tilecnv = document.getElementById("canvasMaker");

const BE = new BezierEditor(tilecnv);

const createBentTile = (R, nbLignes) => {
  // var theta = 75 * (Math.PI / 180); // (arc) length of the tile
  // var theta = (50.5 * (Math.PI / 180) * 10) / 6.5;
  const L = Math.PI / 2; //arc to be drawn (in radians), corresponding to one quarter circle
  var tuile = new Array(); // coordonnées des points d'une seule tuile

  for (var i = 0; i < nbLignes; i++) {
    const segment = BE.segment(L * (i / nbLignes)); // [haut, bas] = [min, max]

    if (segment) {
      const x = R * Math.cos(L * (i / nbLignes));
      const y = R * Math.sin(L * (i / nbLignes));
      const z0 = R * segment[0];
      const z1 = R * segment[1];

      tuile.push([
        [x, y, z0],
        [x, y, z1],
      ]);
    }
  }
  return tuile;
};

const drawFlatTile = (ctx, N, ox, oy) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const L = Math.PI / 2; //arc to be drawn (in radians), corresponding to one quarter circle
  const sf = 70; // scale factor

  for (let i = 0; i < N; i++) {
    const segment = BE.segment(L * (i / N));
    if (segment) {
      ctx.beginPath();
      ctx.moveTo(ox + sf * L * (i / N), oy + sf * segment[1]);
      ctx.lineTo(ox + sf * L * (i / N), oy + sf * segment[0]);
      ctx.stroke();
    }
  }
};

const draw4FoldFlatTile = (ctx, N, ox, oy) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const L = Math.PI / 2; //arc to be drawn (in radians), corresponding to one quarter circle
  const sf = 70; // scale factor

  for (let i = 0; i < N; i++) {
    const segment = BE.segment(L * (i / N));
    if (segment) {
      ctx.beginPath();
      ctx.moveTo(ox + sf * L * (i / N), oy + sf * segment[1]);
      ctx.lineTo(ox + sf * L * (i / N), oy + sf * segment[0]);

      ctx.moveTo(oy - sf * segment[1], ox + sf * L * (i / N));
      ctx.lineTo(oy - sf * segment[0], ox + sf * L * (i / N));

      ctx.moveTo(ox - sf * L * (i / N), oy - sf * segment[1]);
      ctx.lineTo(ox - sf * L * (i / N), oy - sf * segment[0]);

      ctx.moveTo(oy + sf * segment[1], ox - sf * L * (i / N));
      ctx.lineTo(oy + sf * segment[0], ox - sf * L * (i / N));

      ctx.stroke();
    }
  }
};

export { createBentTile, drawFlatTile, draw4FoldFlatTile };
