function busquedaAnchura(laberinto, inicio, fin) {
  let cola = [];
  let visitados = {};
  let caminoDesde = {};

  cola.push(inicio);
  visitados[`${inicio.x},${inicio.y}`] = true;

  while (cola.length > 0) {
    let actual = cola.shift();
    if (actual.x === fin.x && actual.y === fin.y) {
      return reconstruirCamino(caminoDesde, actual);
    }

    for (let [dx, dy] of [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ]) {
      let nx = actual.x + dx;
      let ny = actual.y + dy;

      if (
        nx >= 0 &&
        nx < laberinto[0].length &&
        ny >= 0 &&
        ny < laberinto.length &&
        laberinto[ny][nx] === " " &&
        !visitados[`${nx},${ny}`]
      ) {
        visitados[`${nx},${ny}`] = true;
        caminoDesde[`${nx},${ny}`] = actual;
        cola.push({ x: nx, y: ny });
      }
    }
  }
  return [];
}

function reconstruirCamino(caminoDesde, actual) {
  let camino = [actual];
  while (caminoDesde[`${actual.x},${actual.y}`]) {
    actual = caminoDesde[`${actual.x},${actual.y}`];
    camino.push(actual);
  }
  return camino.reverse();
}
