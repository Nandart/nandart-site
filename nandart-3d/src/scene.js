import * as THREE from 'three';
import { createGemaComTampa } from './gema.js';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0d0d);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 12);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Luzes
  const ambientLight = new THREE.AmbientLight(0x444444);
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(5, 10, 5);
  spotLight.castShadow = true;
  scene.add(spotLight);

  // Chão
  const floorGeometry = new THREE.PlaneGeometry(50, 50);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x101010,
    metalness: 0.8,
    roughness: 0.2
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Parede traseira
  const wallGeometry = new THREE.PlaneGeometry(50, 20);
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
  backWall.position.set(0, 10, -25);
  scene.add(backWall);

  // Adicionar gemas com tampa
  const gemas = [];
  for (let i = -3; i <= 3; i += 2) {
    const gema = createGemaComTampa(i * 2, 0);
    gemas.push(gema);
    scene.add(gema);
  }

  // Guardar referência para interatividade futura
  scene.userData.gemas = gemas;

  return { renderer, scene, camera };
}

