/ index-93f8bb0e.js (compatível com GitHub Pages e Vercel)

// Carrega Three.js e OrbitControls via CDN
const scriptThree = document.createElement('script');
scriptThree.src = 'https://unpkg.com/three@0.155.0/build/three.min.js';
scriptThree.onload = () => {
  const scriptControls = document.createElement('script');
  scriptControls.src = 'https://unpkg.com/three@0.155.0/examples/js/controls/OrbitControls.js';
  scriptControls.onload = init;
  document.head.appendChild(scriptControls);
};
document.head.appendChild(scriptThree);

function init() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 6, 12);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0x444444);
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0xffffff, 1.2);
  spotLight.position.set(10, 15, 10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.3,
    roughness: 0.4,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x181818 });
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 20), wallMaterial);
  backWall.position.set(0, 10, -25);
  scene.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 20), wallMaterial);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-25, 10, 0);
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 20), wallMaterial);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.set(25, 10, 0);
  scene.add(rightWall);

  // Cubo de teste
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 1, 0);
  cube.castShadow = true;
  scene.add(cube);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

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
}
