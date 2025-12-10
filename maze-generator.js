// Generador de laberintos - versión corregida y simplificada
function generarLaberintoAleatorio(ancho = 65, alto = 61) {
  // Asegurar dimensiones impares para el algoritmo
  if (ancho % 2 === 0) ancho++;
  if (alto % 2 === 0) alto++;
  
  console.log(`Generando laberinto de ${ancho}x${alto}`);
  
  // Crear laberinto completamente de paredes
  let laberinto = [];
  for (let y = 0; y < alto; y++) {
    laberinto[y] = [];
    for (let x = 0; x < ancho; x++) {
      laberinto[y][x] = '#';
    }
  }
  
  // Función recursiva de backtracking optimizada para laberintos grandes
  function backtrack(x, y) {
    laberinto[y][x] = ' '; // Marcar como camino
    
    // Direcciones en orden aleatorio
    const direcciones = [
      [0, -2], [2, 0], [0, 2], [-2, 0]
    ].sort(() => Math.random() - 0.5);
    
    for (let [dx, dy] of direcciones) {
      const nx = x + dx;
      const ny = y + dy;
      const wx = x + dx / 2;
      const wy = y + dy / 2;
      
      // Verificar límites y si no fue visitado
      if (nx > 0 && nx < ancho - 1 && 
          ny > 0 && ny < alto - 1 && 
          laberinto[ny][nx] === '#') {
        
        laberinto[wy][wx] = ' '; // Romper pared
        backtrack(nx, ny);
      }
    }
  }
  
  // Empezar desde (1, 1)
  try {
    backtrack(1, 1);
  } catch (error) {
    console.warn('Error en backtracking (puede ser por stack overflow en laberintos muy grandes):', error);
  }
  
  // Asegurar salida en la esquina inferior derecha
  const salidaX = ancho - 2;
  const salidaY = alto - 2;
  laberinto[salidaY][salidaX] = ' ';
  
  // Abrir camino a la salida si es necesario
  if (salidaX > 1) laberinto[salidaY][salidaX - 1] = ' ';
  if (salidaY > 1) laberinto[salidaY - 1][salidaX] = ' ';
  
  // Convertir a formato de strings
  const resultado = laberinto.map(fila => fila.join(''));
  
  console.log(`Laberinto generado con dimensiones: ${resultado[0].length}x${resultado.length}`);
  
  return resultado;
}

function getDimensionesOptimas(tamanoCelda, maxWidth, maxHeight) {
  const anchoMax = Math.floor(maxWidth / tamanoCelda);
  const altoMax = Math.floor(maxHeight / tamanoCelda);
  
  let ancho = Math.min(anchoMax - 2, 51);
  let alto = Math.min(altoMax - 2, 31);
  
  if (ancho % 2 === 0) ancho--;
  if (alto % 2 === 0) alto--;
  
  ancho = Math.max(ancho, 21);
  alto = Math.max(alto, 11);
  
  return { ancho, alto };
}