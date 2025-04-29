window.addEventListener('DOMContentLoaded', () => {
  const audio = new Audio('audio/musica.mp3');
  audio.loop = true;
  audio.volume = 0.5;
  audio.play().catch(() => {
    console.warn('Autoplay bloqueado pelo navegador. O utilizador terá de ativar manualmente.');
  });

  const toggleBtn = document.createElement('img');
  toggleBtn.src = 'imagem/toggle-music.png';
  toggleBtn.alt = 'Toggle Som';
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.bottom = '20px';
  toggleBtn.style.right = '20px';
  toggleBtn.style.width = '32px';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.zIndex = '1000';

  document.body.appendChild(toggleBtn);

  let isPlaying = true;
  toggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      toggleBtn.style.opacity = '0.4';
    } else {
      audio.play();
      toggleBtn.style.opacity = '1';
    }
    isPlaying = !isPlaying;
  });
});
