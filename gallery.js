// gallery.js

// Array de obras normais
const obrasNormais = [
  { src: 'galeria/obras/obra1.jpg', titulo: 'Obra 1', artista: 'Artista 1', premium: false },
  { src: 'galeria/obras/obra2.jpg', titulo: 'Obra 2', artista: 'Artista 2', premium: false },
  { src: 'galeria/obras/obra3.jpg', titulo: 'Obra 3', artista: 'Artista 3', premium: false },
  { src: 'galeria/obras/obra4.jpg', titulo: 'Obra 4', artista: 'Artista 4', premium: false },
  { src: 'galeria/obras/obra5.jpg', titulo: 'Obra 5', artista: 'Artista 5', premium: false }
];

// Array de obras premium
const obrasPremium = [
  { src: 'galeria/obras/premium1.jpg', titulo: 'Premium 1', artista: 'Artista Premium 1', premium: true },
  { src: 'galeria/obras/premium2.jpg', titulo: 'Premium 2', artista: 'Artista Premium 2', premium: true }
];

// Gerar obras normais em círculo
const circulo = document.querySelector('.circulo');

obrasNormais.forEach((obra, index) => {
  const img = document.createElement('img');
  img.src = obra.src;
  img.alt = obra.titulo;
  img.style.transformOrigin = 'center center';
  img.dataset.titulo = obra.titulo;
  img.dataset.artista = obra.artista;
  img.dataset.premium = obra.premium;
  circulo.appendChild(img);
});

// Gerar obras premium suspensas
const obrasPremiumDiv = document.querySelector('.obras-premium');

obrasPremium.forEach((obra) => {
  const img = document.createElement('img');
  img.src = obra.src;
  img.alt = obra.titulo;
  img.dataset.titulo = obra.titulo;
  img.dataset.artista = obra.artista;
  img.dataset.premium = obra.premium;
  obrasPremiumDiv.appendChild(img);
});

// Rotação das obras normais
let angulo = 0;
function animarGaleria() {
  const imgs = document.querySelectorAll('.circulo img');
  const raio = 200;
  imgs.forEach((img, index) => {
    const anguloIndividual = (360 / imgs.length) * index + angulo;
    const rad = anguloIndividual * (Math.PI / 180);
    const x = Math.cos(rad) * raio;
    const y = Math.sin(rad) * raio;
    img.style.left = 50 + x / 5 + '%';
    img.style.top = 50 + y / 5 + '%';
    img.style.transform = `translate(-50%, -50%) scale(${1 - Math.abs(y) / 400})`;
  });
  angulo += 0.3;
  requestAnimationFrame(animarGaleria);
}
animarGaleria();

// Modal
const modal = document.getElementById('modal-obra');
const imagemModal = document.getElementById('imagem-obra');
const tituloModal = document.getElementById('titulo-obra');
const visualizacoesSpan = document.getElementById('visualizacoes');
const botaoComprar = document.getElementById('botao-comprar');

// Abrir Modal
function abrirModal(img) {
  imagemModal.src = img.src;
  tituloModal.textContent = img.dataset.titulo + ' — ' + img.dataset.artista;
  incrementarVisualizacoes();
  modal.style.display = 'block';
}

// Incrementar visualizações
function incrementarVisualizacoes() {
  let atual = parseInt(visualizacoesSpan.textContent);
  atual++;
  visualizacoesSpan.textContent = atual;
}

// Fechar Modal
document.querySelector('.close-modal').onclick = () => {
  modal.style.display = 'none';
};

// Clicar nas obras normais
document.querySelectorAll('.circulo img').forEach(img => {
  img.onclick = () => abrirModal(img);
});

// Clicar nas obras premium
document.querySelectorAll('.obras-premium img').forEach(img => {
  img.onclick = () => abrirModal(img);
});
