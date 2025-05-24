function busquedaProfundidad(laberinto, inicio, fin) {
  let pila = [];
  let visitados = {};
  let caminoDesde = {};
  let ordenVisita = [];

  pila.push(inicio);
  visitados[`${inicio.x},${inicio.y}`] = true;
  ordenVisita.push(inicio);

  while (pila.length > 0) {
    let actual = pila.pop();

    if (actual.x === fin.x && actual.y === fin.y) {
      return {
        camino: reconstruirCamino(caminoDesde, actual),
        explorados: ordenVisita,
      };
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
        let vecino = { x: nx, y: ny };
        ordenVisita.push(vecino);
        pila.push(vecino);
      }
    }
  }

  return { camino: [], explorados: ordenVisita };
}
