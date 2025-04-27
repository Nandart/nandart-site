document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById('gallery');
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const radius = 250;
  const rotationSpeed = 0.003; // velocidade da rotação
  let angleOffset = 0;
  let obras = [];

  async function carregarObras() {
    try {
      const response = await fetch('galeria/obras/obras_aprovadas.json');
      obras = await response.json();
      desenharObras();
      animarGaleria();
    } catch (error) {
      console.error("Erro ao carregar as obras:", error);
    }
  }

  function desenharObras() {
    obras.forEach((obra) => {
      const obraDiv = document.createElement('div');
      obraDiv.className = obra.premium ? 'obra premium' : 'obra';

      const imagem = document.createElement('img');
      imagem.src = obra.imagem;
      imagem.alt = obra.titulo;

      const titulo = document.createElement('div');
      titulo.textContent = obra.titulo;

      obraDiv.appendChild(imagem);
      obraDiv.appendChild(titulo);
      gallery.appendChild(obraDiv);
    });
  }

  function animarGaleria() {
    const obrasElements = document.querySelectorAll('.obra');
    function animar() {
      angleOffset += rotationSpeed;
      obrasElements.forEach((el, i) => {
        const angle = (i * (2 * Math.PI) / obrasElements.length) + angleOffset;
        const x = centerX + radius * Math.cos(angle) - el.offsetWidth / 2;
        const y = centerY + radius * Math.sin(angle) - el.offsetHeight / 2;

        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      requestAnimationFrame(animar);
    }
    animar();
  }

  carregarObras();
});
