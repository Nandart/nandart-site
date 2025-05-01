// Importar Three.js via CDN no HTML, portanto não usamos "import * as THREE"

// Cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

// Câmara
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 12);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Luz ambiente
const ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);

// Spot principal
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(5, 10, 5);
spotLight.castShadow = true;
scene.add(spotLight);

// Materiais
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x101010, metalness: 0.8, roughness: 0.2 });
const paredeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xf3c677 });

// Chão
const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Paredes
const backWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 20), paredeMaterial);
backWall.position.set(0, 10, -25);
scene.add(backWall);

const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 20), paredeMaterial);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-25, 10, 0);
scene.add(leftWall);

const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 20), paredeMaterial);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(25, 10, 0);
scene.add(rightWall);

// Texturas
const loader = new THREE.TextureLoader();
const frameTexture = loader.load('assets/imagens/moldura-dourada.jpg');
const obraEsquerda = loader.load('assets/imagens/obra-esquerda.jpg');
const obraDireita = loader.load('assets/imagens/obra-direita.jpg');

// Molduras laterais
const frameMaterial = new THREE.MeshStandardMaterial({ map: frameTexture });
const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.5, 0.2), frameMaterial);
leftFrame.position.set(-24.9, 10, 0);
scene.add(leftFrame);
const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.5, 0.2), frameMaterial);
rightFrame.position.set(24.9, 10, 0);
scene.add(rightFrame);

// Obras dentro das molduras
const obraMaterialEsq = new THREE.MeshStandardMaterial({ map: obraEsquerda });
const obraMaterialDir = new THREE.MeshStandardMaterial({ map: obraDireita });
const leftArt = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), obraMaterialEsq);
leftArt.position.set(-24.8, 10, 0);
scene.add(leftArt);
const rightArt = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), obraMaterialDir);
rightArt.position.set(24.8, 10, 0);
scene.add(rightArt);

// Pedestais e cubos
const pedestalXPositions = [-8, -4, 4, 8];
pedestalXPositions.forEach((x) => {
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32), pedestalMaterial);
  pedestal.position.set(x, 0.75, 0);
  pedestal.castShadow = true;
  scene.add(pedestal);

  const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cubeMaterial);
  cube.position.set(x, 1.75, 0);
  cube.castShadow = true;
  scene.add(cube);
});

// Responsividade
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animação
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Interatividade dos ícones
const ajuda = document.getElementById('ajuda-flutuante');
const modal = document.getElementById('modal-info');
const fecharModal = document.getElementById('fechar-modal');
const iconeInfo = document.getElementById('icone-info');
const iconeMenu = document.getElementById('icone-menu');
const menuLateral = document.getElementById('menu-lateral');

iconeInfo.addEventListener('click', () => modal.classList.remove('oculto'));
iconeInfo.addEventListener('touchstart', () => modal.classList.remove('oculto'));

fecharModal.addEventListener('click', () => modal.classList.add('oculto'));
fecharModal.addEventListener('touchstart', () => modal.classList.add('oculto'));

iconeMenu.addEventListener('click', () => menuLateral.classList.toggle('aberto'));
iconeMenu.addEventListener('touchstart', () => menuLateral.classList.toggle('aberto'));
