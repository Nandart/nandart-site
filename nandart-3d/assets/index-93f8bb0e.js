
// index-93f8bb0e.js — Versão alinhada com layout real da galeria NANdART
import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.155.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 6, 14);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('scene').appendChild(renderer.domElement);

// Iluminação
scene.add(new THREE.AmbientLight(0x444444));

const spotlight = new THREE.SpotLight(0xffffff, 1.5);
spotlight.position.set(10, 20, 10);
spotlight.castShadow = true;
scene.add(spotlight);

// Chão reflexivo
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x111111,
  metalness: 0.5,
  roughness: 0.3
});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Paredes com frisos dourados
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x181818 });
const createWall = (width, height, posX, posY, posZ, rotY = 0) => {
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(width, height), wallMaterial);
  wall.position.set(posX, posY, posZ);
  wall.rotation.y = rotY;
  scene.add(wall);
};
createWall(50, 20, 0, 10, -25); // Parede traseira
createWall(50, 20, -25, 10, 0, Math.PI / 2); // Parede esquerda
createWall(50, 20, 25, 10, 0, -Math.PI / 2); // Parede direita

// Texturas das obras
const loader = new THREE.TextureLoader();
const obras = {
  central: loader.load('./assets/obra-central.jpg'),
  esquerda: loader.load('./assets/obra-esquerda.jpg'),
  direita: loader.load('./assets/obra-lateral-direita.jpg')
};

// Molduras com quadros fixos
const molduraMaterial = new THREE.MeshStandardMaterial({ color: 0xd4af37 });
const quadroGeometry = new THREE.PlaneGeometry(6, 8);

const criarQuadro = (texture, posX, posY, posZ) => {
  const quadroMaterial = new THREE.MeshBasicMaterial({ map: texture });
  const quadro = new THREE.Mesh(quadroGeometry, quadroMaterial);
  quadro.position.set(posX, posY, posZ + 0.01);
  scene.add(quadro);

  const moldura = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 8.2), molduraMaterial);
  moldura.position.set(posX, posY, posZ);
  scene.add(moldura);
};

criarQuadro(obras.central, 0, 10, -24.95);      // Central
criarQuadro(obras.esquerda, -24.95, 10, 0);     // Esquerda
criarQuadro(obras.direita, 24.95, 10, 0);       // Direita

// Círculo branco no chão
const circle = new THREE.Mesh(
  new THREE.RingGeometry(4.8, 5, 64),
  new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
);
circle.rotation.x = -Math.PI / 2;
circle.position.y = 0.01;
scene.add(circle);

// Controlo de câmara
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Responsividade
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Loop de animação
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
