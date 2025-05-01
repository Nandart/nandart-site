import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x121212);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 3, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('scene') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Iluminação ambiente e direcionada
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 10, 10);
spotLight.castShadow = true;
scene.add(spotLight);

// Círculo no chão como referência visual
const circleGeometry = new THREE.RingGeometry(2.8, 3, 64);
const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.rotation.x = -Math.PI / 2;
circle.position.y = 0.01;
scene.add(circle);

// Obra central fixa
const obraTexture = new THREE.TextureLoader().load('assets/imagens/premium1.jpg');
const obraMaterial = new THREE.MeshBasicMaterial({ map: obraTexture });
const obraGeometry = new THREE.PlaneGeometry(2.4, 3.2);
const obraCentral = new THREE.Mesh(obraGeometry, obraMaterial);
obraCentral.position.set(0, 2.5, -8);
scene.add(obraCentral);

// ÍCONES E INTERAÇÕES
const ajuda = document.getElementById('ajudaFlutuante');
setTimeout(() => {
  if (ajuda) ajuda.style.opacity = '0';
}, 20000);

const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
menuToggle.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
