function reconstruirCamino(caminoDesde, actual) {
  let camino = [actual];
  while (caminoDesde[`${actual.x},${actual.y}`]) {
    actual = caminoDesde[`${actual.x},${actual.y}`];
    camino.push(actual);
  }
  return camino.reverse();
}
