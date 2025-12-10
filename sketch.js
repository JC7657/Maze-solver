let tamanoCelda = 12;
let columnas, filas;
let camino = [];
let usarAnchura = true;
let explorados = [];
let paso = 0;
let totalCaminables = 0; // Total de celdas blancas en el laberinto
let datosLaberintoActual = []; // Laberinto actual (puede ser el original o generado)

// Estado de la aplicación
let estado = 'listo'; // 'listo', 'ejecutando', 'pausado', 'completado'
let velocidad = 5;
let animacionId = null;

// Elementos del DOM
let botonStart, botonPause, botonReset, botonRandomize;
let botonBFS, botonDFS, botonHelp;
let sliderVelocidad, valorVelocidad;
let estadoActual, algoritmoActual, longitudCamino, nodosExplorados;
let helpPopup, helpOverlay;

function setup() {
  // Inicializar con el laberinto original
  datosLaberintoActual = [...datosLaberinto];
  
  let cnv = createCanvas(
    datosLaberintoActual[0].length * tamanoCelda,
    datosLaberintoActual.length * tamanoCelda
  );
  cnv.parent("canvasContainer");

  columnas = datosLaberintoActual[0].length;
  filas = datosLaberintoActual.length;

  // Calcular total de celdas caminables
  calcularTotalCaminables();

  // Obtener referencias a los elementos del DOM
  inicializarElementosDOM();
  
  // Configurar event listeners
  configurarEventListeners();
  
  // Inicializar estado
  actualizarEstadoUI();
  
  frameRate(30);
}

function inicializarElementosDOM() {
  // Botones de control
  botonStart = document.getElementById("startBtn");
  botonPause = document.getElementById("pauseBtn");
  botonReset = document.getElementById("resetBtn");
  botonRandomize = document.getElementById("randomizeBtn");
  
  // Botones de algoritmo
  botonBFS = document.getElementById("bfsBtn");
  botonDFS = document.getElementById("dfsBtn");
  botonHelp = document.getElementById("helpBtn");
  
  // Control de velocidad
  sliderVelocidad = document.getElementById("sliderVelocidad");
  valorVelocidad = document.getElementById("valorVelocidad");
  
  // Popup de ayuda
  helpPopup = document.getElementById("helpPopup");
  helpOverlay = document.getElementById("helpOverlay");
  
  // Estadísticas
  estadoActual = document.getElementById("estadoActual");
  algoritmoActual = document.getElementById("algoritmoActual");
  longitudCamino = document.getElementById("longitudCamino");
  nodosExplorados = document.getElementById("nodosExplorados");
}

function configurarEventListeners() {
  // Botones de animación
  botonStart.addEventListener("click", iniciarAnimacion);
  botonPause.addEventListener("click", pausarAnimacion);
  botonReset.addEventListener("click", reiniciarAnimacion);
  botonRandomize.addEventListener("click", generarNuevoLaberinto);
  
  // Botones de algoritmo
  botonBFS.addEventListener("click", () => seleccionarAlgoritmo(true));
  botonDFS.addEventListener("click", () => seleccionarAlgoritmo(false));
  
  // Botón de ayuda
  botonHelp.addEventListener("click", mostrarAyuda);
  closeHelp.addEventListener("click", ocultarAyuda);
  helpOverlay.addEventListener("click", ocultarAyuda);
  
  // Control de velocidad
  sliderVelocidad.addEventListener("input", () => {
    velocidad = parseInt(sliderVelocidad.value, 10);
    valorVelocidad.textContent = sliderVelocidad.value;
  });
}

function seleccionarAlgoritmo(bfs) {
  if (estado === 'ejecutando') {
    return; // No cambiar algoritmo durante ejecución
  }
  
  usarAnchura = bfs;
  
  // Actualizar botones
  if (bfs) {
    botonBFS.classList.add('active');
    botonDFS.classList.remove('active');
  } else {
    botonDFS.classList.add('active');
    botonBFS.classList.remove('active');
  }
  
  // Reiniciar con nuevo algoritmo
  reiniciarAnimacion();
}

