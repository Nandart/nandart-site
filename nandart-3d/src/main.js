import './styles.css';
import { createScene } from './scene.js';
import { setupControls } from './controls.js';

// Inicializar renderizador, cena e câmara
const { renderer, scene, camera } = createScene();
setupControls(camera, renderer.domElement);

document.getElementById('app').appendChild(renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
window.addEventListener('click', () => {
  const cena = scene.userData.gemas;
  if (cena && cena.length > 0) {
    cena[0].userData.toggle(); // Testar a primeira gema
  }
});

