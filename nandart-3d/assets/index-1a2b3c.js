import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d0d0d);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('bg') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;

const ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(5, 10, 5);
spotLight.castShadow = true;
scene.add(spotLight);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x101010, metalness: 0.8, roughness: 0.2 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const backWall = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 20),
  new THREE.MeshStandardMaterial({ color: 0x111111 })
);
backWall.position.set(0, 10, -25);
scene.add(backWall);

function createGemaComTampa(x, z) {
  const grupo = new THREE.Group();

  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 1, 32),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  pedestal.position.y = 0.5;
  pedestal.castShadow = true;
  grupo.add(pedestal);

  const gema = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.5, 0),
    new THREE.MeshPhysicalMaterial({
      color: 0x66ccff,
      roughness: 0,
      metalness: 0.3,
      transmission: 1,
      thickness: 0.5,
      transparent: true
    })
  );
  gema.position.y = 1.5;
  gema.castShadow = true;
  grupo.add(gema);

  const tampa = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.05, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  );
  tampa.position.y = 1.85;
  grupo.add(tampa);

  let aberta = false;
  grupo.userData.toggle = () => {
    gsap.to(tampa.rotation, {
      x: aberta ? 0 : Math.PI / 2,
      duration: 0.8,
      ease: "power2.inOut"
    });
    aberta = !aberta;
  };

  grupo.position.set(x, 0, z);
  return grupo;
}

const gemas = [];
for (let i = -3; i <= 3; i += 2) {
  const gema = createGemaComTampa(i * 2, 0);
  gemas.push(gema);
  scene.add(gema);
}

window.addEventListener("click", () => {
  gemas.forEach((g) => g.userData.toggle());
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