function iniciarAnimacion() {
  if (estado === 'listo') {
    // Si no hay camino calculado, calcularlo
    if (camino.length === 0 && explorados.length === 0) {
      calcularCamino();
    }
    
    estado = 'ejecutando';
    actualizarEstadoUI();
  } else if (estado === 'pausado') {
    estado = 'ejecutando';
    actualizarEstadoUI();
  } else if (estado === 'completado') {
    // Si está completado, reiniciar completamente como el botón de reset
    reiniciarAnimacion();
    // Y empezar nueva animación automáticamente
    setTimeout(() => {
      estado = 'ejecutando';
      actualizarEstadoUI();
    }, 100);
  }
}

function pausarAnimacion() {
  if (estado === 'ejecutando') {
    estado = 'pausado';
    actualizarEstadoUI();
  }
}

function reiniciarAnimacion() {
  estado = 'listo';
  paso = 0;
  camino = [];
  explorados = [];
  calcularCamino();
  actualizarEstadoUI();
}

function calcularTotalCaminables() {
  totalCaminables = 0;
  for (let y = 0; y < filas; y++) {
    for (let x = 0; x < columnas; x++) {
      if (datosLaberintoActual[y][x] === " ") {
        totalCaminables++;
      }
    }
  }
}

function generarNuevoLaberinto() {
  if (estado === 'ejecutando') {
    return; // No generar durante ejecución
  }
  
  // Mostrar estado de generación
  estado = 'generando';
  actualizarEstadoUI();
  
  // Usar las EXACTAS dimensiones del laberinto original: 65x61
  const anchoOriginal = 65;
  const altoOriginal = 61;
  
  console.log(`Generando laberinto de ${anchoOriginal}x${altoOriginal} (exactamente igual que original)`);
  
  // Generar nuevo laberinto con las mismas dimensiones exactas
  setTimeout(() => {
    try {
      datosLaberintoActual = generarLaberintoAleatorio(anchoOriginal, altoOriginal);
      
      // Verificar que el laberinto generado sea válido
      if (!datosLaberintoActual || datosLaberintoActual.length === 0) {
        throw new Error('Laberinto inválido generado');
      }
      
      // Verificar que tenga espacios (caminos)
      let tieneEspacios = false;
      for (let fila of datosLaberintoActual) {
        if (fila.includes(' ')) {
          tieneEspacios = true;
          break;
        }
      }
      
      if (!tieneEspacios) {
        throw new Error('Laberinto sin caminos generado');
      }
      
      console.log('Laberinto generado exitosamente con dimensiones:', {
        ancho: datosLaberintoActual[0].length,
        alto: datosLaberintoActual.length
      });
      
      // Actualizar dimensiones (deben ser exactamente 65x61)
      columnas = datosLaberintoActual[0].length;
      filas = datosLaberintoActual.length;
      
      // Redimensionar canvas si es necesario
      resizeCanvas(columnas * tamanoCelda, filas * tamanoCelda);
      
      // Recalcular total de celdas caminables para el nuevo laberinto
      calcularTotalCaminables();
      
      // Reiniciar animación con nuevo laberinto
      reiniciarAnimacion();
      
      estado = 'listo';
      actualizarEstadoUI();
    } catch (error) {
      console.error('Error generando laberinto:', error);
      console.log('Usando laberinto original como fallback');
      
      // Usar laberinto original como fallback
      datosLaberintoActual = [...datosLaberinto];
      columnas = datosLaberintoActual[0].length;
      filas = datosLaberintoActual.length;
      resizeCanvas(columnas * tamanoCelda, filas * tamanoCelda);
      
      // Asegurar que el total de celdas caminables sea correcto
      calcularTotalCaminables();
      
      reiniciarAnimacion();
      
      estado = 'listo';
      actualizarEstadoUI();
    }
  }, 100); // Pequeño delay para feedback visual
}

