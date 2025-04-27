document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById('gallery');
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalArtist = document.getElementById('modal-artist');
  const modalDescription = document.getElementById('modal-description');
  const modalBuyButton = document.getElementById('modal-buy');
  const closeModalBtn = document.getElementById('close-modal');

  let obras = [];
  const radius = Math.min(window.innerWidth, window.innerHeight) / 2.2;
  const rotationSpeed = 0.002;
  let angleOffset = 0;

  async function carregarObras() {
    try {
      const response = await fetch('galeria/obras/obras_aprovadas.json');
      obras = await response.json();
      desenharObras();
      animarGaleria();
    } catch (error) {
      console.error("Erro ao carregar obras:", error);
    }
  }

  function desenharObras() {
    obras.forEach((obra, index) => {
      const obraDiv = document.createElement('div');
      obraDiv.className = obra.premium ? 'obra premium' : 'obra normal';

      const imagem = document.createElement('img');
      imagem.src = obra.imagem;
      imagem.alt = obra.titulo;
      imagem.style.opacity = 0;
      setTimeout(() => {
        imagem.style.opacity = 1;
        imagem.style.transition = 'opacity 1.5s';
      }, index * 150);

      obraDiv.appendChild(imagem);

      // Evento de clique para abrir Modal
      obraDiv.addEventListener('click', () => abrirModal(obra));

      gallery.appendChild(obraDiv);
    });
  }

  function animarGaleria() {
    const obrasElements = document.querySelectorAll('.obra.normal');
    const premiumElements = document.querySelectorAll('.obra.premium');

    function animar() {
      angleOffset += rotationSpeed;
      obrasElements.forEach((el, i) => {
        const angle = (i * (2 * Math.PI) / obrasElements.length) + angleOffset;
        const x = (window.innerWidth / 2) + radius * Math.cos(angle) - el.offsetWidth / 2;
        const y = (window.innerHeight / 2) + (radius * 0.4) * Math.sin(angle) - el.offsetHeight / 2;
        const scale = 1 + 0.2 * Math.sin(angle);

        el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        el.style.zIndex = Math.floor(100 + 100 * Math.sin(angle));
      });

      premiumElements.forEach((el) => {
        const floatY = (window.innerHeight / 2) - 260 + Math.sin(Date.now() / 500) * 10;
        const floatX = (window.innerWidth / 2) - (el.offsetWidth / 2);
        el.style.transform = `translate(${floatX}px, ${floatY}px)`;
      });

      requestAnimationFrame(animar);
    }

    animar();
  }

  function abrirModal(obra) {
    modalImage.src = obra.imagem;
    modalTitle.innerText = obra.titulo;
    modalArtist.innerText = obra.autor || "Artista Desconhecido";
    modalDescription.innerText = obra.descricao || "";

    if (obra.nft === true) {
      modalBuyButton.innerText = "Comprar NFT";
      modalBuyButton.onclick = () => {
        alert("Integração Web3 em breve!");
      };
    } else {
      modalBuyButton.innerText = "Comprar Obra";
      modalBuyButton.onclick = () => {
        window.location.href = `mailto:info@nandart.art?subject=Compra de Obra: ${obra.titulo}`;
      };
    }

    modal.style.display = 'flex';
    modal.classList.add('modal-animar');
    setTimeout(() => {
      modal.classList.remove('modal-animar');
    }, 600);
  }

  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  carregarObras();
});
