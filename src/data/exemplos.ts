import type {Fonte} from '@/content/tipos';
import {stacksDaCamada, type StackId} from './stacks';

// Exemplos por stack: skills, servidores MCP e guias OFICIAIS, isto é, mantidos
// por quem mantém a stack ou o serviço. Itens de comunidade não entram.
//
// Regras para editar:
// - todo item aponta para a documentação oficial (`url`);
// - comandos e configurações são copiados da documentação, nunca inventados;
// - o que não foi confirmado fica marcado "a verificar" no texto;
// - `verificado` é a data (AAAA-MM-DD) em que o item foi conferido na fonte.

export const VERIFICADO_EM = '2026-11-24';

export type TipoExemplo = 'skill' | 'mcp' | 'agentes' | 'guia' | 'extensao';

export const TIPOS: {id: TipoExemplo; rotulo: string}[] = [
  {id: 'skill', rotulo: 'Skill'},
  {id: 'mcp', rotulo: 'Servidor MCP'},
  {id: 'agentes', rotulo: 'Agentes prontos'},
  {id: 'guia', rotulo: 'Guia ou instruções'},
  {id: 'extensao', rotulo: 'Extensão'},
];

export interface Comando {
  titulo: string;
  linguagem: string;
  conteudo: string;
}

export interface Exemplo {
  id: string;
  nome: string;
  tipos: TipoExemplo[];
  stacks: StackId[];
  /** Quem mantém o item. */
  organizacao: string;
  /** Markdown curto. */
  descricao: string;
  /** Documentação oficial. */
  url: string;
  instalacao?: Comando[];
  /** Markdown curto, um cuidado por item. */
  cuidados?: string[];
  requisitos?: string;
  licenca?: string;
  /** Outras páginas oficiais consultadas. */
  fontes?: Fonte[];
  verificado: string;
}

