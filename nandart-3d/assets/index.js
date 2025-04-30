import * as THREE from 'three';

// Cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d0d0d);

// Câmara
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 3, 8);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Luz ambiente
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// Luz superior
const spotLight = new THREE.SpotLight(0xffffff, 2);
spotLight.position.set(0, 10, 0);
spotLight.castShadow = true;
scene.add(spotLight);

// Luz lateral de preenchimento
const fillLight = new THREE.PointLight(0xffffff, 0.6);
fillLight.position.set(0, 3, 6);
scene.add(fillLight);

// Chão
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x101010,
    metalness: 0.8,
    roughness: 0.2
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Paredes traseiras
const wallGeometry = new THREE.PlaneGeometry(20, 10);
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
backWall.position.set(0, 5, -10);
scene.add(backWall);

// Materiais
const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xf3c677 });

// Posição dos pedestais: dois à esquerda e dois à direita
const pedestalPositions = [
    { x: -4, z: -2 },
    { x: -4, z: 2 },
    { x: 4, z: -2 },
    { x: 4, z: 2 }
];

pedestalPositions.forEach(pos => {
    const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 1, 32),
        pedestalMaterial
    );
    pedestal.position.set(pos.x, 0.5, pos.z);
    pedestal.castShadow = true;
    scene.add(pedestal);

    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        cubeMaterial
    );
    cube.position.set(pos.x, 1.5, pos.z);
    cube.castShadow = true;
    scene.add(cube);
});

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
