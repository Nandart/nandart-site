import ' ./index.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(5, 10, 5);
spotLight.castShadow = true;
scene.add(spotLight);

const floorTexture = new THREE.TextureLoader().load('./texturas/luz-circular.png');
const floorMaterial = new THREE.MeshStandardMaterial({
  map: floorTexture,
  metalness: 0.5,
  roughness: 0.4
});

const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
const backWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 20), wallMaterial);
backWall.position.set(0, 10, -25);
scene.add(backWall);

const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 20), wallMaterial);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-25, 10, 0);
scene.add(leftWall);

const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 20), wallMaterial);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(25, 10, 0);
scene.add(rightWall);

const loader = new THREE.TextureLoader();
const molduraTexture = loader.load('./imagens/moldura-dourada.jpg');
const obraEsquerda = loader.load('./imagens/obra-esquerda.jpg');
const obraDireita = loader.load('./imagens/obra-direita.jpg');
const obraCentral = loader.load('./imagens/obra-central.jpg');
const gemaTexture = loader.load('./imagens/gema-azul.jpg.png');

const frameMaterial = new THREE.MeshStandardMaterial({ map: molduraTexture });

const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.5, 0.2), frameMaterial);
leftFrame.position.set(-24.9, 10, 0);
scene.add(leftFrame);

const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.5, 0.2), frameMaterial);
rightFrame.position.set(24.9, 10, 0);
scene.add(rightFrame);

const centralFrame = new THREE.Mesh(new THREE.BoxGeometry(3.5, 4.5, 0.2), frameMaterial);
centralFrame.position.set(0, 10, -24.9);
scene.add(centralFrame);

const obraMaterialEsq = new THREE.MeshStandardMaterial({ map: obraEsquerda });
const obraMaterialDir = new THREE.MeshStandardMaterial({ map: obraDireita });
const obraMaterialCentral = new THREE.MeshStandardMaterial({ map: obraCentral });

const leftArt = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), obraMaterialEsq);
leftArt.position.set(-24.8, 10, 0);
scene.add(leftArt);

const rightArt = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), obraMaterialDir);
rightArt.position.set(24.8, 10, 0);
scene.add(rightArt);

const centralArt = new THREE.Mesh(new THREE.PlaneGeometry(3, 4), obraMaterialCentral);
centralArt.position.set(0, 10, -24.8);
scene.add(centralArt);

const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const vidroMaterial = new THREE.MeshStandardMaterial({
  map: gemaTexture,
  transparent: true,
  opacity: 0.9,
  roughness: 0.1,
  metalness: 0.3
});

const pedestalPositions = [-8, -4, 4, 8];
pedestalPositions.forEach(x => {
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32), pedestalMaterial);
  pedestal.position.set(x, 0.75, -20);
  pedestal.castShadow = true;
  scene.add(pedestal);

  const gema = new THREE.Mesh(new THREE.OctahedronGeometry(0.6), vidroMaterial);
  gema.position.set(x, 1.8, -20);
  gema.castShadow = true;
  scene.add(gema);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