export const EXEMPLOS: Exemplo[] = [
  // Front-end
  {
    id: 'vercel-agent-skills',
    nome: 'Agent Skills da Vercel',
    tipos: ['skill'],
    stacks: ['react', 'nextjs'],
    organizacao: 'Vercel',
    descricao:
      'Coleção oficial de skills da Vercel. Para React e Next.js, as principais são `react-best-practices` (regras de desempenho), `composition-patterns` e `react-view-transitions`.',
    url: 'https://github.com/vercel-labs/agent-skills',
    instalacao: [{titulo: 'Terminal', linguagem: 'bash', conteudo: 'npx skills add vercel-labs/agent-skills\n'}],
    cuidados: [
      'O comando instala a coleção inteira, incluindo `deploy-to-vercel`, que publica o projeto na Vercel. Mantenha só as skills que você vai usar.',
    ],
    licenca: 'MIT',
    verificado: VERIFICADO_EM,
  },
  {
    id: 'next-devtools-mcp',
    nome: 'Next.js DevTools MCP',
    tipos: ['mcp'],
    stacks: ['nextjs'],
    organizacao: 'Vercel (Next.js)',
    descricao:
      'Conecta o agente ao servidor de desenvolvimento do Next.js, que expõe erros, rotas, logs e problemas de compilação da aplicação em execução.',
    url: 'https://nextjs.org/docs/app/guides/mcp',
    instalacao: [
      {
        titulo: '.mcp.json (raiz do projeto)',
        linguagem: 'json',
        conteudo:
          '{\n  "mcpServers": {\n    "next-devtools": {\n      "command": "npx",\n      "args": ["-y", "next-devtools-mcp@latest"]\n    }\n  }\n}\n',
      },
    ],
    cuidados: [
      'O endpoint `/_next/mcp` vem ligado no servidor de desenvolvimento. Para desligar, use `experimental.mcpServer: false` no `next.config`.',
      'Algumas ferramentas leem dados das abas do navegador em que a aplicação está aberta.',
    ],
    requisitos: 'Next.js 16 ou superior',
    verificado: VERIFICADO_EM,
  },
  {
    id: 'angular-cli-mcp',
    nome: 'Angular CLI MCP',
    tipos: ['mcp'],
    stacks: ['angular'],
    organizacao: 'Google (Angular)',
    descricao:
      'Servidor MCP da própria Angular CLI: busca na documentação, boas práticas, listagem de projetos, servidor de desenvolvimento e execução de build, testes e lint.',
    url: 'https://angular.dev/ai/mcp',
    instalacao: [
      {
        titulo: 'Configuração (somente leitura)',
        linguagem: 'json',
        conteudo:
          '{\n  "mcpServers": {\n    "angular-cli": {\n      "command": "npx",\n      "args": ["-y", "@angular/cli", "mcp", "--read-only"]\n    }\n  }\n}\n',
      },
    ],
    cuidados: [
      'A equipe do Angular descreve o servidor como experimental.',
      '`--read-only` registra só as ferramentas que não modificam o projeto; `--local-only`, só as que não usam a internet.',
      'Sem `--read-only`, a ferramenta `run_target` pode executar qualquer alvo da CLI, inclusive `deploy`.',
    ],
    fontes: [{titulo: 'Angular — LLM prompts and AI IDE setup', url: 'https://angular.dev/ai/develop-with-ai'}],
    verificado: VERIFICADO_EM,
  },
  {
    id: 'angular-skills',
    nome: 'Angular Agent Skills',
    tipos: ['skill'],
    stacks: ['angular'],
    organizacao: 'Google (Angular)',
    descricao:
      'Skills oficiais do time do Angular: `angular-developer` (código idiomático, signals, formulários, roteamento, testes) e `angular-new-app` (criar uma aplicação com a CLI).',
    url: 'https://angular.dev/ai/agent-skills',
    instalacao: [{titulo: 'Terminal', linguagem: 'bash', conteudo: 'npx skills add https://github.com/angular/skills\n'}],
    verificado: VERIFICADO_EM,
  },
  {
    id: 'angular-regras',
    nome: 'Instruções e regras oficiais do Angular',
    tipos: ['guia'],
    stacks: ['angular'],
    organizacao: 'Google (Angular)',
    descricao:
      'Prompt de boas práticas e arquivos de regras prontos para várias ferramentas, incluindo um `AGENTS.md`, além do `llms.txt` da documentação.',
    url: 'https://angular.dev/ai/develop-with-ai',
    cuidados: [
      'Os arquivos seguem versões específicas do Angular. Confira se correspondem à sua antes de copiar para o `AGENTS.md` do projeto.',
    ],
    verificado: VERIFICADO_EM,
  },
  {
    id: 'vue-llms-txt',
    nome: 'Documentação do Vue para agentes (llms.txt)',
    tipos: ['guia'],
    stacks: ['vue'],
    organizacao: 'Vue.js',
    descricao:
      'Índice da documentação oficial em Markdown, feito para agentes. Passe a URL ao agente quando ele precisar consultar a API do Vue.',
    url: 'https://vuejs.org/llms.txt',
    verificado: VERIFICADO_EM,
  },
  {
    id: 'nuxt-mcp',
    nome: 'Nuxt MCP',
    tipos: ['mcp'],
    stacks: ['nuxt'],
    organizacao: 'Nuxt',
    descricao: 'Servidor MCP remoto com a documentação, os módulos, os posts do blog e o changelog do Nuxt.',
    url: 'https://nuxt.com/docs/4.x/guide/ai/mcp',
    instalacao: [
      {
        titulo: 'Configuração (servidor remoto)',
        linguagem: 'json',
        conteudo: '{\n  "mcpServers": {\n    "nuxt": {\n      "type": "http",\n      "url": "https://nuxt.com/mcp"\n    }\n  }\n}\n',
      },
    ],
    cuidados: [
      'É um serviço remoto, sem autenticação. As ferramentas consultam conteúdo público: documentação, módulos e changelog.',
      'O header `X-MCP-Tools` limita as ferramentas expostas ao agente.',
    ],
    verificado: VERIFICADO_EM,
  },
  {
    id: 'svelte-mcp',
    nome: 'Svelte MCP',
    tipos: ['mcp'],
    stacks: ['svelte'],
    organizacao: 'Svelte',
    descricao:
      'Documentação do Svelte 5 e do SvelteKit, mais um *autofixer* que analisa o código gerado e sugere correções.',
    url: 'https://svelte.dev/docs/ai/overview',
    instalacao: [
      {
        titulo: 'Local (stdio)',
        linguagem: 'json',
        conteudo: '{\n  "mcpServers": {\n    "svelte": {\n      "command": "npx",\n      "args": ["-y", "@sveltejs/mcp"]\n    }\n  }\n}\n',
      },
      {titulo: 'Remoto (endereço)', linguagem: 'text', conteudo: 'https://mcp.svelte.dev/mcp\n'},
    ],
    cuidados: [
      'Na versão remota, o código vai para um servidor da equipe do Svelte, que declara não registrar nem armazenar o que recebe. A versão local roda na sua máquina.',
    ],
    fontes: [
      {titulo: 'Svelte — Local setup', url: 'https://svelte.dev/docs/ai/local-setup'},
      {titulo: 'Svelte — Remote setup', url: 'https://svelte.dev/docs/ai/remote-setup'},
    ],
    verificado: VERIFICADO_EM,
  },
  {
    id: 'svelte-skills',
    nome: 'Svelte Skills',
    tipos: ['skill'],
    stacks: ['svelte'],
    organizacao: 'Svelte',
    descricao:
      '`svelte-code-writer` (consulta à documentação e análise de código pela CLI) e `svelte-core-bestpractices` (reatividade, eventos, estilos, snippets).',
    url: 'https://svelte.dev/docs/ai/skills',
    instalacao: [
      {
        titulo: 'Terminal',
        linguagem: 'bash',
        conteudo:
          'npx skills add sveltejs/ai-tools --skill svelte-code-writer\nnpx skills add sveltejs/ai-tools --skill svelte-core-bestpractices\n',
      },
    ],
    cuidados: [
      'A skill opcional `svelte-mcp-feedback` abre issues públicas no GitHub do Svelte. Ela não vem instalada: só instale se quiser contribuir.',
    ],
    verificado: VERIFICADO_EM,
  },
  {
    id: 'chrome-devtools-mcp',
    nome: 'Chrome DevTools MCP',
    tipos: ['mcp'],
    stacks: stacksDaCamada('front'),
    organizacao: 'Google (Chrome DevTools)',
    descricao:
      'Deixa o agente controlar e inspecionar um Chrome real: console, rede, desempenho e capturas de tela. Serve para depurar qualquer front-end.',
    url: 'https://github.com/ChromeDevTools/chrome-devtools-mcp',
    instalacao: [
      {
        titulo: 'Configuração (sem estatísticas de uso)',
        linguagem: 'json',
        conteudo:
          '{\n  "mcpServers": {\n    "chrome-devtools": {\n      "command": "npx",\n      "args": ["-y", "chrome-devtools-mcp@latest", "--no-usage-statistics"]\n    }\n  }\n}\n',
      },
    ],
    cuidados: [
      'O agente vê tudo o que está no navegador que ele controla. Não abra nele contas pessoais nem dados sensíveis.',
      'Coleta estatísticas de uso por padrão; `--no-usage-statistics` desliga.',
      'As ferramentas de desempenho podem enviar URLs à API CrUX do Google; `--no-performance-crux` desliga.',
    ],
    requisitos: 'Node.js LTS e Chrome estável',
    licenca: 'Apache-2.0',
    verificado: VERIFICADO_EM,
  },

  // Back-end
  {
    id: 'fastapi-skill',
    nome: 'Skill oficial do FastAPI',
    tipos: ['skill'],
    stacks: ['fastapi'],
    organizacao: 'FastAPI',
    descricao: 'Skill que vem junto com o pacote do FastAPI, com orientações para a versão instalada no seu projeto.',
    url: 'https://fastapi.tiangolo.com/ai-development/',
    instalacao: [
      {
        titulo: 'Terminal (na pasta do projeto)',
        linguagem: 'bash',
        conteudo:
          '# a maioria dos agentes (.agents/skills)\nuvx library-skills install --skill fastapi --yes\n\n# Claude Code (.claude/skills)\nuvx library-skills install --skill fastapi --yes --claude\n',
      },
    ],
    cuidados: ['O instalador `library-skills` é uma ferramenta à parte, executada pelo `uvx`. Confira o que ele copiou para o projeto.'],
    verificado: VERIFICADO_EM,
  },
  {
    id: 'laravel-boost',
    nome: 'Laravel Boost',
    tipos: ['mcp', 'skill', 'guia'],
    stacks: ['laravel'],
    organizacao: 'Laravel',
    descricao:
      'Diretrizes, skills e um servidor MCP para Laravel: inspeção da aplicação, consultas ao banco, leitura de logs e busca na documentação.',
    url: 'https://laravel.com/docs/boost',
    instalacao: [
      {titulo: 'Terminal', linguagem: 'bash', conteudo: 'composer require laravel/boost --dev\nphp artisan boost:install\n'},
    ],
    cuidados: [
      'O `boost:install` gera `.mcp.json`, `boost.json` e um bloco no `AGENTS.md` ou `CLAUDE.md`. Revise o diff antes de commitar.',
      'O servidor MCP executa consultas no banco e código da aplicação: use só com banco de desenvolvimento ([Produção e infraestrutura](/aprofundar/producao-e-infra)).',
      'A busca na documentação usa um serviço hospedado pelo Laravel.',
    ],
    requisitos: 'Laravel 10 a 13',
    verificado: VERIFICADO_EM,
  },
  {
    id: 'dotnet-skills',
    nome: '.NET Agent Skills',
    tipos: ['skill', 'agentes'],
    stacks: ['dotnet'],
    organizacao: 'Microsoft (.NET)',
    descricao:
      'Skills e agentes do time do .NET, em plugins por área: ASP.NET Core, Blazor, Entity Framework, testes, MSBuild, NuGet, diagnóstico e migração de versão.',
    url: 'https://github.com/dotnet/skills',
    instalacao: [
      {
        titulo: 'Claude Code (dentro da sessão)',
        linguagem: 'text',
        conteudo: '/plugin marketplace add dotnet/skills\n/plugin install <plugin>@dotnet-agent-skills\n',
      },
    ],
    cuidados: [
      'Em outras ferramentas, copie a pasta da skill (`plugins/<plugin>/skills/<skill>`) para o diretório de skills da ferramenta, como no roteiro [Adotar uma skill](/estender/skill).',
      'Alguns plugins incluem servidores MCP e integração com language server. Instale só os plugins da área que você usa.',
    ],
    licenca: 'MIT',
    verificado: VERIFICADO_EM,
  },
  {
    id: 'microsoft-learn-mcp',
    nome: 'Microsoft Learn MCP',
    tipos: ['mcp'],
    stacks: ['dotnet'],
    organizacao: 'Microsoft',
    descricao: 'Busca e leitura da documentação oficial da Microsoft e dos seus exemplos de código.',
    url: 'https://learn.microsoft.com/training/support/mcp',
    instalacao: [{titulo: 'Endereço (Streamable HTTP)', linguagem: 'text', conteudo: 'https://learn.microsoft.com/api/mcp\n'}],
    cuidados: ['Serviço remoto e gratuito, sem autenticação, só com documentação pública.'],
    verificado: VERIFICADO_EM,
  },

  // Testes e qualidade
  {
    id: 'playwright-cli',
    nome: 'Playwright CLI com skills',
    tipos: ['skill'],
    stacks: ['playwright'],
    organizacao: 'Microsoft (Playwright)',
    descricao:
      'CLI do Playwright com skills: o agente abre páginas, inspeciona seletores, tira capturas de tela e gera código de teste. Para agentes de código, a própria Microsoft indica a CLI com skills no lugar do MCP, porque gasta menos contexto.',
    url: 'https://github.com/microsoft/playwright-cli',
    instalacao: [
      {titulo: 'Terminal', linguagem: 'bash', conteudo: 'npm install -g @playwright/cli@latest\nplaywright-cli install --skills\n'},
    ],
    cuidados: [
      'Roda sem janela (headless) e com perfil do navegador em memória, por padrão.',
      'O conteúdo das páginas é entrada não confiável, não instrução ([Prompt injection](/aprofundar/prompt-injection)).',
    ],
    requisitos: 'Node.js 20 ou superior',
    licenca: 'Apache-2.0',
    verificado: VERIFICADO_EM,
  },
  {
    id: 'playwright-mcp',
    nome: 'Playwright MCP',
    tipos: ['mcp'],
    stacks: ['playwright'],
    organizacao: 'Microsoft (Playwright)',
    descricao:
      'Automação de navegador pelo Playwright, baseada na árvore de acessibilidade da página. Indicado para fluxos longos, que precisam manter estado entre passos.',
    url: 'https://github.com/microsoft/playwright-mcp',
    instalacao: [
      {
        titulo: 'Configuração',
        linguagem: 'json',
        conteudo: '{\n  "mcpServers": {\n    "playwright": {\n      "command": "npx",\n      "args": ["@playwright/mcp@latest"]\n    }\n  }\n}\n',
      },
    ],
    cuidados: [
      'A documentação avisa que o servidor não é uma fronteira de segurança: filtros de origem como `--allowed-origins` não bloqueiam redirecionamentos.',
      'Por padrão, o acesso a arquivos fica restrito à raiz do workspace.',
      '`--isolated` mantém o perfil do navegador só em memória, sem salvar em disco.',
    ],
    requisitos: 'Node.js 20 ou superior',
    licenca: 'Apache-2.0',
    verificado: VERIFICADO_EM,
  },
  {
    id: 'playwright-test-agents',
    nome: 'Playwright Test Agents',
    tipos: ['agentes'],
    stacks: ['playwright'],
    organizacao: 'Microsoft (Playwright)',
    descricao:
      'Três agentes prontos: o *planner* explora a aplicação e escreve um plano de testes, o *generator* transforma o plano em testes e o *healer* roda a suíte e tenta consertar os testes que falham.',
    url: 'https://playwright.dev/docs/test-agents',
    instalacao: [
      {
        titulo: 'Terminal',
        linguagem: 'bash',
        conteudo: '# --loop: opencode, claude, vscode ou codex\nnpx playwright init-agents --loop=opencode\n',
      },
    ],
    cuidados: [
      'Gere as definições de novo sempre que atualizar o Playwright.',
      'Revise os testes consertados pelo *healer*: um teste "ajustado para passar" pode esconder um bug ([Antipadrões](/aprofundar/antipadroes)).',
    ],
    verificado: VERIFICADO_EM,
  },
  {
    id: 'cypress-skills',
    nome: 'Cypress AI Skills',
    tipos: ['skill'],
    stacks: ['cypress'],
    organizacao: 'Cypress.io',
    descricao:
      '`cypress-author` (escrever e corrigir testes), `cypress-explain` (revisar e explicar) e `cypress-docs` (respostas com base na documentação da versão instalada), entre outras.',
    url: 'https://docs.cypress.io/app/tooling/ai-skills',
    instalacao: [{titulo: 'Terminal', linguagem: 'bash', conteudo: 'npx skills add cypress-io/ai-toolkit\n'}],
    cuidados: ['A skill `cypress-cloud-cli` usa a CLI autenticada do Cypress Cloud. Dispense-a se o projeto não usa o Cloud.'],
    requisitos: 'Gratuitas; não exigem conta no Cypress Cloud',
    verificado: VERIFICADO_EM,
  },
  {
    id: 'cypress-cloud-mcp',
    nome: 'Cypress Cloud MCP',
    tipos: ['mcp'],
    stacks: ['cypress'],
    organizacao: 'Cypress.io',
    descricao: 'Consulta as execuções do Cypress Cloud: falhas, testes instáveis, capturas e relatórios de acessibilidade.',
    url: 'https://docs.cypress.io/cloud/integrations/cloud-mcp',
    instalacao: [
      {
        titulo: 'Configuração (login por OAuth)',
        linguagem: 'json',
        conteudo: '{\n  "mcpServers": {\n    "cypress": {\n      "url": "https://mcp.cypress.io/mcp"\n    }\n  }\n}\n',
      },
    ],
    cuidados: [
      'Só consulta: não altera código nem apaga execuções.',
      'É um serviço remoto. Um administrador da organização precisa habilitar a integração.',
    ],
    requisitos: 'Conta no Cypress Cloud (qualquer plano)',
    verificado: VERIFICADO_EM,
  },
  {
    id: 'postman-mcp',
    nome: 'Postman MCP',
    tipos: ['mcp'],
    stacks: ['postman'],
    organizacao: 'Postman',
    descricao: 'Acesso a coleções, especificações OpenAPI, ambientes e workspaces do Postman.',
    url: 'https://github.com/postmanlabs/postman-mcp-server',
    instalacao: [
      {titulo: 'Remoto (login por OAuth)', linguagem: 'text', conteudo: 'https://mcp.postman.com/minimal\n'},
      {
        titulo: 'Local (chave na variável POSTMAN_API_KEY)',
        linguagem: 'bash',
        conteudo: 'npx @postman/postman-mcp-server\n',
      },
    ],
    cuidados: [
      'Comece pelo modo Minimal, que é o padrão. Os modos Code e Full expõem mais ferramentas.',
      'Não há modo somente leitura documentado: mantenha a aprovação manual para ferramentas que alteram coleções.',
      'A chave da API entra por variável de ambiente, nunca num arquivo versionado (regra [R2](/regras)).',
    ],
    licenca: 'Apache-2.0',
    verificado: VERIFICADO_EM,
  },
  {
    id: 'sonarqube-mcp',
    nome: 'SonarQube MCP',
    tipos: ['mcp'],
    stacks: ['sonarqube'],
    organizacao: 'SonarSource',
    descricao:
      'Traz para o agente os problemas, quality gates, security hotspots e a cobertura do SonarQube Server ou Cloud, além de analisar trechos de código.',
    url: 'https://github.com/SonarSource/sonarqube-mcp-server',
    instalacao: [
      {
        titulo: 'Configuração (SonarQube Server, somente leitura)',
        linguagem: 'json',
        conteudo:
          '{\n  "mcpServers": {\n    "sonarqube": {\n      "command": "docker",\n      "args": ["run", "--init", "--pull=always", "-i", "--rm", "-e", "SONARQUBE_TOKEN", "-e", "SONARQUBE_URL", "-e", "SONARQUBE_READ_ONLY", "sonarsource/sonarqube-mcp"],\n      "env": {\n        "SONARQUBE_TOKEN": "<token>",\n        "SONARQUBE_URL": "<url>",\n        "SONARQUBE_READ_ONLY": "true"\n      }\n    }\n  }\n}\n',
      },
    ],
    cuidados: [
      '`SONARQUBE_READ_ONLY=true` desliga as operações de escrita, como mudar o status de um problema.',
      'O token é uma credencial: troque `<token>` por uma referência à variável de ambiente, no formato da sua ferramenta ([roteiro de MCP](/estender/mcp)).',
      '`SONARQUBE_TOOLSETS` restringe os grupos de ferramentas expostos.',
    ],
    requisitos: 'Docker, ou Java 21 ou superior para rodar o JAR',
    licenca: 'Source-available (a verificar)',
    verificado: VERIFICADO_EM,
  },
  {
    id: 'vitest-guia',
    nome: 'Writing Tests with AI (Vitest)',
    tipos: ['guia'],
    stacks: ['jest-vitest'],
    organizacao: 'Vitest',
    descricao:
      'Guia oficial para escrever testes com assistentes de IA: contexto, pedidos específicos, revisão dos testes gerados e armadilhas comuns, como usar APIs do Jest num projeto Vitest.',
    url: 'https://vitest.dev/guide/learn/writing-tests-with-ai',
    cuidados: ['Ao pedir que o agente rode os testes, use `vitest run` ou `vitest --no-watch`, como recomenda o guia.'],
    verificado: VERIFICADO_EM,
  },

  // Análise de dados
  {
    id: 'jupyter-ai',
    nome: 'Jupyter AI',
    tipos: ['extensao'],
    stacks: ['jupyter'],
    organizacao: 'JupyterLab (projeto em incubação)',
    descricao:
      'Extensão que conecta agentes como OpenCode e Claude Code aos notebooks, com chat dentro do JupyterLab e um servidor MCP do Jupyter embutido. O agente pede aprovação antes de escrever arquivos ou executar comandos.',
    url: 'https://github.com/jupyterlab/jupyter-ai',
    cuidados: [
      'O projeto está em incubação na organização JupyterLab. A instalação fica na documentação do projeto (a verificar).',
      'Notebooks costumam ter dados de pesquisa: confira o que pode ser enviado ao modelo ([Dados](/aprofundar/dados)).',
    ],
    verificado: VERIFICADO_EM,
  },
];

/**
 * O que fazer quando a stack não tem item oficial. Também é a opção "Outra".
 * Markdown curto, um passo por item.
 */
export const SEM_ITEM_OFICIAL: string[] = [
  '**Registre os comandos no AGENTS.md:** como rodar um teste, o lint e o build. Com a CLI da stack, o agente se vira bem sem MCP ([AGENTS.md](/aprofundar/agents-md)).',
  '**Use documentação feita para agentes:** procure um `llms.txt` no site oficial da stack ou documentação que vem junto do pacote, e passe a URL ao agente.',
  '**Escreva uma skill do projeto:** uma skill curta com as convenções da sua stack, como no roteiro [Adotar uma skill](/estender/skill).',
  '**Skills e MCPs de comunidade** existem para quase toda stack, mas não entram nesta página. Se usar um, faça a auditoria antes (regra [R5](/regras)).',
];

const STACKS_COM_ITEM = new Set(EXEMPLOS.flatMap((e) => e.stacks));

/** Stacks que ainda não têm nenhum item oficial. */
export function semItemOficial(stack: StackId): boolean {
  return !STACKS_COM_ITEM.has(stack);
}
