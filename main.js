import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/controls/OrbitControls.js';

// Cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Câmara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 8);

// Renderizador
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Luz ambiente quente
const light = new THREE.PointLight(0xffd8a8, 2, 50);
light.position.set(0, 5, 2);
scene.add(light);

// Chão reflexivo
const groundGeo = new THREE.PlaneGeometry(20, 20);
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x111111,
  metalness: 0.5,
  roughness: 0.2
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Textura das obras
const obraTexturePaths = [
  'imagem/obra1.jpg',
  'imagem/obra2.jpg',
  'imagem/obra3.jpg',
  'imagem/obra4.jpg',
  'imagem/obra5.jpg',
  'imagem/obra6.jpg'
];

// Carregador de texturas
const loader = new THREE.TextureLoader();

// Criar obras em círculo
const obras = [];
const radius = 4;
obraTexturePaths.forEach((path, i) => {
  const tex = loader.load(path);
  const geo = new THREE.PlaneGeometry(1.5, 1.5);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
  const mesh = new THREE.Mesh(geo, mat);
  const angle = (i / obraTexturePaths.length) * Math.PI * 2;
  mesh.position.set(Math.cos(angle) * radius, 1.5, Math.sin(angle) * radius);
  mesh.lookAt(0, 1.5, 0);
  scene.add(mesh);
  obras.push({ mesh, angle });
});

// Obras premium suspensas
const premiumPaths = [
  'imagem/premium1.jpg',
  'imagem/premium2.jpg'
];

premiumPaths.forEach((path, i) => {
  const tex = loader.load(path);
  const geo = new THREE.PlaneGeometry(1.7, 1.7);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, 3.3 - i * 1.8, 0);
  mesh.lookAt(0, 1.5, 0);
  scene.add(mesh);
});

// Título NANdART na parede
const fontLoader = new THREE.FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', font => {
  const geo = new THREE.TextGeometry('NANdART', {
    font: font,
    size: 0.7,
    height: 0.05
  });
  const mat = new THREE.MeshStandardMaterial({ color: 0xd4af37 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(-2.5, 4.2, -4.5);
  scene.add(mesh);
});

// Controlo de câmara
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.3;

// Animação
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Responsivo
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
