import * as THREE from 'three';

let scene, camera, renderer, raycaster, mouse;
let obraGroup, selectedObra;
let modal;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  // Criar o modal de informações (inicialmente invisível)
  createModal();

  // Iluminação
  const light = new THREE.AmbientLight(0x404040, 2);
  scene.add(light);

  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // Chão da galeria
  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = Math.PI / -2;
  scene.add(floor);

  // Obras de arte
  obraGroup = new THREE.Group();
  scene.add(obraGroup);
  addArtwork();

  // Posicionar a câmera
  camera.position.z = 5;

  // Evento de clique
  window.addEventListener('click', onMouseClick);

  // Animação
  animate();
}

function addArtwork() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const obra = new THREE.Mesh(geometry, material);

  obra.position.set(3, 0.5, 0);
  obra.name = "Obra 1";  // Nome da obra (pode ser dinâmico)
  obraGroup.add(obra);
}

function createModal() {
  // Modal de exemplo, com informações sobre a obra
  modal = document.createElement('div');
  modal.style.position = 'absolute';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  modal.style.color = 'white';
  modal.style.padding = '20px';
  modal.style.display = 'none';
  modal.innerHTML = '<h3>Detalhes da Obra</h3><p id="obra-details">Clique em uma obra para ver os detalhes.</p>';
  document.body.appendChild(modal);
}

function onMouseClick(event) {
  // Calcula a posição do mouse na tela (de -1 a 1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Atualiza o raycaster com a nova posição do mouse
  raycaster.update();

  // Detecta as interseções com os objetos
  const intersects = getIntersections();

  if (intersects.length > 0) {
    const clickedObra = intersects[0].object;
    if (clickedObra !== selectedObra) {
      selectedObra = clickedObra;
      showModal(clickedObra);
    }
  }
}

function getIntersections() {
  // Cria um raycast a partir da posição do mouse
  raycaster.setFromCamera(mouse, camera);

  // Detecta quais objetos intersectam com o raio
  return raycaster.intersectObjects(obraGroup.children);
}

function showModal(obra) {
  const obraDetails = document.getElementById('obra-details');
  obraDetails.innerHTML = `<strong>Nome:</strong> ${obra.name}<br><strong>Descrição:</strong> Uma obra de arte interativa!`;
  modal.style.display = 'block';  // Exibe o modal
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Inicializa a cena
init();
