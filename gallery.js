// Configuração Básica Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Iluminação quente
const ambientLight = new THREE.AmbientLight(0xffd7a3, 1.2);
scene.add(ambientLight);

// Carregar Texturas das Obras
const obras = [
  { url: 'imagens/obra5.jpg', titulo: 'Título 1', artista: 'Artista 1', premium: false, colecaoNandart: false },
  { url: 'imagens/premium1.jpg', titulo: 'Título 2', artista: 'Artista 2', premium: true, colecaoNandart: false },
  { url: 'imagens/obra3.jpg', titulo: 'Título 3', artista: 'Artista 3', premium: false, colecaoNandart: false },
  { url: 'imagens/obra4.jpg', titulo: 'Título 4', artista: 'Artista 4', premium: false, colecaoNandart: false },
  { url: 'imagens/premium2.jpg', titulo: 'Título 5', artista: 'Artista 5', premium: true, colecaoNandart: false },
  { url: 'imagens/obra6.jpg', titulo: 'Título 6', artista: 'Artista 6', premium: false, colecaoNandart: false },
  { url: 'imagens/obra7.jpg', titulo: 'Título 7', artista: 'Artista 7', premium: false, colecaoNandart: true },
  { url: 'imagens/obra8.jpg', titulo: 'Título 8', artista: 'Artista 8', premium: false, colecaoNandart: true },
];

const loader = new THREE.TextureLoader();
const artworks = [];
const radius = 8;
const rotationSpeed = 0.001; // Velocidade lenta

obras.forEach((obra, i) => {
  loader.load(obra.url, (texture) => {
    const geometry = new THREE.PlaneGeometry(2, 2.5);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const mesh = new THREE.Mesh(geometry, material);

    if (obra.premium) {
      mesh.position.set(0, 3, 0); // Obras premium suspensas
    } else {
      const angle = i * ((2 * Math.PI) / obras.length);
      mesh.position.x = radius * Math.cos(angle);
      mesh.position.z = radius * Math.sin(angle);
    }

    mesh.userData = obra;
    scene.add(mesh);
    artworks.push(mesh);
  });
});

// Música ambiente controlo
const music = document.getElementById('background-music');
const toggleMusic = document.getElementById('toggle-music');
toggleMusic.addEventListener('click', () => {
  if (music.paused) {
    music.play();
    toggleMusic.textContent = '🔈';
  } else {
    music.pause();
    toggleMusic.textContent = '🔇';
  }
});

// Modal e visualizações
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalArtist = document.getElementById('modal-artist');
const modalViews = document.getElementById('views-count');
const closeModal = document.getElementById('close-modal');
const buyButton = document.getElementById('buy-button');

// Guardar visualizações localmente
function incrementViews(title) {
  const views = JSON.parse(localStorage.getItem('views')) || {};
  views[title] = (views[title] || 0) + 1;
  localStorage.setItem('views', JSON.stringify(views));
  return views[title];
}

function getViews(title) {
  const views = JSON.parse(localStorage.getItem('views')) || {};
  return views[title] || 0;
}

// Evento clicar numa obra
function onDocumentMouseDown(event) {
  event.preventDefault();
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(artworks);

  if (intersects.length > 0) {
    const obra = intersects[0].object.userData;
    modalImage.src = intersects[0].object.material.map.image.src;
    modalTitle.textContent = obra.titulo;
    modalArtist.textContent = obra.artista;
    modalViews.textContent = incrementViews(obra.titulo);
    buyButton.onclick = () => {
      window.location.href = `mailto:info@nandart.art?subject=Compra de obra: ${obra.titulo}`;
    };
    modal.classList.remove('hidden');
  }
}

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

window.addEventListener('mousedown', onDocumentMouseDown, false);

// Animação da galeria
function animate() {
  requestAnimationFrame(animate);

  artworks.forEach((mesh) => {
    if (!mesh.userData.premium) {
      mesh.rotation.y += rotationSpeed; // Rotação suave
      const angle = Math.atan2(mesh.position.z, mesh.position.x) + rotationSpeed;
      mesh.position.x = radius * Math.cos(angle);
      mesh.position.z = radius * Math.sin(angle);
    }
  });

  renderer.render(scene, camera);
}

animate();
