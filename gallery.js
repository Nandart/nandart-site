// Lista de obras (Exemplo inicial — podes adicionar mais depois)
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

// Inserir obras Premium suspensas
const destaquePremium = document.getElementById('destaque-premium');
const circuloObras = document.getElementById('circulo-obras');
const premiumAtivos = [];

obras.forEach((obra, index) => {
  const hoje = new Date();
  const inicioPremium = obra.dataInicioPremium ? new Date(obra.dataInicioPremium) : null;
  const aindaPremium = inicioPremium ? ((hoje - inicioPremium) / (1000 * 60 * 60 * 24)) < 30 : false;

  if (obra.isPremium && (obra.isNandartObra || aindaPremium)) {
    // Inserir como Premium suspenso
    const div = document.createElement('div');
    div.className = 'obra-premium';
    div.innerHTML = `
      <img src="${obra.imagem}" alt="${obra.titulo}">
      <div class="selo-premium">⭐ Destaque NANdART</div>
      ${obra.isNandartObra ? `<div class="selo-nandart">Coleção NANdART</div>` : ``}
    `;
    div.onclick = () => abrirModal(index);
    destaquePremium.appendChild(div);

    premiumAtivos.push(div);
  } else {
    // Inserir no Círculo normal
    const angulo = (index / obras.length) * 360;
    const radianos = angulo * (Math.PI / 180);

    const div = document.createElement('div');
    div.className = 'obra-circulo';
    div.style.top = `${200 + 180 * Math.sin(radianos)}px`;
    div.style.left = `${200 + 180 * Math.cos(radianos)}px`;
    div.innerHTML = `<img src="${obra.imagem}" alt="${obra.titulo}">`;
    div.onclick = () => abrirModal(index);

    circuloObras.appendChild(div);
  }
});

// Função abrir Modal
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

// Função fechar Modal
function fecharModal() {
  document.getElementById('modal-obra').style.display = 'none';
}

// Função Comprar
function comprarObra() {
  if (obraAtual.nftContractAddress) {
    // Preparar ligação Web3 futura
    if (typeof window.ethereum !== 'undefined') {
      alert('Ligação Web3 em desenvolvimento.');
    } else {
      alert('Carteira Web3 não detectada.');
    }
  } else {
    window.location.href = `mailto:info@nandart.art?subject=Compra de Obra: ${encodeURIComponent(obraAtual.titulo)}`;
  }
}

// Parallax nas obras Premium
document.addEventListener('mousemove', (e) => {
  const largura = window.innerWidth;
  const altura = window.innerHeight;
  const movimentoX = (e.clientX / largura - 0.5) * 10;
  const movimentoY = (e.clientY / altura - 0.5) * 10;

  premiumAtivos.forEach(div => {
    div.style.transform = `translate(${movimentoX}px, ${movimentoY}px)`;
  });
});
