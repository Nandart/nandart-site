import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

// Cena e renderizador
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Luz ambiente e spots
scene.add(new THREE.AmbientLight(0x333333));

const spot = new THREE.SpotLight(0xffffff, 1.2);
spot.position.set(5, 12, 5);
spot.castShadow = true;
scene.add(spot);

// Materiais
const paredeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
const chaoMaterial = new THREE.MeshStandardMaterial({ color: 0x101010, metalness: 0.6, roughness: 0.3 });
const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, transparent: true, opacity: 0.7 });

// Chão
const chao = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), chaoMaterial);
chao.rotation.x = -Math.PI / 2;
chao.receiveShadow = true;
scene.add(chao);

// Paredes
const paredeFundo = new THREE.Mesh(new THREE.PlaneGeometry(60, 20), paredeMaterial);
paredeFundo.position.set(0, 10, -30);
scene.add(paredeFundo);

const paredeEsq = new THREE.Mesh(new THREE.PlaneGeometry(60, 20), paredeMaterial);
paredeEsq.rotation.y = Math.PI / 2;
paredeEsq.position.set(-30, 10, 0);
scene.add(paredeEsq);

const paredeDir = new THREE.Mesh(new THREE.PlaneGeometry(60, 20), paredeMaterial);
paredeDir.rotation.y = -Math.PI / 2;
paredeDir.position.set(30, 10, 0);
scene.add(paredeDir);

// Texturas
const loader = new THREE.TextureLoader();
const texturaGema = loader.load('assets/imagens/gema-azul.jpg.png');

// Pedestais e cubos
const posicoesPedestais = [-18, -14, 14, 18];
posicoesPedestais.forEach((x) => {
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.4, 32), pedestalMaterial);
  pedestal.position.set(x, 0.7, 0);
  pedestal.castShadow = true;
  scene.add(pedestal);

  const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cubeMaterial);
  cube.position.set(x, 1.7, 0);
  cube.castShadow = true;

  const gema = new THREE.Mesh(new THREE.OctahedronGeometry(0.4), new THREE.MeshStandardMaterial({
    map: texturaGema,
    transparent: true,
    opacity: 0.8
  }));
  gema.position.set(x, 1.9, 0);
  gema.rotation.y = Math.random() * Math.PI;
  scene.add(cube);
  scene.add(gema);
});

// Responsividade
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Toque e clique
function registarInteracoes() {
  const clique = () => console.log('Elemento interativo tocado.');
  document.querySelectorAll('.icon, .ajuda-flutuante').forEach(el => {
    el.addEventListener('click', clique);
    el.addEventListener('touchstart', clique);
  });
}
registarInteracoes();

// Animação
function animate() {
  requestAnimationFrame(animate);
  scene.traverse((obj) => {
    if (obj.geometry && obj.geometry.type === 'OctahedronGeometry') {
      obj.rotation.y += 0.005;
    }
  });
  renderer.render(scene, camera);
}
animate();
