document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById('gallery');
  let angle = 0;
  const radius = 250;
  const speed = 0.002; // Velocidade de rotação
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2 + 50; // ligeiramente mais abaixo
  let obras = [];

  async function loadObras() {
    try {
      const response = await fetch('galeria/obras/obras_aprovadas.json');
      obras = await response.json();
      criarObras();
      animateGallery();
    } catch (error) {
      console.error("Erro ao carregar obras:", error);
    }
  }

  function criarObras() {
    obras.forEach((obra, index) => {
      const div = document.createElement('div');
      div.className = obra.premium ? 'obra premium' : 'obra';

      const img = document.createElement('img');
      img.src = obra.imagem;
      img.alt = obra.titulo;

      const label = document.createElement('div');
      label.className = 'label';
      label.innerText = obra.titulo;

      div.appendChild(img);
      div.appendChild(label);
      gallery.appendChild(div);
    });
  }

  function animateGallery() {
    const obrasElements = document.querySelectorAll('.obra');
    function animate() {
      angle += speed;
      obrasElements.forEach((el, i) => {
        const theta = (i * (2 * Math.PI) / obrasElements.length) + angle;
        const x = centerX + radius * Math.cos(theta) - el.offsetWidth / 2;
        const y = centerY + radius * Math.sin(theta) - el.offsetHeight / 2;

        el.style.transform = `translate(${x}px, ${y}px) rotate(${theta}rad)`;

        // efeito de profundidade para premium
        if (el.classList.contains('premium')) {
          const scale = 1.1 + 0.1 * Math.sin(theta * 2);
          el.style.transform += ` scale(${scale})`;
        }
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  loadObras();
});
