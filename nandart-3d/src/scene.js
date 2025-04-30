import * as THREE from 'three';

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

  // Cubos e pedestais
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

  return { renderer, scene, camera };
}

