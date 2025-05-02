import { uploadToIPFS, connectWallet, mintNFT } from './nft.js';

// Opcional: ABI do contrato NFT (ERC721 com função safeMint)
const abi = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "string", "name": "uri", "type": "string" }
    ],
    "name": "safeMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Substituir por endereço real do contrato
const contractAddress = '0x...'; 

document.getElementById('nftForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const estado = document.getElementById('estado');
  estado.textContent = 'A processar...';

  try {
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const imagem = document.getElementById('imagem').files[0];

    const metadata = {
      name: nome,
      description: descricao,
    };

    const ipfsUrl = await uploadToIPFS(imagem, metadata);
    const { address } = await connectWallet();
    const hash = await mintNFT(contractAddress, abi, address, ipfsUrl);

    estado.textContent = `NFT criado com sucesso! TX: ${hash}`;
  } catch (err) {
    console.error(err);
    estado.textContent = 'Erro ao criar NFT.';
  }
});
