import {
  matriceRotation,
  produitMatriciel,
  produitMV,
  produitScalaire,
  cubeGroup,
} from "./algebra.js";
import { createBentTile, draw4FoldFlatTile, drawFlatTile } from "./tile.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");
const canvas3 = document.getElementById("canvas3");
const ctx3 = canvas3.getContext("2d");

// symmetries, starting with an initial rotation
const G = cubeGroup.map((g) =>
  produitMatriciel(g, matriceRotation([1, 0, 0], -(Math.PI / 4) + 0.55))
);

var R = 1.6; //rayon
var nbLignes = 80; //nombre de lignes à dessiner

let tuile, sommets;

// initialisation du ballon en appliquant à la tuile les 24 rotations successivement
const createVertices = () => {
  const vertices = new Array();
  for (var j = 0; j < G.length; j++) {
    for (var i = 0; i < 2 * nbLignes; i++) {
      vertices.push(produitMV(G[j], tuile[i]));
    }
  }
  return vertices;
};

const updateTileShape = () => {
  tuile = createBentTile(R, nbLignes); // initialisation de la tuile fondamentale
  sommets = createVertices(); // coordonnées des points à dessiner

  drawFlatTile(ctx2, 60, 20, 50);
  draw4FoldFlatTile(ctx3, 40, 120, 120);
};

updateTileShape();
window.updateTileShape = updateTileShape;

//- - - - - - - - - - - - - - - - - -
//- - - - calculs et affichage
//- - - - - - - - - - - - - - - - - -

var projections = new Array(); //projections 2d des points

function calculerProjections() {
  for (var i = 0; i < sommets.length; i++) {
    projections[i] = [
      produitScalaire(matriceProj[0], sommets[i]) * zoom,
      produitScalaire(matriceProj[1], sommets[i]) * zoom + centreX,
      produitScalaire(matriceProj[2], sommets[i]) * zoom + centreY,
    ];
  }
}

// dessine une arete entre le sommet p et le sommet q dans une certaine couleur
// p et q sont des indices du tableau "sommets"

function dessinerAreteEntre(p, q, couleur) {
  var z;
  ctx.strokeStyle = couleur;
  z = (projections[p][0] + projections[q][0]) / 2;
  if (z > 0) {
    ctx.lineWidth = 0.007 * (z + 100);
    // opacité en fonction de la profondeur pour mieux voir
    ctx.beginPath();
    ctx.moveTo(projections[p][1], projections[p][2]);
    ctx.lineTo(projections[q][1], projections[q][2]);
    ctx.stroke();
  }
}

function dessinerAretes() {
  var couleur;
  for (var n = 0; n < sommets.length; n = n + 2) {
    if (Math.floor(n / (8 * nbLignes)) % 3 == 0) couleur = "rgb(0,50,200)";
    else if (Math.floor(n / (8 * nbLignes)) % 3 == 1) couleur = "rgb(50,150,0)";
    else if (Math.floor(n / (8 * nbLignes)) % 3 == 2) couleur = "rgb(200,0,50)";
    else couleur = "rgb(0,0,0)";
    dessinerAreteEntre(n, n + 1, couleur);
  }
}

function effacer() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//- - - - - - - - - - - - - - - - - -
//- - - - Initialisation des variables
//- - - - - - - - - - - - - - - - - -

ctx.lineCap = "round";
ctx.lineJoin = "round";

const centreX = canvas.width / 2;
const centreY = canvas.height / 2;
const zoom = 160;

//- - - - - - - - - - - - - - - - - -
//- - - - controle de l'animation
//- - - - - - - - - - - - - - - - - -

const axeRotation = [1.5, 0.1, 1]; // axe de la caméra
const angle = 0.01; //variation angulaire de la caméra autour de son axe
let matriceProj = new Array(); // matrice de projection courante qui correspond à la caméra
const t = 30; // 30 millisecondes de raffraichissement pour l'animation

function mettreAJour() {
  effacer(); //on efface la scène
  matriceProj = matriceRotation(axeRotation, (angle * performance.now()) / t); //on calcule l'orientation de la caméra
  calculerProjections(); //on calcule les coordonnées des points dans le repère de la caméra
  dessinerAretes(); //on dessine les droites
  requestAnimationFrame(mettreAJour);
}

mettreAJour();
