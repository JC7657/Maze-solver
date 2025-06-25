
# Solucionador de laberintos

Este proyecto ilustra de forma visual loa algoritmos de técnicas de búsqueda en anchura y profundidad (BFS y DFS), aplicadas a laberintos bidimensionales que pueden introducirse en formato ASCII. (Se pueden generar en https://www.dcode.fr/maze-generator).






## Estructura del Proyecto

- **Index.html**: Define la estructura básica de la página, incluyendo botones de interacción, controles de velocidad y el contenedor del laberinto.
- **Styles.css**: Se utilizó para estilizar los elementos de la interfaz, manteniéndolos legibles y accesibles, incluso con laberintos de gran tamaño
- **Sketch.js**: Archivo principal que inicializa el canvas, controla la visualización del laberinto, la animación, y la interacción con el usuario
- **dfs.js y bfs.js**: Contienen el comportamiento respectivo de los algoritmos de búsqueda.
- **Utils.js**: Funciones auxiliares como la reconstrucción del camino final desde los nodos explorados.
- **Maze-data.js**: Define el laberinto como una matriz de caracteres tipo ASCII (“#” para muros, y espacios en blanco para caminos).
