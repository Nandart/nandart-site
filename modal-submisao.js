// File: modal-submissao.js

function abrirModal() {
  document.getElementById('modalSubmissao').style.display = 'block';
}

function fecharModal() {
  document.getElementById('modalSubmissao').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('modalSubmissao');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// Lógica do envio
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formSubmissao');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Simula submissão bem-sucedida
    form.style.display = 'none';
    document.getElementById('mensagemSucesso').style.display = 'block';
  });
});
