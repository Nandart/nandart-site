import * as THREE from 'three';
import { gsap } from 'gsap';

export function createGemaComTampa(x = 0, z = 0) {
  const grupo = new THREE.Group();

  // Pedestal
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 1, 32),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  pedestal.position.y = 0.5;
  pedestal.castShadow = true;
  grupo.add(pedestal);

  // Gema
  const gema = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.5, 0),
    new THREE.MeshPhysicalMaterial({
      color: 0x66ccff,
      roughness: 0,
      metalness: 0.3,
      transmission: 1,
      thickness: 0.5,
      transparent: true
    })
  );
  gema.position.y = 1.5;
  gema.castShadow = true;
  grupo.add(gema);

  // Tampa
  const tampa = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.05, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  );
  tampa.position.y = 1.85;
  grupo.add(tampa);

  // Animação ao clicar
  let aberta = false;
  grupo.userData.toggle = () => {
    if (!aberta) {
      gsap.to(tampa.rotation, { x: Math.PI / 2, duration: 0.8, ease: 'power2.out' });
      aberta = true;
    } else {
      gsap.to(tampa.rotation, { x: 0, duration: 0.8, ease: 'power2.in' });
      aberta = false;
    }
  };

  grupo.position.set(x, 0, z);
  return grupo;
}

