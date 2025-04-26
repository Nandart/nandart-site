// gallery.js completo

// Lista de obras (podes adicionar mais!)
const obras = [
  {
    titulo: "Fragmentos do Infinito",
    artista: "Renner Nunes",
    imagem: "obra.jpg",
    descricao: "Uma reflexão sobre o eterno e o efémero.",
    nftContractAddress: null,
    isPremium: true,
    isNandartObra: true,
    dataInicioPremium: "2025-04-26"
  },
  {
    titulo: "Ecos do Tempo",
    artista: "Ana Marques",
    imagem: "https://via.placeholder.com/150",
    descricao: "Viagem pelas memórias esquecidas.",
    nftContractAddress: "0xABCDEF123456",
    isPremium: false,
    isNandartObra: false,
    dataInicioPremium: null
  },
  {
    titulo: "Alvorecer Digital",
    artista: "Miguel Vieira",
    imagem: "https://via.placeholder.com/150",
    descricao: "O despertar da alma tecnológica.",
    nftContractAddress: null,
    isPremium: false,
    isNandartObra: false,
    dataInicioPremium: null
  }
];

// Gerar as obras na página
const gallery = document.getElementById('gallery');
const premiumHighlight = document.getElementById('destaque-premium');

obras.forEach((obra, index) => {
  const hoje = new Date();
  const inicioPremium = obra.dataInicioPremium ? new Date(obra.dataInicioPremium) : null;
  const aindaPremium = inicioPremium ? ((hoje - inicioPremium) / (1000 * 60 * 60 * 24)) < 30 : false;

  if (obra.isPremium && (obra.isNandartObra || aindaPremium)) {
    // Obras Premium
    const div = document.createElement('div');
    div.className = 'artwork premium-highlight';
    div.innerHTML = `
      <img src="${obra.imagem}" alt="${obra.titulo}">
      <div class="selo-premium">⭐ Destaque NANdART</div>
      ${obra.isNandartObra ? `<div class="selo-nandart">Coleção NANdART</div>` : ``}
    `;
    div.onclick = () => abrirModal(index);
    premiumHighlight.appendChild(div);
  } else {
    // Obras Normais
    const div = document.createElement('div');
    div.className = 'artwork';
    div.innerHTML = `
      <img src="${obra.imagem}" alt="${obra.titulo}">
    `;
    div.onclick = () => abrirModal(index);
    gallery.appendChild(div);
  }
});

// Modal e Comprar
let obraAtual = null;

function abrirModal(index) {
  obraAtual = obras[index];
  document.getElementById('imagem-modal').src = obraAtual.imagem;
  document.getElementById('titulo-modal').textContent = obraAtual.titulo;
  document.getElementById('artista-modal').textContent = "Artista: " + obraAtual.artista;
  document.getElementById('descricao-modal').textContent = obraAtual.descricao || "";

  const botaoComprar = document.getElementById('botao-comprar');
  botaoComprar.textContent = obraAtual.nftContractAddress ? "Comprar NFT" : "Comprar Obra";

  document.getElementById('modal-obra').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modal-obra').style.display = 'none';
}

function comprarObra() {
  if (obraAtual.nftContractAddress) {
    if (typeof window.ethereum !== 'undefined') {
      alert('Ligação Web3 em desenvolvimento.');
    } else {
      alert('Carteira Web3 não detectada.');
    }
  } else {
    window.location.href = `mailto:info@nandart.art?subject=Compra de Obra: ${encodeURIComponent(obraAtual.titulo)}`;
  }
}

// Motor de órbita com pulso de profundidade
const radius = 250; // raio da órbita
const speed = 0.002; // velocidade de rotação
const scaleAmount = 0.3; // intensidade do efeito de profundidade
let angle = 0;

function animateGallery() {
  const artworks = document.querySelectorAll('.artwork:not(.premium-highlight)');

  angle += speed;

  artworks.forEach((artwork, index) => {
    const total = artworks.length;
    const currentAngle = angle + (index * (2 * Math.PI / total));

    const x = radius * Math.cos(currentAngle);
    const y = radius * Math.sin(currentAngle) * 0.5; // achatado para criar efeito 3D

    artwork.style.transform = `translate(${x}px, ${y}px) rotate(${currentAngle}rad)`;

    // Pulso de profundidade
    const scale = 1 + scaleAmount * (1 - Math.cos(currentAngle));
    artwork.style.zIndex = Math.floor(scale * 100);
    artwork.style.transform += ` scale(${scale})`;
  });

  requestAnimationFrame(animateGallery);
}

// Iniciar a animação
animateGallery();
