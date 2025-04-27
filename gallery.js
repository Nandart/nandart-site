document.addEventListener('DOMContentLoaded', async () => {
    const galeria = document.getElementById('galeria');

    let obras = [];

    try {
        const resposta = await fetch('galeria/obras/obras_aprovadas.json');
        obras = await resposta.json();
        criarObras();
    } catch (erro) {
        console.error('Erro ao carregar as obras:', erro);
    }

    function criarObras() {
        obras.forEach((obra, index) => {
            const obraDiv = document.createElement('div');
            obraDiv.classList.add('obra');

            const img = document.createElement('img');
            img.src = obra.imagem;
            img.alt = obra.titulo;

            // Marcar obra premium
            if (obra.premium) {
                const estrela = document.createElement('span');
                estrela.classList.add('icone-premium');
                estrela.innerHTML = '⭐';
                obraDiv.appendChild(estrela);
                obraDiv.classList.add('premium');
            }

            obraDiv.appendChild(img);
            galeria.appendChild(obraDiv);
        });

        animarObras();
    }

    function animarObras() {
        const obrasElementos = document.querySelectorAll('.obra');
        let angulo = 0;
        const raio = 250;

        function atualizarPosicoes() {
            obrasElementos.forEach((obra, index) => {
                const anguloObra = angulo + (index * (360 / obrasElementos.length));
                const radianos = anguloObra * (Math.PI / 180);
                const x = Math.cos(radianos) * raio;
                const y = Math.sin(radianos) * raio * 0.5; // achatado para dar profundidade

                obra.style.transform = `translate(${x}px, ${y}px)`;
                obra.style.zIndex = Math.round(1000 - Math.abs(y));
            });

            angulo += 0.25; // Velocidade de rotação (ajustada para ser mais suave)
            requestAnimationFrame(atualizarPosicoes);
        }

        atualizarPosicoes();
    }
});
