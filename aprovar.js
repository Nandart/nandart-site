// /api/aprovar.js
import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const repoOwner = 'teu-usuario';
const repoName = 'nandart-3d';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ sucesso: false, mensagem: 'Método não permitido' });
  }

  const {
    numero,
    artista,
    titulo,
    estilo,
    tecnica,
    ano,
    dimensoes,
    materiais,
    local,
    descricao,
    imagem,
  } = req.body;

  if (!numero || !titulo || !artista || !ano || !descricao || !local || !imagem) {
    return res.status(400).json({ sucesso: false, mensagem: 'Campos obrigatórios em falta' });
  }

  const nomeFicheiro = `${titulo.toLowerCase().replace(/\s+/g, '-')}.json`;
  const conteudoObra = {
    artista,
    titulo,
    estilo,
    tecnica,
    ano,
    dimensoes,
    materiais,
    local,
    descricao,
    imagem,
  };

  try {
    const { data: masterRef } = await octokit.rest.git.getRef({
      owner: repoOwner,
      repo: repoName,
      ref: 'heads/main',
    });

    const shaBase = masterRef.object.sha;
    const nomeBranch = `obra-${titulo.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    await octokit.rest.git.createRef({
      owner: repoOwner,
      repo: repoName,
      ref: `refs/heads/${nomeBranch}`,
      sha: shaBase,
    });

    const conteudoBase64 = Buffer.from(JSON.stringify(conteudoObra, null, 2)).toString('base64');

    await octokit.rest.repos.createOrUpdateFileContents({
      owner: repoOwner,
      repo: repoName,
      path: `src/obras/${nomeFicheiro}`,
      message: `Adicionar obra: ${titulo}`,
      content: conteudoBase64,
      branch: nomeBranch,
    });

    await octokit.rest.pulls.create({
      owner: repoOwner,
      repo: repoName,
      title: `Adicionar obra: ${titulo}`,
      head: nomeBranch,
      base: 'main',
      body: `Obra submetida por ${artista}.`,
    });

    await octokit.rest.issues.update({
      owner: repoOwner,
      repo: repoName,
      issue_number: numero,
      state: 'closed',
    });

    res.status(200).json({ sucesso: true, mensagem: 'Obra aprovada com sucesso.' });
  } catch (erro) {
    console.error('Erro ao aprovar obra:', erro);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao aprovar a obra.' });
  }
}
