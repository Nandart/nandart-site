// index.js
// NANdART 3D - Versão remodelada com fidelidade ao layout original

// Importar Three.js
import * as THREE from 'three';

// Cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

// Câmara
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 6, 18);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Luz ambiente
scene.add(new THREE.AmbientLight(0x333333));

// Luzes de teto (spots)
const spotLightPositions = [
  [-10, 12, 0], [0, 12, 0], [10, 12, 0]
];
spotLightPositions.forEach(pos => {
  const spot = new THREE.SpotLight(0xffffff, 1);
  spot.position.set(...pos);
  spot.angle = Math.PI / 6;
  spot.castShadow = true;
  scene.add(spot);
});

// Materiais
const paredeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x101010, metalness: 0.6, roughness: 0.3 });
const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const cubeMaterial = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.7, color: 0x9ecfff });

// Loader de texturas
const loader = new THREE.TextureLoader();
const molduraTexture = loader.load('assets/imagens/moldura-dourada.jpg');
const obraCentral = loader.load('assets/imagens/obra-central.jpg');
const obraEsq = loader.load('assets/imagens/obra-esquerda.jpg');
const obraDir = loader.load('assets/imagens/obra-direita.jpg');
const estrelaPremium = loader.load('assets/imagens/estrela-premium.png');
const gemaTexture = loader.load('assets/imagens/gema-azul.jpg.png');

// Chão
const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Círculo de luz no chão
const circleGeom = new THREE.RingGeometry(7.8, 8, 64);
const circleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const circle = new THREE.Mesh(circleGeom, circleMat);
circle.rotation.x = -Math.PI / 2;
circle.position.y = 0.01;
scene.add(circle);

// Paredes
const wallGeom = new THREE.PlaneGeometry(50, 20);
const backWall = new THREE.Mesh(wallGeom, paredeMaterial);
backWall.position.set(0, 10, -25);
scene.add(backWall);

const leftWall = new THREE.Mesh(wallGeom, paredeMaterial);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-25, 10, 0);
scene.add(leftWall);

const rightWall = new THREE.Mesh(wallGeom, paredeMaterial);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(25, 10, 0);
scene.add(rightWall);

// Frisos dourados (paredes)
const frisoMat = new THREE.MeshStandardMaterial({ map: molduraTexture });
[backWall, leftWall, rightWall].forEach(wall => {
  const friso = new THREE.Mesh(new THREE.BoxGeometry(50, 0.05, 0.1), frisoMat);
  friso.position.set(0, 12, 0.1);
  wall.add(friso);
});

// Nome NANdART
const loaderFont = new THREE.FontLoader();
loaderFont.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
  const textGeom = new THREE.TextGeometry('NANdART', {
    font: font,
    size: 1.2,
    height: 0.1
  });
  const textMat = new THREE.MeshStandardMaterial({ color: 0xf3c677 });
  const textMesh = new THREE.Mesh(textGeom, textMat);
  textMesh.position.set(-5.5, 17.5, -24.9);
  scene.add(textMesh);
});

// Molduras e obras nas paredes
function criarQuadro(texture, x, y, z) {
  const moldura = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.5, 0.2), frisoMat);
  moldura.position.set(x, y, z);
  scene.add(moldura);
  const obra = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), new THREE.MeshStandardMaterial({ map: texture }));
  obra.position.set(x, y, z + 0.11);
  scene.add(obra);
}
criarQuadro(obraEsq, -24.8, 10, 0);
criarQuadro(obraDir, 24.8, 10, 0);
criarQuadro(obraCentral, 0, 10, -24.8);

// Pedestais com cubos e gemas
const pedestalX = [-10, -7, 7, 10];
pedestalX.forEach(x => {
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 1.4, 32), pedestalMaterial);
  pedestal.position.set(x, 0.7, 0);
  pedestal.castShadow = true;
  scene.add(pedestal);

  const cube = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), cubeMaterial);
  cube.position.set(x, 1.6, 0);
  scene.add(cube);

  const gema = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({ map: gemaTexture, transparent: true, opacity: 0.9 }));
  gema.position.set(x, 1.6, 0);
  scene.add(gema);
});

// Obras normais suspensas (em círculo)
const obrasNormais = [];
const numObras = 12;
for (let i = 0; i < numObras; i++) {
  const angle = (i / numObras) * Math.PI * 2;
  const x = 8 * Math.cos(angle);
  const z = 8 * Math.sin(angle);
  const obra = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 1.6),
    new THREE.MeshStandardMaterial({ map: loader.load(`assets/imagens/obra${i + 1}.jpg`), side: THREE.DoubleSide })
  );
  obra.position.set(x, 3.2, z);
  obra.lookAt(0, 3.2, 0);
  obrasNormais.push(obra);
  scene.add(obra);
}

// Obras premium suspensas acima das normais
const premiumCoords = [[0, 5.5, -9], [0, 5.5, 9]];
premiumCoords.forEach((pos, i) => {
  const moldura = new THREE.Mesh(new THREE.BoxGeometry(2, 2.5, 0.1), frisoMat);
  moldura.position.set(...pos);
  scene.add(moldura);

  const obra = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 2.2),
    new THREE.MeshStandardMaterial({ map: loader.load(`assets/imagens/premium${i + 1}.jpg`) })
  );
  obra.position.set(pos[0], pos[1], pos[2] + 0.06);
  scene.add(obra);

  const estrela = new THREE.Mesh(
    new THREE.PlaneGeometry(0.4, 0.4),
    new THREE.MeshBasicMaterial({ map: estrelaPremium, transparent: true })
  );
  estrela.position.set(pos[0] + 0.7, pos[1] + 0.9, pos[2] + 0.07);
  scene.add(estrela);
});

// Animação
function animate() {
  requestAnimationFrame(animate);
  obrasNormais.forEach((obra, i) => {
    const angle = (Date.now() * 0.0001 + i / numObras) * Math.PI * 2;
    obra.position.x = 8 * Math.cos(angle);
    obra.position.z = 8 * Math.sin(angle);
    obra.lookAt(0, 3.2, 0);
  });
  renderer.render(scene, camera);
}
animate();

// Responsividade
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
