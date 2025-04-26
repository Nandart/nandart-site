// gallery.js com carregamento automático

async function carregarObras() {
  const response = await fetch('obras.json');
  const obras = await response.json();
  gerarObras(obras);
}

function gerarObras(obras) {
  const gallery = document.getElementById('gallery');
  const premiumHighlight = document.getElementById('destaque-premium');

  obras.forEach((obra, index) => {
    const hoje = new Date();
    const inicioPremium = obra.dataInicioPremium ? new Date(obra.dataInicioPremium) : null;
    const aindaPremium = inicioPremium ? ((hoje - inicioPremium) / (1000 * 60 * 60 * 24)) < 30 : false;

    if (obra.isPremium && (obra.isNandartObra || aindaPremium)) {
      const div = document.createElement('div');
      div.className = 'artwork premium-highlight';
      div.innerHTML = `
        <img src="${obra.imagem}" alt="${obra.titulo}">
        <div class="selo-premium">⭐ Destaque NANdART</div>
        ${obra.isNandartObra ? `<div class="selo-nandart">Coleção NANdART</div>` : ``}
      `;
      div.onclick = () => abrirModal(obra);
      premiumHighlight.appendChild(div);
    } else {
      const div = document.createElement('div');
      div.className = 'artwork';
      div.innerHTML = `<img src="${obra.imagem}" alt="${obra.titulo}">`;
      div.onclick = () => abrirModal(obra);
      gallery.appendChild(div);
    }
  });

  animateGallery();
}

let obraAtual = null;

function abrirModal(obra) {
  obraAtual = obra;
  document.getElementById('imagem-modal').src = obra.imagem;
  document.getElementById('titulo-modal').textContent = obra.titulo;
  document.getElementById('artista-modal').textContent = "Artista: " + obra.artista;
  document.getElementById('descricao-modal').textContent = obra.descricao || "";

  const botaoComprar = document.getElementById('botao-comprar');
  botaoComprar.textContent = obra.nftContractAddress ? "Comprar NFT" : "Comprar Obra";

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

// Motor de órbita
const radius = 250;
const speed = 0.002;
const scaleAmount = 0.3;
let angle = 0;

function animateGallery() {
  const artworks = document.querySelectorAll('.artwork:not(.premium-highlight)');

  angle += speed;

  artworks.forEach((artwork, index) => {
    const total = artworks.length;
    const currentAngle = angle + (index * (2 * Math.PI / total));

    const x = radius * Math.cos(currentAngle);
    const y = radius * Math.sin(currentAngle) * 0.5;

    artwork.style.transform = `translate(${x}px, ${y}px) rotate(${currentAngle}rad)`;

    const scale = 1 + scaleAmount * (1 - Math.cos(currentAngle));
    artwork.style.zIndex = Math.floor(scale * 100);
    artwork.style.transform += ` scale(${scale})`;
  });

  requestAnimationFrame(animateGallery);
}

// Iniciar carregamento
carregarObras();
