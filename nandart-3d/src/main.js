// main.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('scene').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(5, 15, 5);
spotLight.castShadow = true;
scene.add(spotLight);

// Materiais
const paredeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
const pisoMaterial = new THREE.MeshStandardMaterial({ color: 0x101010, metalness: 0.5, roughness: 0.3 });

const vidroMaterial = new THREE.MeshPhysicalMaterial({
  transparent: true,
  opacity: 0.6,
  roughness: 0,
  transmission: 1,
  thickness: 0.5
});

const cuboMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const gemaTexture = new THREE.TextureLoader().load('src/imagens/gema-azul.jpg.png');
const gemaMaterial = new THREE.MeshStandardMaterial({ map: gemaTexture, transparent: true, opacity: 0.95 });

const texturaChao = new THREE.TextureLoader().load('src/texturas/obsidiana.jpg');
texturaChao.wrapS = texturaChao.wrapT = THREE.RepeatWrapping;
texturaChao.repeat.set(2, 2);
pisoMaterial.map = texturaChao;

// Chão
const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), pisoMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Círculo de luz no chão
const circulo = new THREE.Mesh(
  new THREE.RingGeometry(6.5, 7, 64),
  new THREE.MeshBasicMaterial({ color: 0xf3c677, side: THREE.DoubleSide })
);
circulo.rotation.x = -Math.PI / 2;
circulo.position.y = 0.01;
scene.add(circulo);

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

// Quadros fixos
const textureLoader = new THREE.TextureLoader();
const molduraTexture = textureLoader.load('src/imagens/moldura-dourada.jpg');
const obraEsquerda = textureLoader.load('src/imagens/obra-esquerda.jpg');
const obraDireita = textureLoader.load('src/imagens/obra-direita.jpg');
const obraCentral = textureLoader.load('src/imagens/obra-central.jpg');

const molduraMaterial = new THREE.MeshStandardMaterial({ map: molduraTexture });
const quadroGeometry = new THREE.BoxGeometry(2.5, 3.5, 0.2);

const esquerda = new THREE.Mesh(quadroGeometry, molduraMaterial);
esquerda.position.set(-24.9, 10, 0);
scene.add(esquerda);

const direita = new THREE.Mesh(quadroGeometry, molduraMaterial);
direita.position.set(24.9, 10, 0);
scene.add(direita);

const centro = new THREE.Mesh(quadroGeometry, molduraMaterial);
centro.position.set(0, 10, -24.9);
scene.add(centro);

// Obras dentro das molduras
const obraMaterialEsq = new THREE.MeshBasicMaterial({ map: obraEsquerda });
const obraMaterialDir = new THREE.MeshBasicMaterial({ map: obraDireita });
const obraMaterialCen = new THREE.MeshBasicMaterial({ map: obraCentral });

const geoObra = new THREE.PlaneGeometry(2, 3);
const obraE = new THREE.Mesh(geoObra, obraMaterialEsq);
obraE.position.set(-24.8, 10, 0.01);
scene.add(obraE);

const obraD = new THREE.Mesh(geoObra, obraMaterialDir);
obraD.position.set(24.8, 10, 0.01);
scene.add(obraD);

const obraC = new THREE.Mesh(geoObra, obraMaterialCen);
obraC.position.set(0, 10, -24.8);
scene.add(obraC);

// Cubos + Gemas
const posicoesCubos = [-8, -4, 4, 8];
posicoesCubos.forEach(x => {
  const vitrine = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), vidroMaterial);
  vitrine.position.set(x, 1.6, 0);
  vitrine.castShadow = true;
  scene.add(vitrine);

  const gema = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), gemaMaterial);
  gema.position.set(x, 1.6, 0);
  scene.add(gema);
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
  controls.update();
  scene.traverse(obj => {
    if (obj.name === 'obra-circular') {
      obj.rotation.y += 0.002;
    }
  });
  renderer.render(scene, camera);
}
animate();
