// /api/submit.js
import formidable from 'formidable';
import { Octokit } from 'octokit';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar GitHub
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const repoOwner = 'teu-usuario';
const repoName = 'nandart-3d';
const issuesPath = 'submissoes/';

// Handler principal
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ sucesso: false, mensagem: 'Método não permitido' });
  }

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro no formulário' });
    }

    try {
      const {
        artista, titulo, estilo, tecnica, ano,
        dimensoes, materiais, local, descricao
      } = fields;

      const imagem = files.imagem;

      // Upload para o Cloudinary
      const upload = await cloudinary.uploader.upload(imagem.filepath, {
        folder: 'nandart-submissoes',
      });

      const imagemUrl = upload.secure_url;

      const corpoIssue = `
### Submissão de Obra

**Artista:** ${artista}
**Título:** ${titulo}
**Estilo:** ${estilo}
**Técnica:** ${tecnica}
**Ano:** ${ano}
**Dimensões:** ${dimensoes}
**Materiais:** ${materiais}
**Local:** ${local}

**Descrição:**
${descricao}

**Imagem:** ![](${imagemUrl})
`;

      // Criar issue no GitHub
      await octokit.rest.issues.create({
        owner: repoOwner,
        repo: repoName,
        title: `Nova Obra: ${titulo} por ${artista}`,
        body: corpoIssue,
        labels: ['submissao'],
      });

      res.status(200).json({ sucesso: true, mensagem: 'Obra submetida com sucesso.' });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ sucesso: false, mensagem: 'Erro ao processar a submissão.' });
    }
  });
}
