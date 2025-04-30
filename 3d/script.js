import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';

let cena, camara, renderizador;
let cubos = [];
let obras = [];

function iniciarCena() {
  cena = new THREE.Scene();

  // Fundo
  const texturaFundo = new THREE.TextureLoader().load('assets/fundo/fundo.jpg');
  cena.background = texturaFundo;

  camara = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camara.position.z = 5;

  renderizador = new THREE.WebGLRenderer({ canvas: document.getElementById('cena3d'), antialias: true });
  renderizador.setSize(window.innerWidth, window.innerHeight);

  const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.6);
  cena.add(luzAmbiente);

  const luzDirecional = new THREE.PointLight(0xffffff, 1.2);
  luzDirecional.position.set(5, 10, 10);
  cena.add(luzDirecional);

  criarCubosPremium();
  criarObrasCirculares();

  animar();
}

function criarCubosPremium() {
  const imagens = ['cubo-premium1.jpg', 'cubo-premium2.jpg'];
  const posicoes = [-2.5, 2.5];

  imagens.forEach((img, i) => {
    const textura = new THREE.TextureLoader().load(`assets/cubos/${img}`);
    const material = new THREE.MeshStandardMaterial({ map: textura });
    const geometria = new THREE.BoxGeometry(1, 1, 1);
    const cubo = new THREE.Mesh(geometria, material);
    cubo.position.set(posicoes[i], 0, 0);
    cena.add(cubo);
    cubos.push(cubo);
  });
}

function criarObrasCirculares() {
  const totalObras = 8;
  const raio = 4;
  for (let i = 1; i <= totalObras; i++) {
    const angulo = (i / totalObras) * Math.PI * 2;
    const textura = new THREE.TextureLoader().load(`assets/obras/obra${i}.jpg`);
    const material = new THREE.MeshBasicMaterial({ map: textura });
    const geometria = new THREE.PlaneGeometry(1.2, 1.2);
    const quadro = new THREE.Mesh(geometria, material);
    quadro.position.set(Math.cos(angulo) * raio, 0, Math.sin(angulo) * raio);
    quadro.lookAt(0, 0, 0);
    cena.add(quadro);
    obras.push(quadro);
  }
}

function animar() {
  requestAnimationFrame(animar);
  cubos.forEach((cubo, i) => {
    const brilho = 0.5 + 0.5 * Math.sin(Date.now() * 0.002 + i);
    cubo.material.emissive = new THREE.Color(brilho, brilho, brilho);
  });
  renderizador.render(cena, camara);
}

window.addEventListener('resize', () => {
  camara.aspect = window.innerWidth / window.innerHeight;
  camara.updateProjectionMatrix();
  renderizador.setSize(window.innerWidth, window.innerHeight);
});

window.abrirAjuda = () => {
  const painel = document.getElementById('painel-ajuda');
  painel.style.display = painel.style.display === 'none' ? 'block' : 'none';
};

iniciarCena();
