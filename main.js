import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 10);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Iluminação
const ambientLight = new THREE.AmbientLight(0x0d0d26, 0.7);
scene.add(ambientLight);

// Chão refletivo
const floorGeometry = new THREE.PlaneGeometry(20, 50);
const floorReflector = new Reflector(floorGeometry, {
  clipBias: 0.003,
  textureWidth: window.innerWidth * window.devicePixelRatio,
  textureHeight: window.innerHeight * window.devicePixelRatio,
  color: 0x222244
});
floorReflector.rotation.x = -Math.PI / 2;
scene.add(floorReflector);

// Paredes laterais
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x0d0d26 });
const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMaterial);
leftWall.position.set(-5, 2.5, 0);
leftWall.rotation.y = Math.PI / 2;
scene.add(leftWall);

const rightWall = leftWall.clone();
rightWall.position.set(5, 2.5, 0);
rightWall.rotation.y = -Math.PI / 2;
scene.add(rightWall);

// Tecto com faixa de luz
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(10, 50), wallMaterial);
ceiling.position.y = 5;
ceiling.rotation.x = Math.PI / 2;
scene.add(ceiling);

const lightStrip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 50), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
lightStrip.position.set(0, 4.99, 0);
scene.add(lightStrip);

// Quadros com néon
const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
for (let i = 0; i < 4; i++) {
  const frame = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), frameMaterial);
  frame.position.set(-4.9, 2.5, -10 + i * 7);
  frame.lookAt(camera.position);
  scene.add(frame);

  const frame2 = frame.clone();
  frame2.position.x = 4.9;
  scene.add(frame2);
}

// Controlo de navegação
const controls = new PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => controls.lock(), false);
scene.add(controls.getObject());

// Movimento WASD
const keys = {};
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

function animate() {
  requestAnimationFrame(animate);

  if (controls.isLocked === true) {
    const speed = 0.1;
    if (keys['KeyW']) controls.moveForward(speed);
    if (keys['KeyS']) controls.moveForward(-speed);
    if (keys['KeyA']) controls.moveRight(-speed);
    if (keys['KeyD']) controls.moveRight(speed);
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});