import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/controls/OrbitControls.js';

// Cena e câmara
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 5);

// Renderizador
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Luz ambiente e direcional
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const spotLight = new THREE.SpotLight(0xffffff, 1.2);
spotLight.position.set(5, 8, 5);
spotLight.castShadow = true;
scene.add(ambientLight, spotLight);

// Chão com reflexo suave
const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.3, roughness: 0.6 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Cubos com gemas
const cubos = [];
const loader = new THREE.TextureLoader();
const texturaGema = loader.load('imagens/gema-azul.jpg.png');

for (let i = 0; i < 6; i++) {
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.6, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.5 })
  );
  base.position.set(Math.cos(i) * 3, 0.3, Math.sin(i) * 3);
  base.castShadow = true;

  const gema = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 32, 32),
    new THREE.MeshStandardMaterial({ map: texturaGema, emissive: 0x222244, roughness: 0.2 })
  );
  gema.position.y = 0.8;
  gema.castShadow = true;
  base.add(gema);

  scene.add(base);
  cubos.push({ base, gema });
}

// Controlo de câmara
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Interatividade: clique na gema abre modal de obra
let obraAberta = null;
function onPointerDown(event) {
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cubos.map(c => c.gema));

  if (intersects.length > 0) {
    const obra = intersects[0].object;
    obra.scale.set(1.5, 1.5, 1.5);
    obra.material.emissiveIntensity = 1.5;
    obraAberta = obra;
  } else if (obraAberta) {
    obraAberta.scale.set(1, 1, 1);
    obraAberta.material.emissiveIntensity = 0.5;
    obraAberta = null;
  }
}

window.addEventListener('click', onPointerDown);
window.addEventListener('touchstart', onPointerDown);

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
  renderer.render(scene, camera);
}
animate();
