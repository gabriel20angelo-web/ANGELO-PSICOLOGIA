# Ângelo Psicologia

Site pessoal + página de venda de materiais de estudo em psicologia analítica.

## Setup

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy no GitHub Pages

1. No `next.config.js`, descomente e ajuste `basePath` e `assetPrefix` com o nome do seu repositório (se não for `username.github.io`).
2. Faça o build estático:

```bash
npm run build
```

3. A pasta `out/` contém o site estático. Faça deploy dela no GitHub Pages.

**Opção automática com GitHub Actions:** Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

## O que personalizar

### Links do WhatsApp
Todos os links de compra estão em `src/data/materials.js`. Substitua `55XXXXXXXXXXX` pelo seu número com DDD.

### Foto pessoal
Substitua o placeholder da hero por sua foto. Coloque a imagem em `public/images/` e atualize o componente `src/components/home/Hero.jsx`.

### Capas dos materiais
Coloque imagens em `public/images/` e atualize os caminhos em `src/data/materials.js` (campo `image`).

### Capítulos
Ajuste os títulos dos capítulos em `src/data/materials.js`, especialmente os de "O Pensamento Vivo de Jung" que estão como placeholder.

### Redes sociais
Links do footer estão em `src/components/Footer.jsx`.

### Materiais futuros
Para adicionar novos materiais, edite o array `materials` em `src/data/materials.js`. Para materiais "em breve", edite o array `comingSoon`.

## Estrutura

```
src/
├── app/
│   ├── layout.js          # Layout raiz (metadata)
│   ├── page.js             # HOME
│   ├── globals.css          # Estilos globais + Tailwind
│   └── materiais/
│       └── page.js          # PÁGINA DE MATERIAIS
├── components/
│   ├── Navbar.jsx           # Navegação (compartilhada)
│   ├── Footer.jsx           # Rodapé (compartilhada)
│   ├── SectionLabel.jsx     # Label de seção reutilizável
│   ├── home/
│   │   ├── Hero.jsx         # Hero da home
│   │   ├── About.jsx        # Sobre mim + credenciais
│   │   ├── MaterialsPreview.jsx  # Preview dos materiais
│   │   └── FutureContent.jsx     # Vídeos/ensaios (em breve)
│   └── materiais/
│       └── MaterialCard.jsx  # Card de material com capítulos expansíveis
├── data/
│   └── materials.js         # DADOS DOS MATERIAIS (editar aqui)
└── lib/
    └── constants.js         # Animações e configurações
```

## Notas sobre o projeto

### Identidade visual
- Tema escuro + dourado
- Fontes: DM Serif Display (títulos), Libre Baskerville (corpo), Instrument Sans (labels), Courier Prime (detalhes)
- Grain texture overlay
- Animações expressivas com Framer Motion

### Seções futuras (referências para quando implementar)
- **Vídeos (YouTube):** Análises de filmes e cultura pela lente da psicologia analítica. Formato: embed do YouTube com cards, vídeo mais recente em destaque.
- **Ensaios (Blog):** Textos longos sobre psicologia, clínica, mitologia e o processo de individuação. Formato: lista editorial com data, título, excerpt e categorias (Psicologia Analítica, Mitologia & Clínica, Cinema & Psicologia, Reflexão Clínica).
