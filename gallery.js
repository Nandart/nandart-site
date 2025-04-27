const container = document.getElementById('galeria-container');
const premiumContainer = document.getElementById('galeria-premiums');
const modal = document.getElementById('modal-obra');
const fecharModal = document.getElementById('fechar-modal');
const modalImagem = document.getElementById('modal-imagem');
const modalTitulo = document.getElementById('modal-titulo');
const modalDescricao = document.getElementById('modal-descricao');
const botaoComprar = document.getElementById('botao-comprar');

let obras = [];

async function carregarObras() {
  const resposta = await fetch('galeria/obras/obras_aprovadas.json');
  obras = await resposta.json();
  criarGaleria();
}

function criarGaleria() {
  const raio = Math.min(window.innerWidth, window.innerHeight) / 2.5;
  const centroX = window.innerWidth / 2;
  const centroY = window.innerHeight / 2 + 50;
  const numObras = obras.filter(obra => !obra.premium).length;
  const anguloInicial = Math.PI / 2;

  let indexObraNormal = 0;

  obras.forEach((obra) => {
    if (obra.premium) {
      criarPremium(obra);
    } else {
      const obraElem = document.createElement('div');
      obraElem.className = 'obra';

      const img = document.createElement('img');
      img.src = obra.imagem;
      img.alt = obra.titulo;
      obraElem.appendChild(img);

      obraElem.addEventListener('click', () => abrirModal(obra));

      container.appendChild(obraElem);

      obraElem.dataset.index = indexObraNormal;
      indexObraNormal++;
    }
  });

  animarGaleria();
}

function criarPremium(obra) {
  const premium = document.createElement('div');
  premium.className = 'obra premium';

  const img = document.createElement('img');
  img.src = obra.imagem;
  img.alt = obra.titulo;
  premium.appendChild(img);

  premium.addEventListener('click', () => abrirModal(obra));

  premiumContainer.appendChild(premium);
}

function abrirModal(obra) {
  modalImagem.src = obra.imagem;
  modalTitulo.textContent = obra.titulo;
  modalDescricao.textContent = obra.descricao || "Esta obra é única, eterna.";
  if (obra.nft) {
    botaoComprar.textContent = "Comprar NFT";
  } else {
    botaoComprar.textContent = "Comprar Obra";
  }
  botaoComprar.href = obra.nft ? "#" : `mailto:info@nandart.art?subject=Compra de obra ${obra.titulo}`;
  modal.style.display = 'flex';
}

fecharModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

function animarGaleria() {
  let angulo = 0;
  setInterval(() => {
    const obrasNormais = document.querySelectorAll('#galeria-container .obra');
    const numObras = obrasNormais.length;
    const raio = Math.min(window.innerWidth, window.innerHeight) / 2.5;
    const centroX = window.innerWidth / 2;
    const centroY = window.innerHeight / 2 + 50;

    obrasNormais.forEach((obra, index) => {
      const x = centroX + raio * Math.cos(angulo - (index * (2 * Math.PI / numObras))) - 50;
      const y = centroY + raio * Math.sin(angulo - (index * (2 * Math.PI / numObras))) - 50;
      obra.style.left = `${x}px`;
      obra.style.top = `${y}px`;

      const profundidade = (Math.sin(angulo - (index * (2 * Math.PI / numObras))) + 1) / 2;
      const escala = 0.7 + profundidade * 0.5;
      obra.style.transform = `scale(${escala})`;
      obra.style.zIndex = Math.floor(profundidade * 100);
      obra.style.opacity = 0.5 + profundidade * 0.5;
    });

    angulo += 0.01;
  }, 30);

  animarPremiums();
}

function animarPremiums() {
  const premiums = document.querySelectorAll('#galeria-premiums .premium');
  premiums.forEach(premium => {
    premium.animate([
      { transform: 'translateY(0px)' },
      { transform: 'translateY(-10px)' },
      { transform: 'translateY(0px)' }
    ], {
      duration: 4000,
      iterations: Infinity
    });
  });
}

carregarObras();
