let tamanoCelda = 20;
let columnas, filas;
let camino = [];
let usarAnchura = true;
let explorados = [];
let paso = 0;

// Valor inicial de velocidad
let velocidad = 5;

function setup() {
  let cnv = createCanvas(
    datosLaberinto[0].length * tamanoCelda,
    datosLaberinto.length * tamanoCelda
  );
  cnv.parent("canvasContainer"); // Asegura que el canvas esté dentro del contenedor

  columnas = datosLaberinto[0].length;
  filas = datosLaberinto.length;

  // Obtiene referencias al slider y al label
  const slider = document.getElementById("sliderVelocidad");
  const labelVel = document.getElementById("valorVelocidad");

  // Actualiza 'velocidad' cuando el usuario mueve el slider
  slider.addEventListener("input", () => {
    velocidad = parseInt(slider.value, 10);
    labelVel.textContent = slider.value;
  });

  // Botón de alternar algoritmo
  const boton = document.getElementById("botonCambiarAlgoritmo");
  boton.addEventListener("click", () => {
    usarAnchura = !usarAnchura;
    calcularCamino();
    actualizarBoton(boton);
  });
  actualizarBoton(boton);

  calcularCamino();
  frameRate(30);
}

function calcularCamino() {
  let inicio = { x: 1, y: 1 };
  let fin = { x: columnas - 2, y: filas - 2 };

  let resultado = usarAnchura
    ? busquedaAnchura(datosLaberinto, inicio, fin)
    : busquedaProfundidad(datosLaberinto, inicio, fin);

  camino = resultado.camino;
  explorados = resultado.explorados;
  paso = 0;

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

  // Dibuja laberinto completo
  for (let y = 0; y < filas; y++) {
    for (let x = 0; x < columnas; x++) {
      fill(datosLaberinto[y][x] === "#" ? 0 : 255);
      stroke(200);
      rect(x * tamanoCelda, y * tamanoCelda, tamanoCelda, tamanoCelda);
    }
  }

  // Dibuja exploración
  for (let i = 0; i < paso && i < explorados.length; i++) {
    let pos = explorados[i];
    fill(usarAnchura ? "lightblue" : "pink");
    rect(pos.x * tamanoCelda, pos.y * tamanoCelda, tamanoCelda, tamanoCelda);
  }

  // Avanza la animación
  if (paso < explorados.length) {
    paso += velocidad;
  } else {
    // Una vez terminada la exploración, muestra el camino final
    for (let pos of camino) {
      fill(usarAnchura ? "blue" : "red");
      rect(pos.x * tamanoCelda, pos.y * tamanoCelda, tamanoCelda, tamanoCelda);
    }
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
