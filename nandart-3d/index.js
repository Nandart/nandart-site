import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.6, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Luzes
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xf3c677, 1.5, 10, Math.PI / 4, 0.5);
spotLight.position.set(0, 5, 5);
spotLight.castShadow = true;
scene.add(spotLight);

// Chão
const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x0f0f0f,
  roughness: 0.3,
  metalness: 0.2
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Paredes
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,
  roughness: 0.7,
  metalness: 0.1
});

const backWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMaterial);
backWall.position.set(0, 2.5, -5);
scene.add(backWall);

const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMaterial);
leftWall.position.set(-5, 2.5, 0);
leftWall.rotation.y = Math.PI / 2;
scene.add(leftWall);

const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMaterial);
rightWall.position.set(5, 2.5, 0);
rightWall.rotation.y = -Math.PI / 2;
scene.add(rightWall);

// Ícones flutuantes
function criarIcone(src, x, y, largura = 0.5, altura = 0.5) {
  const texture = new THREE.TextureLoader().load(src);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  const geometry = new THREE.PlaneGeometry(largura, altura);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, -4.9);
  scene.add(mesh);
  return mesh;
}

const iconeInfo = criarIcone('assets/imagens/info.png', -4.3, 4.3, 0.8, 0.3);
const iconeMenu = criarIcone('assets/imagens/horizontes.png', -4.3, 3.8, 0.6, 0.6);
const iconeAjuda = criarIcone('assets/imagens/ajuda-flutuante.png', 4, 3.5, 0.6, 0.6);

// Ocultar ícone de ajuda após 20 segundos
setTimeout(() => {
  scene.remove(iconeAjuda);
}, 20000);

// Controlo de câmara
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 10;

// Responsividade
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Renderização
function animar() {
  requestAnimationFrame(animar);
  controls.update();
  renderer.render(scene, camera);
}
animar();
