import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
mport { OrbitControls } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/jsm/controls/OrbitControls.js';

// Criação da cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 5);

// Configuração do renderizador
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

// Luzes da cena
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Controles da câmera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Chão da galeria
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(6, 64),
  new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.3, roughness: 0.6 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Obras normais suspensas (do lado externo da galeria)
const obrasNormais = [];
const totalNormais = 12;
const raioNormais = 4;
for (let i = 0; i < totalNormais; i++) {
  const angle = (i / totalNormais) * Math.PI * 2;
  const obra = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.75),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('src/assets/imagens/obra' + (i % 6 + 1) + '.jpg'),
      transparent: true
    })
  );
  obra.position.set(Math.cos(angle) * raioNormais, 1.6, Math.sin(angle) * raioNormais);
  obra.lookAt(0, 1.6, 0);
  obra.userData.tipo = 'normal';
  scene.add(obra);
  obrasNormais.push(obra);
}

// Obras premium suspensas no centro da galeria
const obrasPremium = [];
const totalPremium = 3;
const alturaPremium = 2.6;
for (let i = 0; i < totalPremium; i++) {
  const offsetX = (i - 1) * 1.2;
  const obra = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.75),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('src/assets/imagens/obra-premium' + (i + 1) + '.jpg'),
      transparent: true
    })
  );
  obra.position.set(offsetX, alturaPremium, 0);
  obra.lookAt(0, alturaPremium, 2);
  obra.userData.tipo = 'premium';
  scene.add(obra);
  obrasPremium.push(obra);
}

// Modal
const modal = document.getElementById('modal-obra');
const imagemModal = document.getElementById('imagem-modal');
const tituloModal = document.getElementById('titulo-modal');
const artistaModal = document.getElementById('artista-modal');
const visualizacoesModal = document.getElementById('visualizacoes-modal');
const comprarBtn = document.getElementById('comprar-obra');
const fecharModal = document.getElementById('fechar-modal');
const blurFundo = document.getElementById('blur-fundo');

function abrirModal(src, titulo = 'Obra NANdART', artista = 'por Nandart', views = '248 visualizações') {
  imagemModal.src = src;
  tituloModal.textContent = titulo;
  artistaModal.textContent = artista;
  visualizacoesModal.textContent = views;
  modal.style.display = 'block';
  blurFundo.style.display = 'block';
}

function fecharModalFunc() {
  modal.style.display = 'none';
  blurFundo.style.display = 'none';
}

fecharModal.addEventListener('click', fecharModalFunc);
window.addEventListener('click', (e) => {
  if (e.target === modal || e.target === blurFundo) fecharModalFunc();
});

// Interação com obras
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([...obrasNormais, ...obrasPremium]);
  if (intersects.length > 0) {
    const obra = intersects[0].object;
    const textura = obra.material.map.image.currentSrc || obra.material.map.image.src;
    abrirModal(textura);
  }
});

// Animação das obras
function animate() {
  requestAnimationFrame(animate);

  const tempo = Date.now() * 0.001;
  obrasNormais.forEach((obra, i) => {
    const angle = (tempo + i / totalNormais) * Math.PI * 2;
    obra.position.x = Math.cos(angle) * raioNormais;
    obra.position.z = Math.sin(angle) * raioNormais;
    obra.lookAt(0, 1.6, 0);
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();
