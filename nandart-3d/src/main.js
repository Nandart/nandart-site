import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/controls/OrbitControls.js';

const cena = new THREE.Scene();
cena.background = new THREE.Color(0x1a1a1a);

const camara = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camara.position.set(0, 5, 15);

const renderizador = new THREE.WebGLRenderer({ antialias: true });
renderizador.setSize(window.innerWidth, window.innerHeight);
renderizador.shadowMap.enabled = true;
document.getElementById('scene').appendChild(renderizador.domElement);

const luzAmbiente = new THREE.AmbientLight(0x444444);
cena.add(luzAmbiente);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(5, 10, 5);
spotLight.castShadow = true;
cena.add(spotLight);

// Materiais
const materialChao = new THREE.MeshStandardMaterial({
  color: 0x101010,
  metalness: 0.8,
  roughness: 0.2
});
const materialParede = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
const materialPedestal = new THREE.MeshStandardMaterial({ color: 0x222222 });
const materialCubo = new THREE.MeshStandardMaterial({ color: 0xf3c677 });
const texturaLoader = new THREE.TextureLoader();

// Texturas
const texturaMoldura = texturaLoader.load('src/imagens/moldura-dourada.jpg');
const texturaObraEsquerda = texturaLoader.load('src/imagens/obra-esquerda.jpg');
const texturaObraDireita = texturaLoader.load('src/imagens/obra-direita.jpg');
const texturaObraCentral = texturaLoader.load('src/imagens/obra-central.jpg');
const texturaGema = texturaLoader.load('src/imagens/gema-azul.jpg.png');

// Paredes
const paredeFundo = new THREE.Mesh(new THREE.PlaneGeometry(50, 20), materialParede);
paredeFundo.position.set(0, 10, -25);
cena.add(paredeFundo);

const paredeEsq = new THREE.Mesh(new THREE.PlaneGeometry(50, 20), materialParede);
paredeEsq.rotation.y = Math.PI / 2;
paredeEsq.position.set(-25, 10, 0);
cena.add(paredeEsq);

const paredeDir = new THREE.Mesh(new THREE.PlaneGeometry(50, 20), materialParede);
paredeDir.rotation.y = -Math.PI / 2;
paredeDir.position.set(25, 10, 0);
cena.add(paredeDir);

// Chão
const chao = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), materialChao);
chao.rotation.x = -Math.PI / 2;
chao.receiveShadow = true;
cena.add(chao);

// Molduras e obras nas paredes
const materialMoldura = new THREE.MeshStandardMaterial({ map: texturaMoldura });

const molduraEsq = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.5, 0.2), materialMoldura);
molduraEsq.position.set(-24.9, 10, 0);
cena.add(molduraEsq);

const molduraDir = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.5, 0.2), materialMoldura);
molduraDir.position.set(24.9, 10, 0);
cena.add(molduraDir);

const materialObraEsq = new THREE.MeshStandardMaterial({ map: texturaObraEsquerda });
const obraEsq = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), materialObraEsq);
obraEsq.position.set(-24.8, 10, 0);
cena.add(obraEsq);

const materialObraDir = new THREE.MeshStandardMaterial({ map: texturaObraDireita });
const obraDir = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), materialObraDir);
obraDir.position.set(24.8, 10, 0);
cena.add(obraDir);

// Obra central no fundo
const materialObraCentral = new THREE.MeshStandardMaterial({ map: texturaObraCentral });
const obraCentral = new THREE.Mesh(new THREE.PlaneGeometry(3, 4), materialObraCentral);
obraCentral.position.set(0, 11, -24.8);
cena.add(obraCentral);

// Pedestais com gemas (exemplo básico)
const posicoesCubos = [-8, -4, 4, 8];
posicoesCubos.forEach((x) => {
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32), materialPedestal);
  pedestal.position.set(x, 0.75, 0);
  pedestal.castShadow = true;
  cena.add(pedestal);

  const cubo = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materialCubo);
  cubo.position.set(x, 1.5, 0);
  cubo.castShadow = true;
  cena.add(cubo);

  const gema = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), new THREE.MeshStandardMaterial({ map: texturaGema, transparent: true, opacity: 0.9 }));
  gema.position.set(x, 1.7, 0);
  cena.add(gema);
});

// Controlo de câmara
const controlos = new OrbitControls(camara, renderizador.domElement);
controlos.enableDamping = true;
controlos.dampingFactor = 0.1;
controlos.rotateSpeed = 0.3;
controlos.enablePan = false;
controlos.minDistance = 10;
controlos.maxDistance = 30;

// Responsividade
window.addEventListener('resize', () => {
  camara.aspect = window.innerWidth / window.innerHeight;
  camara.updateProjectionMatrix();
  renderizador.setSize(window.innerWidth, window.innerHeight);
});

// Loop de animação
function animar() {
  requestAnimationFrame(animar);
  controlos.update();
  renderizador.render(cena, camara);
}
animar();
