import "../styles/style.scss";

document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  const botones = menu.querySelectorAll("button");
  const botonReset = document.getElementById("reset");
  const contenedor = document.getElementById("tablero");
  const mensaje = document.getElementById("mensaje");

  let size;
  let minas;
  let tablero = [];
  let juegoActivo = false;

  // Elegir dificultad
  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const dificultad = boton.dataset.dificultad;
      menu.style.display = "none";
      botonReset.style.display = "inline-block";
      iniciarJuego(dificultad);
    });
  });

  // Reset al menú
  botonReset.addEventListener("click", () => {
    contenedor.innerHTML = "";
    mensaje.classList.add("oculto");
    menu.style.display = "block";
    botonReset.style.display = "none";
    juegoActivo = false;
  });

  function iniciarJuego(dificultad) {
    tablero = [];
    contenedor.innerHTML = "";
    mensaje.classList.add("oculto");
    juegoActivo = true;

    // Configuración según dificultad
    if (dificultad === "facil") {
      size = 10;
      minas = 20;
    } else if (dificultad === "medio") {
      size = 16;
      minas = 50;
    } else {
      size = 20;
      minas = 100;
    }

    // Crear tablero lógico
    for (let y = 0; y < size; y++) {
      tablero[y] = [];
      for (let x = 0; x < size; x++) {
        tablero[y][x] = {
          mina: false,
          descubierta: false,
          marcada: false,
          numero: 0,
        };
      }
    }

    // Colocar minas
    let minasColocadas = 0;
    while (minasColocadas < minas) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (!tablero[y][x].mina) {
        tablero[y][x].mina = true;
        minasColocadas++;
      }
    }

    // Calcular números
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (tablero[y][x].mina) continue;
        let contador = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (
              ny >= 0 &&
              ny < size &&
              nx >= 0 &&
              nx < size &&
              tablero[ny][nx].mina
            )
              contador++;
          }
        }
        tablero[y][x].numero = contador;
      }
    }

    // Dibujar tablero
    contenedor.style.display = "grid";
    contenedor.style.gridTemplateColumns = `repeat(${size}, 40px)`;
    contenedor.style.gap = "4px";

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const div = document.createElement("div");
        div.classList.add("celda");
        div.dataset.x = x;
        div.dataset.y = y;

        // Click izquierdo
        div.addEventListener("click", () => {
          if (!juegoActivo) return;
          if (tablero[y][x].marcada) return;
          descubrirCelda(x, y, div);
        });

        // Click derecho 🚩
        div.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          if (!juegoActivo) return;
          if (tablero[y][x].descubierta) return;
          tablero[y][x].marcada = !tablero[y][x].marcada;
          div.textContent = tablero[y][x].marcada ? "🚩" : "";
          comprobarVictoria();
        });

        contenedor.appendChild(div);
      }
    }
  }

  function descubrirCelda(x, y, div) {
    const celda = tablero[y][x];
    if (celda.descubierta || celda.marcada) return;

    celda.descubierta = true;
    div.classList.add("descubierta");

    if (celda.mina) {
      div.textContent = "💣";
      div.classList.add("mina");
      mostrarTodasLasminas();
      mostrarMensaje("💥 HAS PERDIDO");
      return;
    }

    if (celda.numero > 0) {
      div.textContent = celda.numero;
    } else {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < size && nx >= 0 && nx < size) {
            const index = ny * size + nx;
            descubrirCelda(nx, ny, contenedor.children[index]);
          }
        }
      }
    }
  }

  function mostrarTodasLasminas() {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const celda = tablero[y][x];
        const div = contenedor.querySelector(
          `.celda[data-x='${x}'][data-y='${y}']`,
        );
        if (celda.mina) {
          div.textContent = "💣";
          div.classList.add("mina");
        }
      }
    }
  }

  function comprobarVictoria() {
    let banderasCorrectas = 0;
    let banderasTotales = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const celda = tablero[y][x];
        if (celda.marcada) {
          banderasTotales++;
          if (celda.mina) banderasCorrectas++;
        }
      }
    }
    if (banderasCorrectas === minas && banderasTotales === minas) {
      mostrarMensaje("🏆 HAS GANADO");
      juegoActivo = false;
    }
  }

  function mostrarMensaje(texto) {
    mensaje.textContent = texto;
    mensaje.classList.remove("oculto");
    juegoActivo = false;
  }
});
