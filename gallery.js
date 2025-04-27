document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById('gallery');
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalArtist = document.getElementById('modal-artist');
  const modalDescription = document.getElementById('modal-description');
  const modalBuyButton = document.getElementById('modal-buy');
  const closeModalBtn = document.getElementById('close-modal');

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2 + 50;
  const radius = 350;
  const rotationSpeed = 0.002; // velocidade de rotação
  let angleOffset = 0;
  let obras = [];

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
      obraDiv.className = obra.premium ? 'obra premium' : 'obra';

      const imagem = document.createElement('img');
      imagem.src = obra.imagem;
      imagem.alt = obra.titulo;
      imagem.style.opacity = 0;
      setTimeout(() => {
        imagem.style.opacity = 1;
        imagem.style.transition = 'opacity 1.5s';
      }, index * 200);

      obraDiv.appendChild(imagem);

      // Evento de clique para abrir Modal
      obraDiv.addEventListener('click', () => abrirModal(obra));

      gallery.appendChild(obraDiv);
    });
  }

  function animarGaleria() {
    const obrasElements = document.querySelectorAll('.obra');
    function animar() {
      angleOffset += rotationSpeed;
      obrasElements.forEach((el, i) => {
        const isPremium = el.classList.contains('premium');
        if (!isPremium) {
          const angle = (i * (2 * Math.PI) / obrasElements.length) + angleOffset;
          const x = centerX + radius * Math.cos(angle) - el.offsetWidth / 2;
          const y = centerY + radius * Math.sin(angle) - el.offsetHeight / 2;
          el.style.transform = `translate(${x}px, ${y}px)`;
        } else {
          // Premium: manter suspensa com flutuação
          const floatY = centerY - 250 + Math.sin(Date.now() / 500) * 10;
          const floatX = centerX - el.offsetWidth / 2;
          el.style.transform = `translate(${floatX}px, ${floatY}px)`;
        }
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
        alert("Integração Web3 em breve! ✨");
      };
    } else {
      modalBuyButton.innerText = "Comprar Obra";
      modalBuyButton.onclick = () => {
        window.location.href = `mailto:info@nandart.art?subject=Compra de Obra: ${obra.titulo}`;
      };
    }

    // Animação de abertura
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

