const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d0d0d);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4, 10);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Luz ambiente
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Luz direcional
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 15, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Chão
const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x202020,
  metalness: 0.5,
  roughness: 0.3
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Paredes
const backWall = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 20),
  new THREE.MeshStandardMaterial({ color: 0x181818 })
);
backWall.position.set(0, 10, -25);
scene.add(backWall);

// Pedestais + gemas
const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xf3c677, metalness: 0.8, roughness: 0.1 });

for (let i = -3; i <= 3; i += 2) {
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    pedestalMaterial
  );
  pedestal.position.set(i * 2, 0.5, 0);
  pedestal.castShadow = true;
  pedestal.receiveShadow = true;
  scene.add(pedestal);

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    cubeMaterial
  );
  cube.position.set(i * 2, 1.5, 0);
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);
}

// Responsividade
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
