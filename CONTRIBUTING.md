# Como contribuir

Obrigado por ajudar a melhorar o guia! O passo a passo completo, incluindo como escrever roteiros e artigos e os componentes disponíveis, está publicado no próprio site:
**[Como contribuir](https://havillonf.github.io/ai-usage-standards/aprofundar/contribuir)** (fonte: `src/content/artigos/contribuir.mdx`).

## Resumo

1. **Sugestões e correções:** abra uma issue.
2. **Conteúdo:**
   - roteiros em `src/content/roteiros/`, como dados TypeScript com textos em Markdown;
   - artigos em `src/content/artigos/`, em MDX.
3. **Regras obrigatórias (R1–R7)** em `src/data/regras.ts`: só mudam com aprovação da coordenação do ATLab. Registre toda mudança em `src/content/artigos/historico.mdx`.
4. **Antes de abrir o PR**, rode:

   ```bash
   npm ci
   npm test        # inclui verificação de links e âncoras internos
   npm run build   # inclui a checagem de tipos
   ```

5. **Declare o uso de agentes de IA** no PR ou no commit (regra R6). Este repositório segue o próprio guia.

## Licença

Ao contribuir, você concorda em licenciar sua contribuição sob [CC BY 4.0](LICENSE).
