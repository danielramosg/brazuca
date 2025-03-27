//- - - - - - - - - - - - - - - - - -
//- - - - Algèbre  euclidienne de base
//- - - - - - - - - - - - - - - - - -

function produitScalaire(a, b) {
  var p = 0;
  for (var i = 0; i < 3; i++) {
    p = p + a[i] * b[i];
  }
  return p;
}

//function produitVectoriel(a,b){
//	return([a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]);
//}

function norme(v) {
  return Math.sqrt(produitScalaire(v, v));
}

function distance(a, b) {
  var v = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    v[i] = b[i] - a[i];
  }
  return norme(v);
}

function matriceRotation(v, t) {
  var M = new Array();
  var x = v[0] / norme(v);
  var y = v[1] / norme(v);
  var z = v[2] / norme(v);
  var c = Math.cos(t);
  var s = Math.sin(t);
  M = [
    [c + x * x * (1 - c), x * y * (1 - c) - z * s, x * z * (1 - c) + y * s],
    [y * x * (1 - c) + z * s, c + y * y * (1 - c), y * z * (1 - c) - x * s],
    [z * x * (1 - c) - y * s, z * y * (1 - c) + x * s, c + z * z * (1 - c)],
  ];
  return M;
}

function produitMatriciel(A, B) {
  var rows = A.length;
  var mid = B.length;
  var cols = B[0].length;
  var C = new Array(rows);
  for (var i = 0; i < rows; i++) {
    var vec = new Array(cols);
    for (var j = 0; j < cols; j++) {
      vec[j] = 0;
      for (var k = 0; k < mid; k++) vec[j] += A[i][k] * B[k][j];
    }
    C[i] = vec;
  }
  return C;
}

function produitMV(A, V) {
  // matrice par vecteur
  var rows = A.length;
  var C = new Array(rows);
  for (var i = 0; i < rows; i++) {
    C[i] = produitScalaire(A[i], V);
  }
  return C;
}
