// /api/submissoes.js
import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const repoOwner = 'teu-usuario';
const repoName = 'nandart-3d';

export default async function handler(req, res) {
  try {
    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner: repoOwner,
      repo: repoName,
      labels: 'submissao',
      state: 'open',
    });

    const obras = issues.map((issue) => {
      const body = issue.body || '';
      const imagemMatch = body.match(/!\[\]\((.*?)\)/);
      const imagem = imagemMatch ? imagemMatch[1] : '';

      const campos = {
        artista: extrairCampo(body, '**Artista:**'),
        titulo: extrairCampo(body, '**Título:**'),
        estilo: extrairCampo(body, '**Estilo:**'),
        tecnica: extrairCampo(body, '**Técnica:**'),
        ano: extrairCampo(body, '**Ano:**'),
        dimensoes: extrairCampo(body, '**Dimensões:**'),
        materiais: extrairCampo(body, '**Materiais:**'),
        local: extrairCampo(body, '**Local:**'),
        descricao: extrairCampo(body, '**Descrição:**'),
        imagem,
        numero: issue.number,
      };

      return campos;
    });

    res.status(200).json({ sucesso: true, obras });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao carregar submissões.' });
  }
}

function extrairCampo(texto, campo) {
  const regex = new RegExp(`${campo}\\s*(.*)`);
  const match = texto.match(regex);
  return match ? match[1].trim() : '';
}
