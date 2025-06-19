import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import gsap from 'gsap';
import { ethers } from 'ethers';

// Configuração inicial
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  canvas: document.getElementById('scene'),
  antialias: true 
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.6;

// Elementos DOM
const modal = document.querySelector('.art-modal');
const modalTitle = document.getElementById('art-title');
const modalArtist = document.getElementById('art-artist');
const modalYear = document.getElementById('art-year');
const modalPrice = document.getElementById('art-price');
const buyButton = document.getElementById('buy-art');
const blurOverlay = document.getElementById('blur-overlay');
const walletButton = document.getElementById('wallet-button');
const curationPanel = document.getElementById('curation-panel');

// Dados das obras de arte
const artworkData = [
  {
    title: "Fragment of Eternity",
    artist: "Rénner Nunes",
    year: "2023",
    price: "0.08",
    tokenURI: "https://ipfs.io/ipfs/bafkreibhrxsmbi6t36qupa5zw6mrc5n5voirsclvkkolobj7wudm5emot4/fragment_of_eternity.json",
    artista: "0x913b3984583Ac44dE06Ef480a8Ac925DEA378b41"
  },
  // ... outros artworks ...
];

// Estado da aplicação
let isHighlighted = false;
let selectedArtwork = null;
const artworks = [];
const artworkReflections = [];
const LAYERS = {
  DEFAULT: 0,
  HIGHLIGHTED: 1,
  WALLS: 2
};

// Configuração da cena
function setupScene() {
  // Chão reflexivo
  const groundMirror = new Reflector(
    new THREE.PlaneGeometry(100, 100),
    {
      clipBias: 0.003,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      color: 0x111111
    }
  );
  groundMirror.rotateX(-Math.PI / 2);
  scene.add(groundMirror);

  // Iluminação
  const hemisphereLight = new THREE.HemisphereLight(0xfff2e0, 0x202020, 1.35);
  scene.add(hemisphereLight);

  const ambientLight = new THREE.AmbientLight(0xfff2dd, 0.225);
  scene.add(ambientLight);

  // Configuração das paredes e luzes...
  // ... (manter toda a configuração original de luzes e paredes)
}

// Funções de interação
function setupInteractions() {
  renderer.domElement.addEventListener('click', handleArtInteraction);

  if (walletButton) {
    walletButton.addEventListener('click', toggleWalletConnection);
  }

  if (buyButton) {
    buyButton.addEventListener('click', handlePurchase);
  }

  document.addEventListener('click', (e) => {
    if (isHighlighted && !modal.contains(e.target) && e.target !== renderer.domElement) {
      restoreArtwork();
    }
  });
}

// Funções principais
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
    const shortBalance = parseFloat(formattedBalance).toFixed(3);

    walletButton.classList.add('connected');
    walletButton.innerHTML = `Connected <span>${shortBalance} ETH</span>`;
  } catch (error) {
    console.error('Wallet connection error:', error);
    alert('Error connecting wallet');
  }
}

async function handlePurchase() {
  if (!selectedArtwork) return;

  const index = artworks.indexOf(selectedArtwork);
  const data = artworkData[index];

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tx = await signer.sendTransaction({
      to: data.artista,
      value: ethers.parseEther(data.price)
    });

    alert(`Transaction sent: ${tx.hash}`);
    await tx.wait();
    alert('Purchase confirmed!');
  } catch (error) {
    console.error('Purchase error:', error);
    alert('Purchase failed');
  }
}

// Funções de animação e renderização
function animate() {
  requestAnimationFrame(animate);
  
  // Animar obras de arte
  artworks.forEach((artwork, i) => {
    if (artwork === selectedArtwork) return;
    
    // ... lógica de animação original ...
  });

  renderer.render(scene, camera);
}

// Inicialização
setupScene();
setupInteractions();
animate();

// Handler de redimensionamento
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
