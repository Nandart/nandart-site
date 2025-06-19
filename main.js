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

// Configurações responsivas
const configMap = {
  XS: { obraSize: 0.9, circleRadius: 2.4, wallDistance: 8, cameraZ: 12, cameraY: 5.4, textSize: 0.4 },
  SM: { obraSize: 1.1, circleRadius: 2.8, wallDistance: 9.5, cameraZ: 13, cameraY: 5.7, textSize: 0.45 },
  MD: { obraSize: 1.3, circleRadius: 3.3, wallDistance: 10.5, cameraZ: 14, cameraY: 6.1, textSize: 0.5 },
  LG: { obraSize: 1.45, circleRadius: 3.6, wallDistance: 11, cameraZ: 15, cameraY: 6.4, textSize: 0.55 }
};

function getViewportLevel() {
  const width = window.innerWidth;
  if (width < 480) return 'XS';
  if (width < 768) return 'SM';
  if (width < 1024) return 'MD';
  return 'LG';
}

let config = configMap[getViewportLevel()];

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
  {
    title: "Shadows of Light",
    artist: "Rénner Nunes",
    year: "2024",
    price: "0.01",
    tokenURI: "https://ipfs.io/ipfs/bafybeia6bbrqltffiwc4hq6zfwciybwdjmwi3z7hn4w3wo7b3mbaxshfqy/shadows_of_light.json",
    artista: "0x913b3984583Ac44dE06Ef480a8Ac925DEA378b41"
  }
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
const textureLoader = new THREE.TextureLoader();

// Configuração da cena
function setupScene() {
  scene.background = new THREE.Color(0x111111);
  
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
  groundMirror.position.y = 0.001;
  scene.add(groundMirror);

  // Iluminação
  const hemisphereLight = new THREE.HemisphereLight(0xfff2e0, 0x202020, 1.35);
  hemisphereLight.groundColor.setHSL(0.1, 0.2, 0.15);
  scene.add(hemisphereLight);

  const fillLight = new THREE.AmbientLight(0xfff2dd, 0.225);
  scene.add(fillLight);

  const spotLightLeft = new THREE.SpotLight(0xfff2dd, 1.5);
  spotLightLeft.position.set(-10, 8, 0);
  spotLightLeft.angle = Math.PI / 6;
  spotLightLeft.penumbra = 0.3;
  spotLightLeft.decay = 2;
  spotLightLeft.distance = 25;
  spotLightLeft.castShadow = true;
  spotLightLeft.shadow.mapSize.width = 2048;
  spotLightLeft.shadow.mapSize.height = 2048;
  spotLightLeft.shadow.bias = -0.0005;
  scene.add(spotLightLeft);

  const spotLightRight = new THREE.SpotLight(0xfff2dd, 1.5);
  spotLightRight.position.set(10, 8, 0);
  spotLightRight.angle = Math.PI / 6;
  spotLightRight.penumbra = 0.3;
  spotLightRight.decay = 2;
  spotLightRight.distance = 25;
  spotLightRight.castShadow = true;
  spotLightRight.shadow.mapSize.width = 2048;
  spotLightRight.shadow.mapSize.height = 2048;
  spotLightRight.shadow.bias = -0.0005;
  scene.add(spotLightRight);

  // Paredes
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 28),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
  );
  backWall.position.set(0, 14, -config.wallDistance);
  backWall.rotation.y = Math.PI;
  backWall.layers.set(LAYERS.WALLS);
  scene.add(backWall);

  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 28),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
  );
  leftWall.position.set(-15, 14, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.layers.set(LAYERS.WALLS);
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 28),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
  );
  rightWall.position.set(15, 14, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.layers.set(LAYERS.WALLS);
  scene.add(rightWall);

  // Colunas
  const columnMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x89b4ff,
    metalness: 0.9,
    roughness: 0.05,
    clearcoat: 0.9,
    emissive: 0x406080,
    emissiveIntensity: 0.25
  });

  const createColumn = (x, z) => {
    const geometry = new THREE.CylinderGeometry(0.4, 0.4, 14, 32);
    const column = new THREE.Mesh(geometry, columnMaterial);
    column.position.set(x, 7, z);
    column.castShadow = true;
    column.receiveShadow = true;
    scene.add(column);
  };

  createColumn(-10, -config.wallDistance + 2);
  createColumn(10, -config.wallDistance + 2);
  createColumn(-12, 0);
  createColumn(12, 0);
  createColumn(-10, config.wallDistance - 2);
  createColumn(10, config.wallDistance - 2);

  // Texto 3D
  const fontLoader = new FontLoader();
  fontLoader.load(
    'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/fonts/helvetiker_regular.typeface.json',
    font => {
      const textGeo = new TextGeometry('NANdART', {
        font,
        size: config.textSize + 0.1,
        height: 0.12,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.015,
        bevelSegments: 5
      });

      textGeo.computeBoundingBox();
      const width = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x;

      const text = new THREE.Mesh(
        textGeo,
        new THREE.MeshPhysicalMaterial({
          color: 0xd8b26c,
          metalness: 1,
          roughness: 0.25,
          emissive: 0x8b6e3b,
          emissiveIntensity: 0.25
        })
      );

      text.position.set(-width / 2, 15.5, -config.wallDistance - 3.98);
      scene.add(text);
    }
  );

  // Obras de arte
  artworkData.forEach((art, i) => {
    const texture = textureLoader.load(art.tokenURI);
    const angle = (i / artworkData.length) * Math.PI * 2;
    const x = Math.cos(angle) * config.circleRadius;
    const z = Math.sin(angle) * config.circleRadius;
    const rotationY = -angle + Math.PI;

    const artwork = new THREE.Mesh(
      new THREE.PlaneGeometry(config.obraSize, config.obraSize),
      new THREE.MeshPhysicalMaterial({
        map: texture,
        roughness: 0.2,
        metalness: 0.05,
        side: THREE.DoubleSide
      })
    );
    artwork.position.set(x, 4.2, z);
    artwork.rotation.y = rotationY;
    artwork.castShadow = true;
    artwork.receiveShadow = true;
    artwork.userData = {
      originalPosition: new THREE.Vector3(x, 4.2, z),
      originalRotation: new THREE.Euler(0, rotationY, 0),
      originalScale: new THREE.Vector3(1, 1, 1)
    };
    scene.add(artwork);
    artworks.push(artwork);
  });
}

