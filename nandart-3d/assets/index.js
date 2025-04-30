// Inicializar a cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

// Criar câmara
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 12);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Luz ambiente
const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

// Spot de luz cenográfica
const spotLight = new THREE.SpotLight(0xffffff, 2);
spotLight.position.set(5, 10, 5);
spotLight.castShadow = true;
scene.add(spotLight);

// Piso tipo obsidiana líquida
const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x0f0f0f,
  metalness: 0.8,
  roughness: 0.2
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Paredes laterais e traseira (uniformizadas)
const paredeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });

const wallGeometry = new THREE.PlaneGeometry(50, 20);
const backWall = new THREE.Mesh(wallGeometry, paredeMaterial);
backWall.position.set(0, 10, -25);
scene.add(backWall);

const leftWall = new THREE.Mesh(wallGeometry, paredeMaterial);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-25, 10, 0);
scene.add(leftWall);

const rightWall = new THREE.Mesh(wallGeometry, paredeMaterial);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.set(25, 10, 0);
scene.add(rightWall);

// Pedestais e cubos
const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xf3c677 });

for (let i = -3; i <= 3; i += 2) {
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 1, 32),
    pedestalMaterial
  );
  pedestal.position.set(i * 2, 0.5, 0);
  pedestal.castShadow = true;
  scene.add(pedestal);

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    cubeMaterial
  );
  cube.position.set(i * 2, 1.5, 0);
  cube.castShadow = true;
  scene.add(cube);
}

// Responsividade
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animação
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
