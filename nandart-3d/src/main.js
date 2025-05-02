// main.js definitivo e funcional para a galeria NANdART
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';

// Cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Câmara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 6);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#scene'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luzes
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 4, 4);
scene.add(pointLight);

// Plano de chão com reflexo
const floorTexture = new THREE.TextureLoader().load('assets/textures/obsidiana.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(2, 2);
const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Círculo de luz no chão
const ringTexture = new THREE.TextureLoader().load('assets/textures/luz-circular.png');
const ringMaterial = new THREE.MeshBasicMaterial({ map: ringTexture, transparent: true });
const ring = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), ringMaterial);
ring.rotation.x = -Math.PI / 2;
ring.position.y = 0.01;
scene.add(ring);

// Moldura central
const centralFrame = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 3),
  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('assets/imagens/obra-central.jpg') })
);
centralFrame.position.set(0, 2, -5.01);
scene.add(centralFrame);

// Frisos dourados (laterais e topo)
const frisoMaterial = new THREE.MeshBasicMaterial({ color: 0xf3c677 });
const frisos = [
  new THREE.Mesh(new THREE.BoxGeometry(10, 0.02, 0.01), frisoMaterial),
  new THREE.Mesh(new THREE.BoxGeometry(10, 0.02, 0.01), frisoMaterial),
];
frisos[0].position.set(0, 3.5, -5.01);
frisos[1].position.set(0, 0.5, -5.01);
frisos.forEach(f => scene.add(f));

// Quadros laterais
const obraEsquerda = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 2),
  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('assets/imagens/obra-esquerda.jpg') })
);
obraEsquerda.position.set(-4.5, 2, -2);
scene.add(obraEsquerda);

const obraDireita = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 2),
  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('assets/imagens/obra-direita.jpg') })
);
obraDireita.position.set(4.5, 2, -2);
scene.add(obraDireita);

// Vitrines com gemas (4 pedestais)
const pedestalGeometry = new THREE.BoxGeometry(0.8, 1, 0.8);
const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
const vidroMaterial = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load('assets/textures/vidro-reflexo.png'),
  transparent: true,
  opacity: 0.6,
});

const gemaTexture = new THREE.TextureLoader().load('assets/imagens/gema-azul.jpg.png');
const gemaMaterial = new THREE.MeshStandardMaterial({ map: gemaTexture });
const gemaGeometry = new THREE.OctahedronGeometry(0.25);

const pedestalPositions = [
  [-3, 0.5, -2],
  [-3, 0.5, 2],
  [3, 0.5, -2],
  [3, 0.5, 2],
];

pedestalPositions.forEach(pos => {
  const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
  pedestal.position.set(...pos);
  scene.add(pedestal);

  const vitrine = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), vidroMaterial);
  vitrine.position.set(pos[0], pos[1] + 0.7, pos[2]);
  scene.add(vitrine);

  const gema = new THREE.Mesh(gemaGeometry, gemaMaterial);
  gema.position.set(pos[0], pos[1] + 0.7, pos[2]);
  scene.add(gema);
});

// Modal de obra (clicar numa das obras)
window.addEventListener('click', () => {
  alert('Modal de obra em desenvolvimento');
});

// Controlo orbital
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 10;
controls.target.set(0, 2, 0);
controls.update();

// Animação
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Responsividade
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
