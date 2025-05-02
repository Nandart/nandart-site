// src/nft.js

export async function uploadParaIPFS(imageFile, token) {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch("https://api.nft.storage/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error("Erro ao fazer upload para IPFS.");
  }

  const data = await response.json();
  return `ipfs://${data.value.cid}`;
}
