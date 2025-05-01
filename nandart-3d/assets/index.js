// index.js — NANdART 3D com obras normais, premium, reflexos e interação

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(5, 10, 5);
spotLight.castShadow = true;
scene.add(spotLight);

const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x101010, metalness: 0.8, roughness: 0.2 });
const paredeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });

const loader = new THREE.TextureLoader();
const gemaTexture = loader.load('assets/imagens/gema-azul.jpg.png');
const molduraTexture = loader.load('assets/imagens/moldura-dourada.jpg');
const estrelaTexture = loader.load('assets/imagens/estrela-premium.png');

const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

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

const pedestalXPositions = [-8, -4, 4, 8];
const gemas = [];
const tampas = [];
const obrasEmergentes = [];

pedestalXPositions.forEach((x) => {
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1, 32), pedestalMaterial);
  pedestal.position.set(x, 0.5, 0);
  pedestal.castShadow = true;
  scene.add(pedestal);

  const cubeMaterial = new THREE.MeshPhysicalMaterial({
    transmission: 1,
    opacity: 1,
    transparent: true,
    roughness: 0,
    metalness: 0,
    clearcoat: 1,
    reflectivity: 1,
    thickness: 0.5,
    color: 0xffffff,
    side: THREE.DoubleSide
  });
  const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cubeMaterial);
  cube.position.set(x, 1.5, 0);
  cube.castShadow = true;
  scene.add(cube);

  const gema = new THREE.Mesh(new THREE.OctahedronGeometry(0.4), new THREE.MeshStandardMaterial({ map: gemaTexture }));
  gema.position.set(x, 1.5, 0);
  scene.add(gema);
  gemas.push(gema);

  const tampa = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.1, 1.02), pedestalMaterial);
  tampa.position.set(x, 2.05, 0);
  scene.add(tampa);
  tampas.push(tampa);

  const obra = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 3.5), new THREE.MeshStandardMaterial({ color: 0xffffff }));
  obra.position.set(0, 5, 2);
  obra.visible = false;
  scene.add(obra);
  obrasEmergentes.push(obra);

  cube.userData.index = gemas.length - 1;
  cube.name = 'interactivo';
  scene.add(cube);
});

// Obras normais suspensas
const obrasGrupo = new THREE.Group();
const numObras = 15;
const raio = 10;

for (let i = 0; i < numObras; i++) {
  const ang = (i / numObras) * Math.PI * 2;
  const x = Math.cos(ang) * raio;
  const z = Math.sin(ang) * raio;

  const tex = loader.load(`assets/imagens/obra${i + 1}.jpg`);
  const quadro = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), new THREE.MeshStandardMaterial({ map: tex }));
  quadro.position.set(x, 3, z);
  quadro.lookAt(0, 3, 0);
  obrasGrupo.add(quadro);

  const reflexo = quadro.clone();
  reflexo.material = new THREE.MeshStandardMaterial({ map: tex, opacity: 0.2, transparent: true });
  reflexo.scale.y = -1;
  reflexo.position.y = 2.5;
  obrasGrupo.add(reflexo);
}
scene.add(obrasGrupo);

// Obras premium suspensas
const premiumData = [
  { file: 'premium1.jpg', x: -3, z: -2 },
  { file: 'premium2.jpg', x: 3, z: 2 },
  { file: 'estrela-premium.jpg', x: 0, z: 0 }
];

premiumData.forEach(({ file, x, z }) => {
  const tex = loader.load(`assets/imagens/${file}`);
  const moldura = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 3.6), new THREE.MeshStandardMaterial({ map: molduraTexture }));
  moldura.position.set(x, 4.2, z);
  scene.add(moldura);

  const obra = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), new THREE.MeshStandardMaterial({ map: tex }));
  obra.position.set(x, 4.2, z + 0.01);
  scene.add(obra);

  const estrela = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.4), new THREE.MeshStandardMaterial({ map: estrelaTexture, transparent: true }));
  estrela.position.set(x + 1.1, 5.7, z + 0.02);
  scene.add(estrela);
});

// Interação cubos
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function handleInteraction(clientX, clientY) {
  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    if (object.name === 'interactivo') {
      const i = object.userData.index;
      const tampa = tampas[i];
      const obra = obrasEmergentes[i];
      const isOpen = obra.visible;

      if (!isOpen) {
        obra.visible = true;
        new TWEEN.Tween(tampa.position).to({ y: 3 }, 1200).easing(TWEEN.Easing.Quadratic.InOut).start();
      } else {
        new TWEEN.Tween(tampa.position).to({ y: 2.05 }, 1200).easing(TWEEN.Easing.Quadratic.InOut).start();
        obra.visible = false;
      }
    } else {
      obrasEmergentes.forEach((obra, i) => {
        if (obra.visible) {
          obra.visible = false;
          new TWEEN.Tween(tampas[i].position).to({ y: 2.05 }, 1200).easing(TWEEN.Easing.Quadratic.InOut).start();
        }
      });
    }
  }
}

window.addEventListener('click', (e) => handleInteraction(e.clientX, e.clientY));
window.addEventListener('touchstart', (e) => {
  if (e.touches.length > 0) {
    handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
  gemas.forEach((g) => { g.rotation.y += 0.005 });
  obrasGrupo.rotation.y += 0.0015;
  renderer.render(scene, camera);
}
animate();
