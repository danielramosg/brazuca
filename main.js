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
  return r;
}

function bas(x) {
  var r = 0;
  if (x < 0) return 0;
  if (0 <= x && x <= 1.5) r = -x;
  if (1.5 < x && x <= 2.5) r = -1 - 0.5 * (x - 2.5) * (x - 2.5);
  if (2.5 < x && x <= 6.5) r = -1;
  if (6.5 < x && x <= 10)
    r = -Math.sqrt(1 - ((x - 6.5) * (x - 6.5)) / (3.5 * 3.5));
  return r;
}

var theta = (20 * 3.1416) / 49;
var R = 0.78; //rayon

var nbLignes = 20; //nombre de lignes à dessiner

var tuile = new Array(); // coordonnées des points d'une seule tuile

// initialisation de la tuile fondamentale
for (var i = 0; i < nbLignes; i++) {
  tuile.push([
    R * Math.cos((theta * i) / nbLignes),
    R * Math.sin((theta * i) / nbLignes),
    haut((10 * i) / nbLignes) / 10,
  ]);
  tuile.push([
    R * Math.cos((theta * i) / nbLignes),
    R * Math.sin((theta * i) / nbLignes),
    bas((10 * i) / nbLignes) / 10,
  ]);
}

// le tableau G contient 24 matrices de rotation
let G = new Array();
G[0] = matriceRotation([1, 0, 0], Math.PI / 4 - 0.55);
// G[0] = matriceRotation([1, 0, 0], 0);

for (let i = 1; i < 4; i++)
  G.push(produitMatriciel(matriceRotation([1, 0, 0], Math.PI / 2), G[i - 1]));
for (let i = 0; i < 4; i++)
  G.push(produitMatriciel(matriceRotation([0, 0, 1], Math.PI / 2), G[i]));
for (let i = 0; i < 4; i++)
  G.push(produitMatriciel(matriceRotation([0, 1, 0], Math.PI / 2), G[i]));
for (let i = 0; i < 4; i++)
  G.push(produitMatriciel(matriceRotation([0, 1, 0], Math.PI), G[i]));
for (let i = 0; i < 4; i++)
  G.push(produitMatriciel(matriceRotation([0, 0, 1], -Math.PI / 2), G[i]));
for (let i = 0; i < 4; i++)
  G.push(produitMatriciel(matriceRotation([0, 1, 0], -Math.PI / 2), G[i]));
// rentrer les déplacements dans ce sens facilie le coloriage, après ?

var sommets = new Array(); // coordonnées des points à dessiner

// initialisation du ballon en appliquant à la tuile les 24 rotations successivement
for (var j = 0; j < G.length; j++) {
  for (var i = 0; i < 2 * nbLignes; i++) {
    sommets.push(produitMV(G[j], tuile[i]));
  }
}

//- - - - - - - - - - - - - - - - - -
//- - - - déclaration des variables
//- - - - - - - - - - - - - - - - - -

var t = 30; // 30 millisecondes de raffraichissement pour l'animation

var axeRotation = new Array(); // axe de la caméra
var angle; //variation angulaire de la caméra autour de son axe
var Id = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

var projections = new Array(); //projections 2d des points

var matriceProj = new Array(); // matrice de projection courante qui correspond à la caméra

var zoom, centreX, centreY; // pour le dessin

//- - - - - - - - - - - - - - - - - -
//- - - - calculs et affichage
//- - - - - - - - - - - - - - - - - -

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
  ctx.lineWidth = 0.007 * (z + 100);
  // opacité en fonction de la profondeur pour mieux voir
  ctx.beginPath();
  ctx.moveTo(projections[p][1], projections[p][2]);
  ctx.lineTo(projections[q][1], projections[q][2]);
  ctx.stroke();
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
  ctx.clearRect(0, 0, 400, 400);
}

//- - - - - - - - - - - - - - - - - -
//- - - - Fonctions d'initialisation des variables
//- - - - - - - - - - - - - - - - - -

function commencer() {
  canvas = document.getElementById("canvas");
  if (typeof canvas.getContext != "function") {
    alert("Votre navigateur ne supporte pas la fonction 'canvas'");
  }
  ctx = canvas.getContext("2d");
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // initialisation des valeurs numériques:
  axeRotation = [1.5, 0.1, 1];
  matriceProj = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  angle = 0.01;
  zoom = 100;
  centreX = 200;
  centreY = 200;
  nbLignes = 20;

  //commencer l'animation:
  mettreAJour();
}

//- - - - - - - - - - - - - - - - - -
//- - - - controle de l'animation
//- - - - - - - - - - - - - - - - - -

function mettreAJour() {
  effacer(); //on efface la scène

  //on calcule l'orientation de la caméra
  matriceProj = produitMatriciel(
    matriceProj,
    matriceRotation(axeRotation, angle)
  );

  //on calcule les coordonnées des points dans le repère de la caméra
  calculerProjections();

  //on dessine les droites
  dessinerAretes();

  //on recommence dans t millisecondes
  window.setTimeout(mettreAJour, t);
}
