# AGENTS.md — Guia de Agentes de IA do ATLab

SPA em Vite + React + TypeScript com o guia interativo do ATLab/UFC sobre desenvolvimento assistido por agentes de IA. Todo o conteúdo é escrito em português do Brasil.

## Comandos
- Instalar: `npm ci`
- Desenvolvimento: `npm run dev` (http://localhost:5173/ai-usage-standards/)
- Testes: `npm test`. Inclui a verificação de links internos, âncoras, regras e JSON dos exemplos.
- Build: `npm run build` (roda `tsc -b` antes). Rode testes e build antes de concluir qualquer mudança.

## Onde fica o quê
- Roteiros guiados: `src/content/roteiros/*.ts`, com os tipos em `src/content/tipos.ts`. Um roteiro novo entra em `src/content/roteiros/index.ts`, e as rotas são geradas a partir dele.
- Artigos: `src/content/artigos/<slug>.mdx`. Todo artigo precisa estar numa categoria em `src/content/artigos.ts`.
- Regras obrigatórias: `src/data/regras.ts`, a fonte única. Nunca copie o texto de uma regra: use `regras: ['R2']` nos passos ou `<Regra id="R2" />` nos artigos.
- Ferramentas e matriz: `src/data/ferramentas.ts` e `src/data/compatibilidade.ts`.
- Geradores: lógica pura em `src/geradores/` (com testes), interface em `src/components/geradores/`.
- Cores e fontes: tokens em `src/styles/tokens.css`, com a identidade visual do ATLab (azul-marinho, azul-ciano, Roboto). Não use cores fixas nos componentes: o teste `src/styles/contraste.test.ts` falha se houver cor fora dos tokens ou contraste abaixo do AA.
- Logos: só os arquivos de `public/marca/`, usados como estão. Não recolorir, esticar nem aplicar efeitos (Manual de Marca do ATLab).

## Convenções de conteúdo
- O site guia, não documenta: cada passo diz o que fazer na ferramenta escolhida. O "porquê" vai para um artigo de Aprofundar.
- Todo passo com `instrucoes` precisa de `generico`.
- Não cite modelos de LLM específicos. Fale de capacidades.
- DEVE/NÃO DEVE só aparece em regras obrigatórias.
- Toda afirmação sobre uma ferramenta precisa de link para a documentação oficial. O que não foi confirmado fica marcado "a verificar". Não invente comandos, caminhos ou opções.
- Links internos usam rotas do site (`/aprofundar/segredos#secao`). Os testes falham se a rota ou a âncora não existir.

## Privacidade e estado
- O site não guarda dados do usuário: as respostas ficam na URL e o progresso, em memória. Não adicione `localStorage`, cookies ou analytics sem decisão explícita. Nesta fase o site usa só o tema claro e não grava nada; quando o tema escuro voltar, a escolha de tema será a única exceção.

## Não mexer sem pedido explícito
- O status das regras (`proposta`/`aprovada`) em `src/data/regras.ts`: a aprovação é da coordenação do ATLab.
- `LICENSE` (CC BY 4.0).
