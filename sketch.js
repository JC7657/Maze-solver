let tamanoCelda = 20;
let columnas, filas;
let camino = [];
let usarAnchura = true;

function setup() {
  createCanvas(
    datosLaberinto[0].length * tamanoCelda,
    datosLaberinto.length * tamanoCelda
  );
  columnas = datosLaberinto[0].length;
  filas = datosLaberinto.length;

  let inicio = { x: 1, y: 1 };
  let fin = { x: columnas - 2, y: filas - 2 };

  calcularCamino();

  frameRate(1);

  const boton = document.getElementById("botonCambiarAlgoritmo");
  actualizarBoton(boton);

  boton.addEventListener("click", () => {
    usarAnchura = !usarAnchura;
    calcularCamino();
    actualizarBoton(boton);
  });
}

function calcularCamino() {
  let inicio = { x: 1, y: 1 };
  let fin = { x: columnas - 2, y: filas - 2 };

  camino = usarAnchura
    ? busquedaAnchura(datosLaberinto, inicio, fin)
    : busquedaProfundidad(datosLaberinto, inicio, fin);

  const infoCamino = document.getElementById("infoCamino");
  if (camino.length > 0) {
    infoCamino.textContent = `Longitud ${usarAnchura ? "(BFS)" : "(DFS)"}: ${
      camino.length
    } celdas`;
  } else {
    infoCamino.textContent = `No se encontró camino con ${
      usarAnchura ? "BFS" : "DFS"
    }`;
  }
}

function draw() {
  background(255);

  for (let y = 0; y < filas; y++) {
    for (let x = 0; x < columnas; x++) {
      if (datosLaberinto[y][x] === "#") {
        fill(0);
      } else {
        fill(255);
      }
      stroke(200);
      rect(x * tamanoCelda, y * tamanoCelda, tamanoCelda, tamanoCelda);
    }
  }

  for (let pos of camino) {
    fill(usarAnchura ? "blue" : "red");
    rect(pos.x * tamanoCelda, pos.y * tamanoCelda, tamanoCelda, tamanoCelda);
  }
}

function actualizarBoton(boton) {
  if (usarAnchura) {
    boton.textContent = "BFS";
    boton.classList.add("bfs");
    boton.classList.remove("dfs");
  } else {
    boton.textContent = "DFS";
    boton.classList.add("dfs");
    boton.classList.remove("bfs");
  }
}
