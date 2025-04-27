const container = document.getElementById('galeria-container');
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
  const raio = window.innerWidth < 768 ? 100 : 250;
  const centroX = window.innerWidth / 2;
  const centroY = window.innerHeight / 2 + 50;
  const numObras = obras.length;
  const anguloInicial = Math.PI / 2;

  obras.forEach((obra, index) => {
    const obraElem = document.createElement('div');
    obraElem.className = 'obra';

    const img = document.createElement('img');
    img.src = obra.imagem;
    img.alt = obra.titulo;

    const titulo = document.createElement('div');
    titulo.className = 'obra-titulo';
    titulo.textContent = obra.titulo;

    obraElem.appendChild(img);
    obraElem.appendChild(titulo);

    if (obra.premium) {
      obraElem.classList.add('premium');
      const estrela = document.createElement('div');
      estrela.className = 'estrela-premium';
      estrela.textContent = '⭐';
      obraElem.appendChild(estrela);
    }

    container.appendChild(obraElem);

    obraElem.style.left = `${centroX + raio * Math.cos(anguloInicial - (index * (2 * Math.PI / numObras))) - 50}px`;
    obraElem.style.top = `${centroY + raio * Math.sin(anguloInicial - (index * (2 * Math.PI / numObras))) - 50}px`;

    obraElem.addEventListener('click', () => abrirModal(obra));
  });

  animarGaleria();
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
    const obras = document.querySelectorAll('.obra');
    obras.forEach((obra, index) => {
      const raio = window.innerWidth < 768 ? 100 : 250;
      const centroX = window.innerWidth / 2;
      const centroY = window.innerHeight / 2 + 50;
      const numObras = obras.length;
      const x = centroX + raio * Math.cos(angulo - (index * (2 * Math.PI / numObras))) - 50;
      const y = centroY + raio * Math.sin(angulo - (index * (2 * Math.PI / numObras))) - 50;
      obra.style.left = `${x}px`;
      obra.style.top = `${y}px`;
    });
    angulo += 0.01;
  }, 30);
}

carregarObras();
