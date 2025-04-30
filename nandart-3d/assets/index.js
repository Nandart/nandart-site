const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d0d0d);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 5, 14);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const loader = new THREE.TextureLoader();

const molduraMap = loader.load('./assets/textures/moldura-dourada.jpg');
const chaoMap = loader.load('./assets/textures/chao-obsidiana.jpg');

const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

const spots = [
  new THREE.SpotLight(0xffffff, 1),
  new THREE.SpotLight(0xffffff, 1),
  new THREE.SpotLight(0xffffff, 1)
];
spots[0].position.set(0, 10, -10);
spots[1].position.set(-4, 10, 0);
spots[2].position.set(4, 10, 0);
spots.forEach(light => {
  light.castShadow = true;
  light.angle = Math.PI / 6;
  scene.add(light);
});

[-4, -2, 2, 4].forEach(x => {
  const light = new THREE.PointLight(0xf3c677, 0.5, 3);
  light.position.set(x, 1, 0);
  scene.add(light);
});

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({ map: chaoMap, metalness: 1, roughness: 0.3 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const paredeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
const paredeGeo = new THREE.PlaneGeometry(40, 20);

const paredeFundo = new THREE.Mesh(paredeGeo, paredeMaterial);
paredeFundo.position.set(0, 10, -20);
scene.add(paredeFundo);

const paredeEsquerda = new THREE.Mesh(paredeGeo, paredeMaterial);
paredeEsquerda.rotation.y = Math.PI / 2;
paredeEsquerda.position.set(-20, 10, 0);
scene.add(paredeEsquerda);

const paredeDireita = new THREE.Mesh(paredeGeo, paredeMaterial);
paredeDireita.rotation.y = -Math.PI / 2;
paredeDireita.position.set(20, 10, 0);
scene.add(paredeDireita);

const molduraMaterial = new THREE.MeshStandardMaterial({ map: molduraMap });
const quadroGeo = new THREE.PlaneGeometry(3, 4);

const quadroCentro = new THREE.Mesh(quadroGeo, molduraMaterial);
quadroCentro.position.set(0, 10, -19.9);
scene.add(quadroCentro);

const quadroEsquerdo = new THREE.Mesh(quadroGeo, molduraMaterial);
quadroEsquerdo.rotation.y = Math.PI / 2;
quadroEsquerdo.position.set(-19.9, 10, -5);
scene.add(quadroEsquerdo);

const quadroDireito = new THREE.Mesh(quadroGeo, molduraMaterial);
quadroDireito.rotation.y = -Math.PI / 2;
quadroDireito.position.set(19.9, 10, 5);
scene.add(quadroDireito);

const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x222222 });

[-4, -2, 2, 4].forEach(x => {
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 1, 32),
    pedestalMat
  );
  base.position.set(x, 0.5, 0);
  base.castShadow = true;
  scene.add(base);

  const vidro = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshPhysicalMaterial({
      color: 0x88ccee,
      metalness: 0,
      roughness: 0,
      transmission: 1,
      thickness: 0.5,
      transparent: true,
      opacity: 1
    })
  );
  vidro.position.set(x, 1.5, 0);
  vidro.castShadow = true;
  scene.add(vidro);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
