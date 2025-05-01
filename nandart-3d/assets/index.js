// index.js (com paredes realistas, iluminação refinada e chão tipo obsidiana líquida)

// Cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

// Câmara
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 12);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Luz ambiente difusa
const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

// Spots de teto (cenográficos)
const ceilingSpots = [
  { x: -10, z: -5 },
  { x: 0, z: -5 },
  { x: 10, z: -5 }
];

ceilingSpots.forEach(pos => {
  const spot = new THREE.SpotLight(0xffffff, 0.7);
  spot.position.set(pos.x, 12, pos.z);
  spot.angle = Math.PI / 6;
  spot.penumbra = 0.4;
  spot.decay = 2;
  spot.distance = 30;
  spot.castShadow = true;
  scene.add(spot);
});

// Material do chão: obsidiana líquida
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x101010,
  metalness: 1,
  roughness: 0.1,
  envMapIntensity: 1
});

const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Materiais de parede com realismo
const paredeMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,
  roughness: 0.7,
  metalness: 0.2
});

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

// Interatividade dos ícones
function redirecionarPara(url) {
  window.location.href = url;
}

const infoIcon = document.getElementById("info-icon");
const menuIcon = document.getElementById("menu-icon");
const ajudaIcon = document.getElementById("ajuda-flutuante");

if (infoIcon) {
  infoIcon.addEventListener("click", () => redirecionarPara("/como-navegar/index.html"));
  infoIcon.addEventListener("touchstart", () => redirecionarPara("/como-navegar/index.html"));
}

if (menuIcon) {
  menuIcon.addEventListener("click", () => abrirMenu());
  menuIcon.addEventListener("touchstart", () => abrirMenu());
}

if (ajudaIcon) {
  ajudaIcon.addEventListener("click", () => redirecionarPara("/como-navegar/index.html"));
  ajudaIcon.addEventListener("touchstart", () => redirecionarPara("/como-navegar/index.html"));
  setTimeout(() => {
    ajudaIcon.style.display = "none";
  }, 20000);
}

function abrirMenu() {
  const opcoes = [
    { nome: "Submeter Obra", url: "/submeter.html" },
    { nome: "Como Navegar", url: "/como-navegar/index.html" },
    { nome: "Contactos", url: "/contactos.html" }
  ];

  const menuContainer = document.createElement("div");
  menuContainer.style.position = "absolute";
  menuContainer.style.top = "60px";
  menuContainer.style.left = "20px";
  menuContainer.style.backgroundColor = "#111";
  menuContainer.style.border = "1px solid #aaa";
  menuContainer.style.padding = "10px";
  menuContainer.style.borderRadius = "8px";
  menuContainer.style.zIndex = "1000";
  menuContainer.style.color = "white";
  menuContainer.style.fontFamily = "sans-serif";

  opcoes.forEach(opcao => {
    const link = document.createElement("div");
    link.textContent = opcao.nome;
    link.style.cursor = "pointer";
    link.style.marginBottom = "6px";
    link.addEventListener("click", () => {
      redirecionarPara(opcao.url);
    });
    link.addEventListener("touchstart", () => {
      redirecionarPara(opcao.url);
    });
    menuContainer.appendChild(link);
  });

  document.body.appendChild(menuContainer);

  function fecharMenu(event) {
    if (!menuContainer.contains(event.target) && event.target !== menuIcon) {
      menuContainer.remove();
      document.removeEventListener("click", fecharMenu);
      document.removeEventListener("touchstart", fecharMenu);
    }
  }
  document.addEventListener("click", fecharMenu);
  document.addEventListener("touchstart", fecharMenu);
}

