// gallery.js
const gallery = document.getElementById('gallery');
const premiumHighlight = document.getElementById('premiumHighlight');

// Configurações
const radius = 250; // raio da órbita
const speed = 0.002; // velocidade de rotação
const scaleAmount = 0.3; // quanto as imagens crescem/reduzem no efeito de profundidade
let angle = 0;

// Atualizar posições
function animateGallery() {
  const artworks = document.querySelectorAll('.artwork:not(.premium-highlight)');

  angle += speed;

  artworks.forEach((artwork, index) => {
    const total = artworks.length;
    const currentAngle = angle + (index * (2 * Math.PI / total));

    const x = radius * Math.cos(currentAngle);
    const y = radius * Math.sin(currentAngle) * 0.5; // achatado no eixo Y para parecer mais 3D

    artwork.style.transform = `translate(${x}px, ${y}px) rotate(${currentAngle}rad)`;

    // Calcular escala para profundidade
    const scale = 1 + scaleAmount * (1 - Math.cos(currentAngle));
    artwork.style.zIndex = Math.floor(scale * 100);
    artwork.style.transform += ` scale(${scale})`;
  });

  requestAnimationFrame(animateGallery);
}

// Inicializar animação
animateGallery();
