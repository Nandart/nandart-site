// Biblioteca já incluída via script tradicional no HTML

// Cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

// Câmara focada na sala de ajuda logo ao início
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 12);
camera.lookAt(0, 4, 0);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Luz ambiente
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// Spots direcionais (ajuda + reflexo)
const spot1 = new THREE.SpotLight(0xffffff, 0.8);
spot1.position.set(0, 8, 8);
spot1.angle = Math.PI / 6;
spot1.castShadow = true;
scene.add(spot1);

// Piso reflexivo (simulado por material brilhante para simplificar em CDN)
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x101010,
  metalness: 0.9,
  roughness: 0.1
});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Painéis de ajuda flutuantes (mock: geometrias simples com cores)
const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.3, roughness: 0.7 });

function createHelpPanel(x, y, z, texturePath) {
  const texture = new THREE.TextureLoader().load(texturePath);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(4, 2.5), material);
  panel.position.set(x, y, z);
  panel.castShadow = true;
  return panel;
}

scene.add(createHelpPanel(-6, 5, 0, 'assets/imagens/ajuda/ajuda-rotacao.jpg'));
scene.add(createHelpPanel(-2, 5, 0, 'assets/imagens/ajuda/ajuda-cubo.jpg'));
scene.add(createHelpPanel(2, 5, 0, 'assets/imagens/ajuda/ajuda-modal.jpg'));
scene.add(createHelpPanel(6, 5, 0, 'assets/imagens/ajuda/ajuda-premium.jpg'));

// Responsividade
window.addEventListener('resize', () => {
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