function calcularCamino() {
  let inicio = { x: 1, y: 1 };
  let fin = { x: columnas - 2, y: filas - 2 };

  let resultado = usarAnchura
    ? busquedaAnchura(datosLaberintoActual, inicio, fin)
    : busquedaProfundidad(datosLaberintoActual, inicio, fin);

  camino = resultado.camino;
  explorados = resultado.explorados;
  paso = 0;
  
  actualizarEstadisticas();
}

function actualizarEstadoUI() {
  // Actualizar botones
  botonStart.disabled = estado === 'ejecutando' || estado === 'generando';
  botonPause.disabled = estado !== 'ejecutando';
  botonRandomize.disabled = estado === 'ejecutando' || estado === 'generando';
  
  // Actualizar texto del botón start (ahora solo icono)
  if (estado === 'completado') {
    botonStart.innerHTML = '🔄';
  } else {
    botonStart.innerHTML = '▶';
  }
  
  // Actualizar estado
  let estadoTexto = {
    'listo': 'Listo',
    'generando': 'Generando...',
    'ejecutando': 'Ejecutando...',
    'pausado': 'Pausado',
    'completado': 'Completado'
  };
  
  estadoActual.textContent = estadoTexto[estado];
  algoritmoActual.textContent = usarAnchura ? 'BFS' : 'DFS';
  
  // Actualizar estadísticas
  actualizarEstadisticas();
}

function mostrarAyuda() {
  helpPopup.classList.add('show');
  helpOverlay.classList.add('show');
}

function ocultarAyuda() {
  helpPopup.classList.remove('show');
  helpOverlay.classList.remove('show');
}

function actualizarEstadisticas() {
  longitudCamino.textContent = camino.length > 0 ? `${camino.length} celdas` : '-';
  let exploradosActuales = Math.min(Math.floor(paso), explorados.length);
  nodosExplorados.textContent = `${exploradosActuales} / ${totalCaminables}`;
}



function draw() {
  background(255);

  // Dibuja laberinto completo
  for (let y = 0; y < filas; y++) {
    for (let x = 0; x < columnas; x++) {
      fill(datosLaberintoActual[y][x] === "#" ? 30 : 255);
      stroke(200);
      rect(x * tamanoCelda, y * tamanoCelda, tamanoCelda, tamanoCelda);
    }
  }

  // Dibuja puntos de inicio y fin
  fill(76, 175, 80); // Verde para inicio
  rect(1 * tamanoCelda, 1 * tamanoCelda, tamanoCelda, tamanoCelda);
  
  fill(244, 67, 54); // Rojo para fin
  rect((columnas - 2) * tamanoCelda, (filas - 2) * tamanoCelda, tamanoCelda, tamanoCelda);

  // Dibuja exploración
  for (let i = 0; i < paso && i < explorados.length; i++) {
    let pos = explorados[i];
    fill(usarAnchura ? "rgba(59, 130, 246, 0.3)" : "rgba(239, 68, 68, 0.3)");
    noStroke();
    rect(pos.x * tamanoCelda + 2, pos.y * tamanoCelda + 2, tamanoCelda - 4, tamanoCelda - 4);
  }

  // Avanza la animación
  if (estado === 'ejecutando' && paso < explorados.length) {
    paso += velocidad;
    actualizarEstadisticas();
  } else if (estado === 'ejecutando' && paso >= explorados.length) {
    // Una vez terminada la exploración, muestra el camino final
    estado = 'completado';
    actualizarEstadoUI();
  }

  // Muestra el camino final si está completado
  if (estado === 'completado') {
    for (let pos of camino) {
      fill(usarAnchura ? "rgba(59, 130, 246, 0.8)" : "rgba(239, 68, 68, 0.8)");
      noStroke();
      rect(pos.x * tamanoCelda + 2, pos.y * tamanoCelda + 2, tamanoCelda - 4, tamanoCelda - 4);
    }
  }
}