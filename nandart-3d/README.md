# NANdART 3D Gallery

Este repositório contém a galeria tridimensional da NANdART, construída com Vite e Three.js, com deploy automático via Vercel.

## 🚀 Tecnologias
- [Vite](https://vitejs.dev/)
- [Three.js](https://threejs.org/)
- [Vercel](https://vercel.com/) (Deploy)

## 📁 Estrutura
```
nandart-3d/
├── index.html              # Entrada principal
├── vite.config.js          # Configuração Vite
├── package.json            # Dependências e scripts
└── src/
    ├── main.js             # Inicialização da aplicação
    ├── scene.js            # Construção da cena 3D
    ├── controls.js         # OrbitControls
    └── styles.css          # Estilo visual
```

## 📦 Instalar e correr localmente
```bash
npm install
npm run dev
```
Acede a `http://localhost:5173` no navegador.

## 🧱 Compilar para produção
```bash
npm run build
```

## 🌐 Deploy automático
Deploy feito via Vercel.
- Root Directory: `nandart-3d`
- Build Command: `npm run build`
- Output Directory: `dist`

## 📄 Licença
© NANdART — Todos os direitos reservados.
