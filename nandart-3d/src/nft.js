import { NFTStorage, File } from 'nft.storage';
import { ethers } from 'ethers';

const token = import.meta.env.VITE_NFT_STORAGE_TOKEN;
const client = new NFTStorage({ token });

// Função para guardar no IPFS e obter URL
export async function uploadToIPFS(imageFile, metadata) {
  const content = await client.store({
    image: new File([imageFile], imageFile.name, { type: imageFile.type }),
    name: metadata.name,
    description: metadata.description,
    properties: metadata.properties || {}
  });

  return content.url;
}

// Função para conectar carteira
export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask não está instalado.");
  }

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return { signer, address: accounts[0] };
}

// Função para mintar NFT
export async function mintNFT(contractAddress, abi, toAddress, tokenURI) {
  const { signer } = await connectWallet();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.safeMint(toAddress, tokenURI);
  await tx.wait();
  return tx.hash;
}
