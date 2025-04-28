const canvas = document.getElementById('gallery-canvas');
const ctx = canvas.getContext('2d');

let width, height;
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Obras e premium
const artworks = [
  { src: 'imagens/obra1.jpg', premium: false },
  { src: 'imagens/obra2.jpg', premium: false },
  { src: 'imagens/obra3.jpg', premium: false },
  { src: 'imagens/obra4.jpg', premium: false },
  { src: 'imagens/obra5.jpg', premium: false },
  { src: 'imagens/premium1.jpg', premium: true },
  { src: 'imagens/premium2.jpg', premium: true },
];

const images = artworks.map(a => {
  const img = new Image();
  img.src = a.src;
  img.isPremium = a.premium;
  return img;
});

let angle = 0;
const radius = 250;
const centerX = width / 2;
const centerY = height / 2 + 50;

function draw() {
  ctx.clearRect(0, 0, width, height);

  const time = Date.now() * 0.0002;
  angle += 0.002;

  images.forEach((img, i) => {
    const a = angle + (i * (Math.PI * 2 / images.length));
    const x = centerX + Math.cos(a) * radius;
    const y = centerY + Math.sin(a) * (radius * 0.4);

    const scale = 1 + 0.3 * (1 - Math.abs(Math.cos(a)));

    if (img.complete) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -50, -75, 100, 150);
      ctx.restore();

      if (img.isPremium) {
        ctx.beginPath();
        ctx.arc(x + 30, y - 60, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
      }
    }
  });

  requestAnimationFrame(draw);
}
draw();

// Música
const music = document.getElementById('background-music');
let musicPlaying = false;
function toggleMusic() {
  if (musicPlaying) {
    music.pause();
  } else {
    music.play();
  }
  musicPlaying = !musicPlaying;
}

// Menu
function toggleMenu() {
  document.getElementById('menu-options').classList.toggle('hidden');
}
function togglePlus() {
  document.getElementById('plus-options').classList.toggle('hidden');
}

// Modal
const modal = document.getElementById('art-modal');
const modalImage = document.getElementById('modal-artwork');
const modalTitle = document.getElementById('modal-title');
const modalArtist = document.getElementById('modal-artist');
const viewCount = document.getElementById('view-count');

let currentView = 0;

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  images.forEach((img, i) => {
    const a = angle + (i * (Math.PI * 2 / images.length));
    const x = centerX + Math.cos(a) * radius;
    const y = centerY + Math.sin(a) * (radius * 0.4);

    const scale = 1 + 0.3 * (1 - Math.abs(Math.cos(a)));
    const imgWidth = 100 * scale;
    const imgHeight = 150 * scale;

    if (clickX > x - imgWidth/2 && clickX < x + imgWidth/2 &&
        clickY > y - imgHeight/2 && clickY < y + imgHeight/2) {
      openModal(img);
    }
  });
});

function openModal(img) {
  modal.classList.remove('hidden');
  modalImage.src = img.src;
  modalTitle.textContent = "Título da Obra";
  modalArtist.textContent = "Nome do Artista";
  currentView++;
  viewCount.textContent = currentView;
}

function closeModal() {
  modal.classList.add('hidden');
}
