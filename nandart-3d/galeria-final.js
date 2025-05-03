import * as "./",THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.155.0/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'https://unpkg.com/three@0.155.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.155.0/examples/jsm/geometries/TextGeometry.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 6, 14);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('scene').appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0x333333));
const spotLight = new THREE.SpotLight(0xffffff, 1.5);
spotLight.position.set(10, 20, 10);
spotLight.castShadow = true;
scene.add(spotLight);

const focusLight = new THREE.SpotLight(0xffffff, 1.2, 30, Math.PI / 6, 0.4, 2);
focusLight.visible = false;
scene.add(focusLight);

const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.6, roughness: 0.2 });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x181818 });
const criarParede = (w, h, x, y, z, ry = 0) => {
  const parede = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMaterial);
  parede.position.set(x, y, z);
  parede.rotation.y = ry;
  scene.add(parede);
};
criarParede(50, 20, 0, 10, -25);
criarParede(50, 20, -25, 10, 0, Math.PI / 2);
criarParede(50, 20, 25, 10, 0, -Math.PI / 2);

const fontLoader = new FontLoader();
fontLoader.load('https://unpkg.com/three@0.155.0/examples/fonts/optimer_regular.typeface.json', font => {
  const geometry = new TextGeometry('NANdART', {
    font, size: 1.2, height: 0.2,
    bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02
  });
  geometry.computeBoundingBox();
  const offset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x222222, metalness: 0.3 });
  const textMesh = new THREE.Mesh(geometry, material);
  textMesh.position.set(offset, 18.5, -24.8);
  scene.add(textMesh);
});

const loader = new THREE.TextureLoader();
const quadroGeo = new THREE.PlaneGeometry(6, 8);
const molduraMat = new THREE.MeshStandardMaterial({ color: 0xd4af37 });

function quadroFixo(img, x, y, z) {
  const textura = loader.load(`./assets/${img}`);
  const mat = new THREE.MeshBasicMaterial({ map: textura });
  const quadro = new THREE.Mesh(quadroGeo, mat);
  quadro.position.set(x, y, z + 0.01);
  scene.add(quadro);
  const moldura = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 8.2), molduraMat);
  moldura.position.set(x, y, z);
  scene.add(moldura);
}
quadroFixo("obra-central.jpg", 0, 10, -24.95);
quadroFixo("obra-lateral-esquerda.jpg", -24.95, 10, 0);
quadroFixo("obra-lateral-direita.jpg", 24.95, 10, 0);

const circle = new THREE.Mesh(
  new THREE.RingGeometry(4.8, 5, 64),
  new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
);
circle.rotation.x = -Math.PI / 2;
circle.position.y = 0.01;
scene.add(circle);

const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.3 });
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x33aaff, transparent: true, transmission: 1, opacity: 0.5, roughness: 0, metalness: 0.8
});
const pedestalGema = (x, z) => {
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2, 32), pedestalMaterial);
  base.position.set(x, 1, z);
  scene.add(base);
  const gema = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), glassMaterial);
  gema.position.set(x, 2.3, z);
  scene.add(gema);
};
pedestalGema(-10, -12);
pedestalGema(-10, 12);
pedestalGema(10, -12);
pedestalGema(10, 12);

const obras = [], raio = 4.9;
for (let i = 0; i < 12; i++) {
  const angle = (i / 12) * Math.PI * 2;
  const tex = loader.load(`./assets/obra${i + 1}.jpg`);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
  const quadro = new THREE.Mesh(new THREE.PlaneGeometry(2, 2.6), mat);
  quadro.position.set(Math.cos(angle) * raio, 5, Math.sin(angle) * raio);
  quadro.lookAt(0, 5, 0);
  quadro.userData = { ang: angle, original: true };
  obras.push(quadro);
  scene.add(quadro);
}

const premium = [];
const premiumImgs = ["premium1.jpg", "premium2.jpg", "premium3.jpg"];
const estrela = loader.load("./assets/estrela.png");
premiumImgs.forEach((img, i) => {
  const tex = loader.load(`./assets/${img}`);
  const mat = new THREE.MeshBasicMaterial({ map: tex });
  const quadro = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 3.2), mat);
  const ang = (i / 3) * Math.PI * 2;
  quadro.position.set(Math.cos(ang) * 3.5, 6.8, Math.sin(ang) * 3.5);
  quadro.lookAt(0, 6.8, 0);
  scene.add(quadro);
  premium.push(quadro);
  const estrelaMat = new THREE.SpriteMaterial({ map: estrela });
  const icone = new THREE.Sprite(estrelaMat);
  icone.scale.set(0.4, 0.4, 1);
  icone.position.set(1, 1.6, 0.1);
  quadro.add(icone);
});

let selecionada = null;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const legenda = document.createElement('div');
legenda.style = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);color:white;font-size:16px;font-family:sans-serif;opacity:0;transition:opacity 0.5s';
document.body.appendChild(legenda);

function interagir(x, y) {
  pointer.x = (x / window.innerWidth) * 2 - 1;
  pointer.y = -(y / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersect = raycaster.intersectObjects(obras);
  if (intersect.length > 0) {
    if (selecionada) restaurar();
    const obra = intersect[0].object;
    selecionada = obra;
    obra.userData.origPos = obra.position.clone();
    obra.userData.original = false;
    obra.position.set(0, 6, 2);
    obra.scale.set(3, 3, 3);
    focusLight.position.set(0, 12, 6);
    focusLight.target = obra;
    focusLight.visible = true;
    legenda.textContent = "Obra Desconhecida — Autor Anónimo";
    legenda.style.opacity = 1;
    obras.forEach(q => { if (q !== obra) q.material.opacity = 0.1; });
  } else {
    restaurar();
  }
}

function restaurar() {
  if (!selecionada) return;
  selecionada.position.copy(selecionada.userData.origPos);
  selecionada.scale.set(1, 1, 1);
  selecionada.userData.original = true;
  selecionada = null;
  focusLight.visible = false;
  legenda.style.opacity = 0;
  obras.forEach(q => q.material.opacity = 1);
}

window.addEventListener('click', e => interagir(e.clientX, e.clientY));
window.addEventListener('touchstart', e => {
  if (e.touches.length > 0) interagir(e.touches[0].clientX, e.touches[0].clientY);
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
  obras.forEach(q => {
    if (q.userData.original) {
      q.userData.ang += -0.002;
      q.position.set(Math.cos(q.userData.ang) * raio, 5, Math.sin(q.userData.ang) * raio);
      q.lookAt(0, 5, 0);
    }
  });
  renderer.render(scene, camera);
}
animate();
