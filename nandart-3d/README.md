# NANdART — Galeria 3D Descentralizada com NFTs

A NANdART é uma galeria de arte digital tridimensional onde cada obra se torna eterna, ancorada na tecnologia Web3. Com ligação à blockchain Polygon, armazenamento em IPFS via NFT.Storage, e uma navegação imersiva 3D, a galeria combina tradição, inovação e descentralização.

---

## 📁 Estrutura do Projeto

nandart-3d/
├── index.html
├── vite.config.js
├── package.json
├── .gitignore
├── README.md
├── public/
│ └── favicon.ico
├── src/
│ ├── main.js
│ ├── index.css
│ ├── controls.js
│ ├── imagens/
│ │ ├── moldura-dourada.jpg
│ │ ├── obra-central.jpg
│ │ ├── obra-esquerda.jpg
│ │ ├── obra-direita.jpg
│ │ └── luz-circular.png
│ ├── icones/
│ │ ├── info.png
│ │ ├── horizontes.png
│ │ ├── ajuda-flutuante.png
│ │ └── casa-icon.png
│ ├── texturas/
│ │ └── vidro-reflexo.png
│ ├── ajuda/
│ │ ├── ajuda-cubo.jpg
│ │ ├── ajuda-modal.jpg
│ │ ├── ajuda-rotacao.jpg
│ │ └── ajuda-premium.jpg
│ ├── como-navegar/
│ │ └── como-navegar.html
├── contactos.html
├── info.html

yaml
Copiar
Editar

---

## 🚀 Instruções de Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em ambiente local com hot reload
npm run dev

# Gerar build de produção
npm run build
🌐 Deploy Automático no Vercel
Associar o repositório GitHub ao Vercel.

Escolher "Other" como framework.

Definir src/index.css como o caminho do CSS e main.js como entry point.

Garante que vite.config.js e package.json estão corretamente configurados.

Para variáveis como o token NFT.Storage:

Adicionar a variável VITE_NFT_STORAGE_TOKEN nas Environment Variables do projeto no Vercel.

🧠 Integração NFT — Criação e Armazenamento
🔐 Gerar o Token NFT.Storage
Criar conta em https://nft.storage

Gerar um token.

Inserir no Vercel como:

ini
Copiar
Editar
VITE_NFT_STORAGE_TOKEN=seu_token_aqui
📦 Deploy do Smart Contract na Polygon Testnet (Mumbai)
1. Opção A — Usando Remix
Aceder a Remix IDE

Criar um novo ficheiro NandartNFT.sol com um contrato ERC-721.

Usar o seguinte exemplo mínimo:

solidity
Copiar
Editar
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NandartNFT is ERC721URIStorage {
    uint256 public tokenCounter;

    constructor() ERC721("NANdART", "NAND") {
        tokenCounter = 0;
    }

    function createNFT(string memory tokenURI) public returns (uint256) {
        uint256 newId = tokenCounter;
        _safeMint(msg.sender, newId);
        _setTokenURI(newId, tokenURI);
        tokenCounter++;
        return newId;
    }
}
Compilar com versão 0.8.0 ou superior.

Fazer deploy na rede Polygon Mumbai via MetaMask.

Após deploy, copiar o endereço do contrato e ABI.

2. Opção B — Usando Hardhat
bash
Copiar
Editar
npm install --save-dev hardhat
npx hardhat
Escolher "Create a JavaScript project".

Instalar dependências:

bash
Copiar
Editar
npm install @openzeppelin/contracts dotenv
Criar o ficheiro contracts/NandartNFT.sol com o mesmo código acima.

Criar o script scripts/deploy.js:

js
Copiar
Editar
const hre = require("hardhat");

async function main() {
  const Contract = await hre.ethers.getContractFactory("NandartNFT");
  const contract = await Contract.deploy();
  await contract.deployed();
  console.log("Contrato deployado para:", contract.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
Adicionar .env com chave privada e URL da Mumbai:

ini
Copiar
Editar
PRIVATE_KEY=...
RPC_URL=https://polygon-mumbai.infura.io/v3/...
Em hardhat.config.js:

js
Copiar
Editar
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.21",
  networks: {
    mumbai: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
Deploy:

bash
Copiar
Editar
npx hardhat run scripts/deploy.js --network mumbai
🔗 Conexão de Carteiras
A galeria está preparada para conexão com carteiras Web3:

MetaMask e outras carteiras EVM.

Ligação através de window.ethereum.

Permite envio de transações e criação de NFTs diretamente da interface.

✨ Roadmap Curto Prazo
 Galeria 3D com obras normais e premium

 Interação com cubos, gemas e modais

 Layout fidedigno ao design original

 Reflexos, luz ambiente e trilha sonora

 Ligação à IPFS com NFT.Storage

 Integração total com o contrato NFT (em curso)

 Mint de NFTs a partir da galeria (em curso)

 Perfil de artistas com histórico de vendas (futuro)

 Marketplace interno (futuro)

🧭 Acesso Rápido
Galeria 3D: index.html

Ajuda de navegação: src/como-navegar/como-navegar.html

Contactos: contactos.html

Info institucional: info.html

🖼️ Nome com Identidade
NANdART — Arte com alma, eternizada em blocos de tempo.