function handleArtInteraction(event) {
  event.preventDefault();
  
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(artworks, true);
  
  if (intersects.length > 0) {
    const clickedArtwork = intersects[0].object;
    const index = artworks.indexOf(clickedArtwork);
    
    if (index !== -1) {
      if (isHighlighted && selectedArtwork === clickedArtwork) {
        restoreArtwork();
      } 
      else if (!isHighlighted) {
        highlightArtwork(clickedArtwork, artworkData[index]);
      }
    }
  } 
  else if (isHighlighted) {
    restoreArtwork();
  }
}

async function highlightArtwork(artwork, data) {
  if (isHighlighted) return;
  isHighlighted = true;
  selectedArtwork = artwork;
  
  const highlightGroup = new THREE.Group();
  highlightGroup.position.copy(artwork.position);
  highlightGroup.rotation.copy(artwork.rotation);
  highlightGroup.scale.copy(artwork.scale);
  highlightGroup.add(artwork);
  scene.add(highlightGroup);
  
  scene.remove(artwork);
  artwork.position.set(0, 0, 0);
  artwork.rotation.set(0, 0, 0);
  artwork.scale.set(1, 1, 1);

  await Promise.all([
    gsap.to(highlightGroup.position, {
      x: 0,
      y: 8.4,
      z: -config.wallDistance / 2,
      duration: 0.7,
      ease: 'power2.out'
    }),
    gsap.to(highlightGroup.scale, {
      x: 3,
      y: 3,
      z: 3,
      duration: 0.7,
      ease: 'power2.out'
    }),
    gsap.to(highlightGroup.rotation, {
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    })
  ]);

  showArtModal(data);
}

function showArtModal(data) {
  modalTitle.textContent = data.title;
  modalArtist.textContent = data.artist;
  modalYear.textContent = data.year;
  modalPrice.textContent = `${data.price} ETH`;

  modal.style.display = 'flex';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  
  setTimeout(() => {
    modal.classList.add('active');
    blurOverlay.classList.add('active');
  }, 10);
}

async function restoreArtwork() {
  if (!isHighlighted || !selectedArtwork) return;

  const artwork = selectedArtwork;
  const highlightGroup = artwork.parent;

  await Promise.all([
    gsap.to(highlightGroup.position, {
      x: artwork.userData.originalPosition.x,
      y: artwork.userData.originalPosition.y,
      z: artwork.userData.originalPosition.z,
      duration: 0.7,
      ease: 'power2.out'
    }),
    gsap.to(highlightGroup.rotation, {
      y: artwork.userData.originalRotation.y,
      duration: 0.7,
      ease: 'power2.out'
    }),
    gsap.to(highlightGroup.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.7,
      ease: 'power2.out'
    })
  ]);

  highlightGroup.remove(artwork);
  artwork.position.copy(artwork.userData.originalPosition);
  artwork.rotation.copy(artwork.userData.originalRotation);
  artwork.scale.copy(artwork.userData.originalScale);
  scene.add(artwork);
  scene.remove(highlightGroup);
  
  modal.classList.remove('active');
  blurOverlay.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
  
  isHighlighted = false;
  selectedArtwork = null;
}

async function toggleWalletConnection() {
  if (!window.ethereum) {
    alert('Please install MetaMask to connect your wallet.');
    return;
  }

  try {
    if (walletButton.classList.contains('connected')) {
      walletButton.classList.remove('connected');
      walletButton.innerHTML = 'Connect Wallet';
    } else {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(accounts[0]);
      const formattedBalance = ethers.formatEther(balance);
      const shortBalance = parseFloat(formattedBalance).toFixed(3);

      walletButton.classList.add('connected');
      walletButton.innerHTML = `Connected <span>${shortBalance} ETH</span>`;
    }
  } catch (err) {
    console.error('Wallet connection error:', err);
    alert('Error connecting wallet. Please try again.');
  }
}

async function handlePurchase() {
  if (!selectedArtwork) return;

  const index = artworks.indexOf(selectedArtwork);
  const data = artworkData[index];

  if (!window.ethereum) {
    alert('Install MetaMask to purchase this artwork.');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const tx = await signer.sendTransaction({
      to: data.artista,
      value: ethers.parseEther(data.price)
    });

    alert(`Transaction sent!\nHash: ${tx.hash}`);
    await tx.wait();
    alert('Purchase confirmed! Thank you for acquiring this artwork.');
  } catch (err) {
    console.error('Purchase error:', err);
    alert('Error during purchase. Please try again.');
  }
}

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

function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * -0.00012 * (isHighlighted ? 0.5 : 1);

  artworks.forEach((artwork, i) => {
    if (artwork === selectedArtwork) return;

    const angle = time + (i / artworks.length) * Math.PI * 2;
    const x = Math.cos(angle) * config.circleRadius;
    const z = Math.sin(angle) * config.circleRadius;
    const rotationY = -angle + Math.PI;

    artwork.position.x = x;
    artwork.position.z = z;
    artwork.rotation.y = rotationY;
  });

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
  config = configMap[getViewportLevel()];
});
