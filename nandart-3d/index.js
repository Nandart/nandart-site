import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 6, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableZoom = false;
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1.2);
spotLight.position.set(5, 15, 5);
spotLight.castShadow = true;
scene.add(spotLight);

const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x101010, metalness: 0.8, roughness: 0.2 });
const paredeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xf3c677 });

const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

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

const loader = new THREE.TextureLoader();
const frameTexture = loader.load('assets/imagens/moldura-dourada.jpg');
const obraEsquerda = loader.load('assets/imagens/obra-esquerda.jpg');
const obraDireita = loader.load('assets/imagens/obra-direita.jpg');
const obraCentral = loader.load('assets/imagens/obra-central.jpg');
const gemaTexture = loader.load('assets/imagens/gema-azul.jpg.png');

const frameMaterial = new THREE.MeshStandardMaterial({ map: frameTexture });
const obraMaterialEsq = new THREE.MeshStandardMaterial({ map: obraEsquerda });
const obraMaterialDir = new THREE.MeshStandardMaterial({ map: obraDireita });
const obraMaterialCen = new THREE.MeshStandardMaterial({ map: obraCentral });
const gemaMaterial = new THREE.MeshStandardMaterial({ map: gemaTexture, transparent: true, opacity: 0.95 });

const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.5, 0.2), frameMaterial);
leftFrame.position.set(-24.9, 10, 0);
scene.add(leftFrame);

const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.5, 0.2), frameMaterial);
rightFrame.position.set(24.9, 10, 0);
scene.add(rightFrame);

const leftArt = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), obraMaterialEsq);
leftArt.position.set(-24.8, 10, 0);
scene.add(leftArt);

const rightArt = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), obraMaterialDir);
rightArt.position.set(24.8, 10, 0);
scene.add(rightArt);

const centralFrame = new THREE.Mesh(new THREE.BoxGeometry(3.5, 4.5, 0.2), frameMaterial);
centralFrame.position.set(0, 10, -24.9);
scene.add(centralFrame);

const centralArt = new THREE.Mesh(new THREE.PlaneGeometry(3, 4), obraMaterialCen);
centralArt.position.set(0, 10, -24.8);
scene.add(centralArt);

const pedestalX = [-8, -4, 4, 8];
pedestalX.forEach((x) => {
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.4, 32), pedestalMaterial);
  pedestal.position.set(x, 0.7, 0);
  pedestal.castShadow = true;
  scene.add(pedestal);

  const cube = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), cubeMaterial);
  cube.position.set(x, 1.7, 0);
  cube.castShadow = true;
  scene.add(cube);

  const gema = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), gemaMaterial);
  gema.position.set(x, 1.7, 0);
  gema.castShadow = true;
  scene.add(gema);
});

const circularObras = [];
const numObras = 12;
const radius = 7;
for (let i = 0; i < numObras; i++) {
  const angle = (i / numObras) * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const obra = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.8), obraMaterialCen);
  obra.position.set(x, 4.2, z);
  obra.lookAt(0, 4.2, 0);
  obra.castShadow = true;
  scene.add(obra);
  circularObras.push(obra);
}

function animate() {
  requestAnimationFrame(animate);

  const speed = 0.003;
  circularObras.forEach((obra, i) => {
    const angle = performance.now() * speed + i;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    obra.position.set(x, 4.2, z);
    obra.lookAt(0, 4.2, 0);
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
