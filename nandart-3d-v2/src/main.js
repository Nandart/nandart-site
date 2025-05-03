import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById('app').appendChild(renderer.domElement)

const light = new THREE.PointLight(0xffffff, 1)
light.position.set(10, 10, 10)
scene.add(light)

// Exemplo de geometria de teste
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshStandardMaterial({ color: 0x555555 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// Controlo de órbita para teste
const controls = new OrbitControls(camera, renderer.domElement)

// Música ambiente
const audio = document.getElementById('audio-ambiente')
const toggleBtn = document.getElementById('toggle-musica')

let musicaAtiva = true

if (toggleBtn && audio) {
  toggleBtn.addEventListener('click', () => {
    if (musicaAtiva) {
      audio.pause()
      musicaAtiva = false
      toggleBtn.style.opacity = '0.5'
    } else {
      audio.play()
      musicaAtiva = true
      toggleBtn.style.opacity = '1'
    }
  })
}

// Painéis da sala 'Como Navegar' (caso estejam presentes)
const painéis = document.querySelectorAll('.painel-ajuda')
painéis.forEach(painel => {
  painel.style.pointerEvents = 'none'
})

// Responsividade
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Loop principal
function animate() {
  requestAnimationFrame(animate)

  cube.rotation.x += 0.005
  cube.rotation.y += 0.005

  controls.update()
  renderer.render(scene, camera)
}
animate()
