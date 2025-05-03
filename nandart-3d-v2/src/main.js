import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// CENA E RENDERER
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x111111)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 1.5, 5)

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene'), antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true

// LUZES
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

const spotLight = new THREE.SpotLight(0xffffff, 1)
spotLight.position.set(5, 10, 5)
spotLight.castShadow = true
scene.add(spotLight)

// PLANO REFLEXIVO
const floorGeometry = new THREE.PlaneGeometry(20, 20)
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.6, roughness: 0.4 })
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

// CUBO COM GEMA
const cubo = new THREE.Group()
const base = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 0.1, 1.2),
  new THREE.MeshStandardMaterial({ color: 0x222222 })
)
const tampa = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 0.2, 1.2),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
)
tampa.position.y = 1

const gema = new THREE.Mesh(
  new THREE.OctahedronGeometry(0.4),
  new THREE.MeshStandardMaterial({
    color: 0x3399ff,
    transparent: true,
    opacity: 0.8,
    emissive: 0x3366ff,
    metalness: 0.7,
    roughness: 0.2
  })
)
gema.position.y = 0.6
gema.visible = false

cubo.add(base, tampa, gema)
cubo.position.set(0, 0, 0)
scene.add(cubo)

// ANIMAÇÃO DA GEMA
let cuboAberto = false
function animarGema() {
  if (!cuboAberto) {
    gema.visible = true
    tampa.position.y += 0.02
    if (tampa.position.y >= 2) cuboAberto = true
  }
}

function fecharGema() {
  if (cuboAberto) {
    tampa.position.y -= 0.02
    if (tampa.position.y <= 1) {
      cuboAberto = false
      gema.visible = false
      tampa.position.y = 1
    }
  }
}

// ROTAÇÃO DAS OBRAS NORMAIS
const obrasNormais = []
const raio = 3
const totalObras = 8
for (let i = 0; i < totalObras; i++) {
  const angle = (i / totalObras) * Math.PI * 2
  const obra = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1.5),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  )
  obra.position.set(Math.cos(angle) * raio, 1.5, Math.sin(angle) * raio)
  obra.lookAt(0, 1.5, 0)
  scene.add(obra)
  obrasNormais.push(obra)
}

// MODAL
const modal = document.getElementById('modal-obra')
const imagemModal = document.getElementById('imagem-modal')
const tituloModal = document.getElementById('titulo-modal')
const artistaModal = document.getElementById('artista-modal')
const visualizacoesModal = document.getElementById('visualizacoes-modal')
const comprarBtn = document.getElementById('comprar-obra')
const fecharModal = document.getElementById('fechar-modal')

function abrirModal() {
  modal.style.display = 'block'
  imagemModal.src = '/src/obras/obra-central.jpg'
  tituloModal.textContent = 'Silhueta do Infinito'
  artistaModal.textContent = 'por Nandart'
  visualizacoesModal.textContent = '248 visualizações'
}

function fecharModalFunc() {
  modal.style.display = 'none'
}

fecharModal.addEventListener('click', fecharModalFunc)
window.addEventListener('click', (e) => {
  if (e.target === modal) fecharModalFunc()
})

// EVENTOS DE TOQUE/CLICK
cubo.children.forEach(el => {
  el.userData.interativo = true
})

window.addEventListener('click', (e) => {
  const mouse = new THREE.Vector2(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  )
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children, true)

  for (let intersect of intersects) {
    if (intersect.object.userData.interativo) {
      abrirModal()
      return
    }
  }

  fecharModalFunc()
  fecharGema()
})

// ÍCONE DE AJUDA FLUTUANTE
const ajuda = document.getElementById('ajuda-flutuante')
setTimeout(() => {
  ajuda.style.opacity = '1'
}, 1000)

setTimeout(() => {
  ajuda.style.opacity = '0'
}, 21000)

ajuda.addEventListener('click', () => {
  window.location.href = '/como-navegar.html'
})

// ÍCONES DE NAVEGAÇÃO
document.getElementById('info-icon').addEventListener('click', () => {
  window.location.href = '/info.html'
})

document.getElementById('menu-icon').addEventListener('click', () => {
  window.location.href = '/contactos.html'
})

// RENDER LOOP
function animate() {
  requestAnimationFrame(animate)
  obrasNormais.forEach((obra, i) => {
    const angle = ((Date.now() / 4000) + i / totalObras) * Math.PI * 2
    obra.position.set(Math.cos(angle) * raio, 1.5, Math.sin(angle) * raio)
    obra.lookAt(0, 1.5, 0)
  })
  animarGema()
  renderer.render(scene, camera)
}

animate()
