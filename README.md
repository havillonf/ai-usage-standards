# Guia de Agentes de IA — ATLab/UFC

Guia **interativo** do [Laboratório Alan Turing (ATLab/UFC)](https://www.atlab.ufc.br/) para desenvolvimento assistido por agentes de IA.

O site não repete a documentação das ferramentas. Ele **conduz** cada pessoa até o que fazer: algumas perguntas em botões levam a um roteiro passo a passo para a ferramenta que ela usa (OpenCode, Cline, Claude Code, Antigravity ou outra), com prompts e configurações prontos para copiar.

**Site:** https://havillonf.github.io/ai-usage-standards/

> **Status:** protótipo em validação pela coordenação do ATLab. As regras obrigatórias ainda são uma proposta.

## O que tem no site

- **Roteiros guiados:**
  - Configurar meu ambiente;
  - Estender meu agente (instrução ou regra, skill, servidor MCP).
- **Ferramentas:**
  - comparador de agentes;
  - gerador de AGENTS.md;
  - gerador de permissões seguras.
- **Regras:** as regras obrigatórias do laboratório (R1–R7).
- **Aprofundar:** artigos com os porquês (contexto, instruções, segurança).

O site não guarda dados do usuário. As respostas ficam na URL, e o progresso fica só na aba aberta, com aviso antes de fechar. Nada é salvo no navegador: nesta fase o site usa só o tema claro. Quando o tema escuro voltar, a escolha de tema será a única preferência guardada.

## Rodando localmente

Requer Node.js 20+ (o CI usa a versão de `.nvmrc`).

```bash
npm ci
npm run dev       # http://localhost:5173/ai-usage-standards/
npm test          # testes (geradores, roteiros, links e âncoras internos)
npm run build     # checagem de tipos + build de produção em dist/
npm run preview   # serve o build localmente
```

## Estrutura

```
src/content/roteiros/   roteiros guiados (perguntas e passos, em TypeScript)
src/content/artigos/    artigos de "Aprofundar" (MDX)
src/data/               regras, ferramentas e matriz de compatibilidade
src/geradores/          lógica dos geradores de AGENTS.md e de permissões
src/components/         interface (roteiro, geradores, layout…)
src/pages/              páginas
src/styles/tokens.css   tema (cores e fontes da identidade visual do ATLab)
public/marca/           logos oficiais usados no site (ATLab, DC, UFC)
config/                 plugins de build (MDX e índice dos artigos)
.github/workflows/      testes + deploy no GitHub Pages; verificação de links
```

## Publicação

A cada push na `main`, o workflow `Deploy` roda os testes, compila o site e o publica no GitHub Pages. Na primeira vez, é preciso escolher **Settings → Pages → Source: GitHub Actions**.

Para hospedar o mesmo build em outro servidor, defina o caminho base no build. O resultado em `dist/` é estático. Como o site é uma SPA, o servidor deve responder `index.html` para rotas desconhecidas (no nginx, `try_files $uri /index.html;`).

```bash
BASE_PATH=/ npm run build
```

## Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Licença

Conteúdo licenciado sob [Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE).
