// gallery.js

const obras = document.querySelectorAll('.obra');
let angulos = [];
const raio = 250; // Distância do centro (ajusta conforme quiseres)
const centroX = window.innerWidth / 2;
const centroY = window.innerHeight / 2 + 100; // Ligeiramente mais para baixo

// Inicializar ângulos igualmente espaçados
for (let i = 0; i < obras.length; i++) {
  angulos.push((i / obras.length) * 2 * Math.PI);
}

function animateGallery() {
  for (let i = 0; i < obras.length; i++) {
    const obra = obras[i];
    const angulo = angulos[i];

    // Cálculo da posição circular
    const x = centroX + raio * Math.cos(angulo) - obra.offsetWidth / 2;
    const y = centroY + raio * Math.sin(angulo) - obra.offsetHeight / 2;

    obra.style.left = `${x}px`;
    obra.style.top = `${y}px`;
    obra.style.transform = `rotate(${angulo + Math.PI / 2}rad)`; // Rodar a imagem para "olhar para fora"

    // Atualizar ângulo para movimento no sentido dos ponteiros do relógio
    angulos[i] += 0.005; // Velocidade de rotação (podes ajustar)
  }

  requestAnimationFrame(animateGallery);
}

// Iniciar animação
animateGallery();

// Tornar responsivo ao redimensionar janela
window.addEventListener('resize', () => {
  location.reload();
});
