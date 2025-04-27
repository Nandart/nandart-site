document.addEventListener('DOMContentLoaded', async () => {
    const galeria = document.getElementById('galeria');
    const modal = document.getElementById('modal');
    const imagemModal = document.getElementById('imagemModal');
    const tituloModal = document.getElementById('tituloModal');
    const descricaoModal = document.getElementById('descricaoModal');
    const botaoCompra = document.getElementById('botaoCompra');
    const fecharModal = document.getElementById('fecharModal');

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

            // Adiciona ícone de premium se for premium
            if (obra.premium) {
                const estrela = document.createElement('span');
                estrela.classList.add('icone-premium');
                estrela.innerHTML = '⭐';
                obraDiv.appendChild(estrela);
                obraDiv.classList.add('premium');
            }

            obraDiv.appendChild(img);
            galeria.appendChild(obraDiv);

            // Clique para abrir Modal
            obraDiv.addEventListener('click', () => {
                abrirModal(obra);
            });
        });

        animarObras();
    }

    function abrirModal(obra) {
        imagemModal.src = obra.imagem;
        tituloModal.textContent = obra.titulo;
        descricaoModal.textContent = obra.descricao || '';
        if (obra.nft) {
            botaoCompra.textContent = 'Comprar NFT';
            botaoCompra.href = `https://polygonscan.com/address/${obra.nft}`;
        } else {
            botaoCompra.textContent = 'Comprar Obra';
            botaoCompra.href = `mailto:info@nandart.art?subject=Compra de Obra: ${encodeURIComponent(obra.titulo)}`;
        }
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('mostrar');
        }, 10);
    }

    fecharModal.addEventListener('click', () => {
        modal.classList.remove('mostrar');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });

    function animarObras() {
        const obrasElementos = document.querySelectorAll('.obra');
        let angulo = 0;
        const raio = 200;

        function atualizarPosicoes() {
            obrasElementos.forEach((obra, index) => {
                const anguloObra = angulo + (index * (360 / obrasElementos.length));
                const radianos = anguloObra * (Math.PI / 180);
                const x = Math.cos(radianos) * raio;
                const y = Math.sin(radianos) * raio * 0.6;

                obra.style.transform = `translate(${x}px, ${y}px)`;
                obra.style.zIndex = Math.round(1000 - Math.abs(y));
            });

            angulo += 0.3; // Velocidade de rotação
            requestAnimationFrame(atualizarPosicoes);
        }

        atualizarPosicoes();
    }
});
