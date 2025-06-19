import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import gsap from 'gsap';
import { ethers } from 'ethers';

// Configuração inicial
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Elementos DOM
const modal = document.querySelector('.art-modal');
const modalTitle = document.getElementById('art-title');
const modalArtist = document.getElementById('art-artist');
const modalYear = document.getElementById('art-year');
const modalPrice = document.getElementById('art-price');
const buyButton = document.getElementById('buy-art');
const blurOverlay = document.getElementById('blur-overlay');
const walletButton = document.getElementById('wallet-button');

// Dados das obras de arte
const artworkData = [
  {
    title: "Fragment of Eternity",
    artist: "Rénner Nunes",
    year: "2023",
    price: "0.08",
    tokenURI: "https://ipfs.io/ipfs/bafkreibhrxsmbi6t36qupa5zw6mrc5n5voirsclvkkolobj7wudm5emot4/fragment_of_eternity.json"
  },
  // Adicione outras obras aqui...
];

// Configuração da cena
function setupScene() {
  scene.background = new THREE.Color(0x111111);
  
  // Chão reflexivo
  const groundMirror = new Reflector(new THREE.PlaneGeometry(100, 100), {
    clipBias: 0.003,
    color: 0x111111
  });
  groundMirror.rotateX(-Math.PI / 2);
  scene.add(groundMirror);

  // Iluminação
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
}

// Funções de interação
function setupInteractions() {
  if (walletButton) {
    walletButton.addEventListener('click', toggleWalletConnection);
  }

  if (buyButton) {
    buyButton.addEventListener('click', handlePurchase);
  }
}

async function toggleWalletConnection() {
  if (!window.ethereum) {
    alert('Please install MetaMask!');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(accounts[0]);
    const formattedBalance = ethers.formatEther(balance);
    
    walletButton.textContent = `Connected: ${parseFloat(formattedBalance).toFixed(3)} ETH`;
  } catch (error) {
    console.error('Error connecting wallet:', error);
  }
}

function handlePurchase() {
  // Implementar lógica de compra
  alert('Purchase functionality will be implemented here');
}

// Animação
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Inicialização
setupScene();
setupInteractions();
animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
