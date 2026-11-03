import {PERGUNTA_FERRAMENTA} from '../perguntas';
import type {Roteiro} from '../tipos';

// Jornada "Estender meu agente": três roteiros (instrução, skill, MCP).

const PROXIMOS_ESTENDER = {
  instrucao: {
    titulo: 'Criar uma instrução ou regra',
    descricao: 'AGENTS.md, regra por caminho ou garantia via permissão/hook.',
    para: '/estender/instrucao',
  },
  skill: {
    titulo: 'Adotar uma skill',
    descricao: 'Encontrar, auditar, instalar e adaptar uma skill pronta.',
    para: '/estender/skill',
  },
  mcp: {
    titulo: 'Conectar um servidor MCP',
    descricao: 'Dar ao agente acesso a um sistema externo com segurança.',
    para: '/estender/mcp',
  },
};

export const estenderInstrucao: Roteiro = {
  id: 'estender-instrucao',
  caminho: '/estender/instrucao',
  titulo: 'Criar uma instrução ou regra',
  descricao:
    'Ensine o agente a seguir uma convenção do projeto, no lugar certo: AGENTS.md, regra com escopo por caminho ou garantia configurada na ferramenta.',
  perguntas: [PERGUNTA_FERRAMENTA],
  passos: [
    {
      id: 'decidir-mecanismo',
      titulo: 'Escolha o mecanismo certo',
      resumo:
        'Uma instrução em texto é uma **sugestão**: o modelo pode ignorá-la. Escolha o mecanismo pelo tipo de necessidade.',
      blocos: [
        {
          tipo: 'lista',
          titulo: 'Qual é o seu caso?',
          itens: [
            '**Vale sempre e é curta** → `AGENTS.md` (passo 2).',
            '**Só importa em parte do código** → regra com escopo por caminho (passo 3).',
            '**Precisa acontecer sempre, sem exceção, ou nunca** → permissão ou hook, executados pela ferramenta (passo 4).',
            '**É um procedimento de várias etapas** → uma [skill](/estender/skill).',
          ],
        },
      ],
      porque: {
        texto: 'Cada mecanismo tem um custo de contexto e um grau de garantia diferentes.',
        artigo: 'quando-usar-o-que',
      },
    },
    {
      id: 'agents-md',
      titulo: 'Regra geral: acrescente ao AGENTS.md',
      resumo:
        'Peça ao agente para incluir a instrução de forma concreta e verificável, sem duplicar nem contradizer o que já existe.',
      regras: ['R7'],
      blocos: [
        {
          tipo: 'prompt',
          titulo: 'Acrescentar uma instrução',
          texto:
            'Quero que você passe a seguir esta instrução neste projeto: <descreva a instrução>.\nAcrescente-a ao AGENTS.md na seção adequada, de forma concreta e verificável, em uma linha se possível. Antes, verifique se ela contradiz ou duplica algo que já está no arquivo. Mostre o diff antes de salvar.',
        },
        {
          tipo: 'lista',
          titulo: 'Boas instruções',
          itens: [
            'Concretas: "use indentação de 2 espaços", e não "formate bem o código".',
            'Curtas: o arquivo inteiro é carregado em toda sessão.',
            'Ênfase ("IMPORTANTE") só em uma ou duas linhas; se tudo é importante, nada se destaca.',
          ],
        },
      ],
      porque: {
        texto: 'Acrescente uma instrução quando o agente errar a mesma coisa duas vezes ou quando você repetir a mesma correção.',
        artigo: 'agents-md',
      },
    },
    {
      id: 'regra-escopo',
      titulo: 'Parte do código: regra com escopo por caminho',
      resumo:
        'Instruções que só importam em parte do código (front-end, migrações, notebooks) não precisam ocupar contexto o tempo todo.',
      instrucoes: {
        opencode:
          'O OpenCode não tem regras ativadas por caminho. A alternativa é manter um arquivo de instruções por área e incluí-lo pelo campo `instructions` do `opencode.json`, que aceita globs. Lembre-se de que ele é carregado em toda sessão: mantenha-o curto.',
        cline:
          'Crie um arquivo em `.clinerules/` com frontmatter `paths:`. A regra só é ativada quando arquivos que casam com os padrões estão em contexto, e o Cline avisa quando ela é aplicada.',
        'claude-code': 'Crie um arquivo em `.claude/rules/` com frontmatter `paths:`. A regra só é carregada quando o agente trabalha com arquivos que casam com os padrões.',
        antigravity:
          'Crie um arquivo em `.agents/rules/` com `trigger: glob`. Padrões que começam com `*` devem ficar entre aspas.',
        generico:
          'Procure na documentação se a ferramenta suporta regras com escopo por caminho. Se não suportar, um `AGENTS.md` dentro do subdiretório costuma ser a alternativa.',
      },
      blocos: [
        {
          tipo: 'arquivo',
          ferramentas: ['opencode'],
          arquivo: 'opencode.json',
          linguagem: 'json',
          conteudo:
            '{\n  "$schema": "https://opencode.ai/config.json",\n  "instructions": ["docs/agentes/frontend.md"]\n}\n',
        },
        {
          tipo: 'arquivo',
          ferramentas: ['cline'],
          arquivo: '.clinerules/frontend.md',
          linguagem: 'markdown',
          conteudo:
            '---\npaths:\n  - "web/src/**/*.tsx"\n---\n\n# Front-end\n- Componentes em PascalCase, um por arquivo\n- Estilos em CSS Modules, sem CSS global\n',
        },
        {
          tipo: 'arquivo',
          ferramentas: ['claude-code'],
          arquivo: '.claude/rules/frontend.md',
          linguagem: 'markdown',
          conteudo:
            '---\npaths:\n  - "web/src/**/*.tsx"\n---\n\n# Front-end\n- Componentes em PascalCase, um por arquivo\n- Estilos em CSS Modules, sem CSS global\n',
        },
        {
          tipo: 'arquivo',
          ferramentas: ['antigravity'],
          arquivo: '.agents/rules/frontend.md',
          linguagem: 'markdown',
          conteudo:
            '---\ntrigger: glob\nglobs: "web/src/**/*.tsx"\ndescription: "Convenções do front-end"\n---\n\n# Front-end\n- Componentes em PascalCase, um por arquivo\n- Estilos em CSS Modules, sem CSS global\n',
        },
      ],
      fontes: [
        {titulo: 'OpenCode — Rules', url: 'https://opencode.ai/docs/rules/'},
        {titulo: 'Cline — Rules', url: 'https://docs.cline.bot/customization/cline-rules'},
        {titulo: 'Claude Code — Memory', url: 'https://code.claude.com/docs/en/memory'},
        {titulo: 'Antigravity — Rules', url: 'https://antigravity.google/docs/rules'},
      ],
    },
    {
      id: 'garantia',
      titulo: 'O que não pode falhar: permissão ou hook',
      resumo:
        'Se a instrução é do tipo "nunca faça X" ou "sempre rode Y depois de editar", não confie no texto: configure a ferramenta, que executa a regra independentemente do modelo.',
      instrucoes: {
        opencode:
          'Para bloquear, use regras `deny` em `permission` no `opencode.json` (veja o [gerador de permissões](/ferramentas/permissoes)). Para automações, como formatar após editar, use [plugins](https://opencode.ai/docs/plugins/).',
        cline:
          'Use os [hooks do Cline](https://docs.cline.bot/features/hooks), como o `PreToolUse`, para bloquear ou automatizar ações.',
        'claude-code':
          'Para bloquear, use regras `deny` em `.claude/settings.json`. Para automatizar, use [hooks](https://code.claude.com/docs/en/hooks): `PostToolUse` para formatar após editar, `PreToolUse` para barrar comandos. Você pode pedir ao próprio agente: _"escreva um hook que roda o lint após cada edição"_.',
        antigravity:
          'Use a denylist do terminal e o strict mode nas configurações. No CLI, regras `deny` em `permissions` bloqueiam a ação em qualquer modo.',
        generico: 'Procure por "permissions", "deny" ou "hooks" na documentação da ferramenta.',
      },
      regras: ['R3'],
      porque: {
        texto:
          'Instruções em texto são contexto, não configuração obrigatória. O que precisa ser garantido deve ser garantido pela ferramenta.',
        artigo: 'permissoes',
      },
    },
    {
      id: 'testar-instrucao',
      titulo: 'Teste se a instrução pegou',
      resumo: 'Abra uma **sessão nova**, já que as instruções costumam ser carregadas no início, e confira.',
      blocos: [
        {
          tipo: 'prompt',
          titulo: 'Conferir as instruções aplicadas',
          texto:
            'Sem alterar nada: explique quais instruções e regras se aplicam quando você edita o arquivo <caminho/do/arquivo>, e de qual arquivo vem cada uma.',
        },
      ],
    },
  ],
  proximos: [PROXIMOS_ESTENDER.skill, PROXIMOS_ESTENDER.mcp],
};

export const estenderSkill: Roteiro = {
  id: 'estender-skill',
  caminho: '/estender/skill',
  titulo: 'Adotar uma skill',
  descricao:
    'Encontre uma skill pronta, audite, instale no lugar certo e adapte ao projeto com a ajuda do próprio agente.',
  perguntas: [PERGUNTA_FERRAMENTA],
  passos: [
    {
      id: 'encontrar-skill',
      titulo: 'Encontre uma skill pronta',
      resumo:
        'Antes de escrever do zero, procure uma skill que já resolva a maior parte do problema. Skills seguem um padrão aberto (`SKILL.md`), então uma skill escrita para uma ferramenta costuma funcionar nas outras.',
      blocos: [
        {
          tipo: 'lista',
          titulo: 'Onde procurar',
          itens: [
            '[Repositório de skills da Anthropic](https://github.com/anthropics/skills): exemplos de referência do padrão.',
            'Repositórios oficiais das ferramentas e bibliotecas que você usa.',
            'Skills que colegas do laboratório já usam. Um catálogo curado do ATLab está previsto.',
          ],
        },
        {
          tipo: 'aviso',
          nivel: 'warning',
          texto:
            'Diretórios e marketplaces abertos reúnem skills de qualidade e origem muito variadas. Origem desconhecida pede auditoria redobrada.',
        },
      ],
      porque: {
        texto:
          'Uma skill empacota instruções, scripts e recursos. Só o nome e a descrição ficam sempre no contexto; o resto é carregado quando a tarefa pede (*progressive disclosure*).',
        artigo: 'quando-usar-o-que',
      },
      fontes: [
        {titulo: 'Especificação Agent Skills', url: 'https://agentskills.io/specification'},
        {
          titulo: 'Anthropic — Equipping agents with Agent Skills',
          url: 'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills',
        },
      ],
    },
    {
      id: 'auditar-skill',
      titulo: 'Audite antes de instalar',
      resumo:
        'Uma skill é um conjunto de instruções **e scripts** que o agente executa com as suas permissões. Leia tudo antes de instalar e marque cada item abaixo.',
      regras: ['R5'],
      blocos: [
        {tipo: 'checklist', checklist: 'auditoria-skill'},
        {
          tipo: 'prompt',
          titulo: 'Pedir uma análise ao agente (sem instalar)',
          texto:
            'Analise a skill na pasta <caminho> SEM executar nada. Resuma o que o SKILL.md instrui o agente a fazer, liste todos os scripts e o que cada um executa, quais arquivos leem e escrevem e quais endereços de rede acessam. Aponte qualquer instrução que fuja do propósito da descrição, peça credenciais, envie dados para fora ou desative verificações.',
        },
        {
          tipo: 'aviso',
          nivel: 'warning',
          texto:
            'A análise do agente ajuda, mas não substitui a sua leitura: uma skill maliciosa pode conter texto escrito justamente para enganar o agente (prompt injection).',
        },
      ],
      porque: {
        texto: 'Skills de terceiros são código de terceiros. A regra R5 exige revisão antes do uso.',
        artigo: 'cadeia-de-suprimentos',
      },
    },
    {
      id: 'instalar-skill',
      titulo: 'Instale no lugar certo',
      resumo:
        'Skills de projeto ficam no repositório (versionadas, valem para o time); skills pessoais ficam no seu diretório de usuário. Cada skill é uma pasta com um `SKILL.md`, cujo `name` deve ser igual ao nome da pasta.',
      instrucoes: {
        opencode:
          '- **Projeto:** `.opencode/skills/<nome>/SKILL.md`. Também lê `.claude/skills/` e `.agents/skills/`.\n- **Pessoal:** `~/.config/opencode/skills/<nome>/SKILL.md`.\n- O `name` usa minúsculas e hífens (ex.: `revisao-de-pr`).\n- Para controlar o carregamento, use `permission.skill` no `opencode.json` (`allow`, `ask` ou `deny`, com curingas).',
        cline:
          '- **Projeto:** `.cline/skills/<nome>/SKILL.md`. Também lê `.clinerules/skills/` e `.claude/skills/`.\n- **Pessoal:** `~/.cline/skills/<nome>/`.\n- As skills aparecem no menu de regras (ícone de balança) → aba **Skills**, com chave liga/desliga.\n- Se a aba não aparecer, verifique em Settings → Features se Skills está habilitado.',
        'claude-code':
          '- **Projeto:** `.claude/skills/<nome>/SKILL.md` (versionado).\n- **Pessoal:** `~/.claude/skills/<nome>/SKILL.md`.\n- Revise no frontmatter campos como `allowed-tools` (pré-aprova ferramentas) e `hooks`.\n- Para procedimentos com efeitos colaterais, use `disable-model-invocation: true`: a skill só roda quando você chama `/nome`.',
        antigravity:
          '- **Projeto:** `.agents/skills/<nome>/SKILL.md`.\n- **Global:** `~/.gemini/config/skills/<nome>/`. No CLI, `~/.gemini/antigravity-cli/skills/`.\n- Os caminhos globais mudaram entre versões; confira a [documentação de skills](https://antigravity.google/docs/skills).',
        generico:
          'Confira na documentação onde a ferramenta procura skills. Muitas leem `.agents/skills/` ou `.claude/skills/` por compatibilidade.',
      },
      blocos: [
        {
          tipo: 'codigo',
          titulo: 'SKILL.md (estrutura mínima)',
          linguagem: 'markdown',
          conteudo:
            '---\nname: revisao-de-pr\ndescription: Revisa o diff de um PR segundo o checklist do projeto. Use quando o usuário pedir revisão de código ou de PR.\n---\n\n# Revisão de PR\n\n1. Leia o diff completo com `git diff main...HEAD`.\n2. Verifique cada item de `checklist.md` (nesta pasta).\n3. Reporte só problemas de correção e de requisitos.\n',
        },
      ],
      fontes: [
        {titulo: 'OpenCode — Skills', url: 'https://opencode.ai/docs/skills/'},
        {titulo: 'Cline — Skills', url: 'https://docs.cline.bot/features/skills'},
        {titulo: 'Claude Code — Skills', url: 'https://code.claude.com/docs/en/skills'},
        {titulo: 'Antigravity — Skills', url: 'https://antigravity.google/docs/skills'},
      ],
    },
    {
      id: 'adaptar-skill',
      titulo: 'Adapte com o próprio agente',
      resumo:
        'Skills prontas raramente encaixam perfeitamente. Peça ao agente para ajustá-la às convenções do projeto e reduzir o escopo ao que você precisa.',
      blocos: [
        {
          tipo: 'prompt',
          titulo: 'Adaptar a skill ao projeto',
          texto:
            'Leia a skill em <caminho>/SKILL.md e o AGENTS.md deste projeto. Adapte a skill para este projeto:\n1. troque exemplos, comandos e caminhos pelos nossos;\n2. remova as partes que não se aplicam;\n3. reescreva a description para dizer claramente QUANDO usar a skill, com as palavras que eu usaria ao pedir essa tarefa;\n4. mantenha o SKILL.md curto e mova detalhes longos para arquivos de referência na mesma pasta.\nNão adicione scripts nem permissões novos. Mostre o diff antes de salvar.',
        },
        {
          tipo: 'lista',
          titulo: 'O que torna uma skill boa',
          itens: [
            'A `description` diz o que a skill faz **e quando** usá-la: é por ela que o agente decide carregá-la.',
            'O `SKILL.md` é conciso; detalhes ficam em arquivos de referência, lidos só se necessário.',
            'Partes frágeis ou repetitivas viram scripts determinísticos.',
            'Nada de segredos dentro da skill (R2).',
          ],
        },
      ],
      regras: ['R2'],
    },
    {
      id: 'testar-skill',
      titulo: 'Teste com cenários reais',
      resumo: 'Uma skill só vale se melhora o resultado. Compare a mesma tarefa com e sem ela.',
      blocos: [
        {
          tipo: 'lista',
          titulo: 'Como testar',
          itens: [
            'Escolha 2 ou 3 pedidos reais que deveriam acionar a skill e 1 que **não** deveria.',
            'Rode cada pedido numa sessão nova e veja se a skill foi carregada.',
            'Compare o resultado com uma sessão sem a skill.',
            'Se a skill não é acionada quando deveria, melhore a `description`. Se é acionada à toa, restrinja-a.',
          ],
        },
        {
          tipo: 'prompt',
          titulo: 'Verificar o acionamento',
          texto: 'Antes de começar, diga se alguma skill se aplica a este pedido e qual. Depois execute: <pedido real>',
        },
      ],
    },
    {
      id: 'manter-skill',
      titulo: 'Versione e mantenha',
      resumo: 'Skills de projeto vão para o git como qualquer código: revisão por PR, histórico e responsáveis.',
      regras: ['R5'],
      blocos: [
        {
          tipo: 'lista',
          titulo: 'Manutenção',
          itens: [
            'Commite a skill junto com o código que ela apoia.',
            'Atualizações de skills de terceiros passam por nova auditoria.',
            'Remova skills que ninguém usa: cada uma ocupa um pouco de contexto em toda sessão.',
            'Registre a origem e a licença, no frontmatter (`license`, `metadata`) ou num README da pasta.',
          ],
        },
      ],
    },
  ],
  proximos: [PROXIMOS_ESTENDER.mcp, PROXIMOS_ESTENDER.instrucao],
};

export const estenderMcp: Roteiro = {
  id: 'estender-mcp',
  caminho: '/estender/mcp',
  titulo: 'Conectar um servidor MCP',
  descricao:
    'Dê ao agente acesso a um sistema externo, como banco, issue tracker ou documentação, com um servidor confiável e o mínimo de privilégio.',
  perguntas: [PERGUNTA_FERRAMENTA],
  passos: [
    {
      id: 'precisa-mcp',
      titulo: 'Confirme que precisa de um MCP',
      resumo:
        'Servidores MCP dão ao agente acesso a sistemas externos. Mas cada servidor habilitado acrescenta as descrições das suas ferramentas ao contexto de toda sessão.',
      blocos: [
        {
          tipo: 'lista',
          titulo: 'Antes de instalar',
          itens: [
            '**Já existe uma CLI** para o sistema (`gh`, `kubectl`, `psql`, `aws`…)? Ela costuma ser mais simples e econômica em contexto: peça ao agente para usá-la.',
            '**É só ler documentação?** Muitas vezes basta passar a URL ao agente.',
            '**Precisa de acesso estruturado e recorrente** a um sistema sem uma boa CLI? Aí o MCP vale a pena.',
          ],
        },
      ],
      fontes: [
        {
          titulo: 'Anthropic — Best practices (Use CLI tools)',
          url: 'https://code.claude.com/docs/en/best-practices',
        },
        {titulo: 'OpenCode — MCP servers', url: 'https://opencode.ai/docs/mcp-servers/'},
      ],
    },
    {
      id: 'escolher-servidor',
      titulo: 'Escolha um servidor confiável',
      resumo: 'Prefira servidores oficiais, mantidos pelo fornecedor do sistema que você quer acessar.',
      blocos: [
        {
          tipo: 'lista',
          titulo: 'Onde procurar',
          itens: [
            'Documentação do próprio serviço: muitos já oferecem um servidor MCP oficial.',
            '[Registro oficial do MCP](https://registry.modelcontextprotocol.io/).',
            'Servidores de referência em [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers).',
          ],
        },
      ],
      instrucoes: {
        antigravity: 'O Antigravity tem uma **MCP Store** (menu **…** do painel do agente → **MCP Servers**). Mesmo lá, aplique a auditoria do próximo passo.',
        generico: 'Mesmo em lojas e catálogos, aplique a auditoria do próximo passo.',
      },
    },
    {
      id: 'auditar-servidor',
      titulo: 'Audite o servidor',
      resumo: 'Um servidor MCP pode ler e alterar dados e devolve texto que o modelo trata como contexto. Revise antes de habilitar.',
      regras: ['R5'],
      blocos: [
        {tipo: 'checklist', checklist: 'auditoria-mcp'},
        {
          tipo: 'aviso',
          nivel: 'warning',
          titulo: 'Prompt injection',
          texto:
            'Servidores que trazem conteúdo externo (páginas, issues, e-mails) podem trazer junto instruções maliciosas. O risco é maior quando o agente também tem acesso a dados privados e pode se comunicar com o exterior.',
        },
      ],
      porque: {
        texto: 'Quanto mais um servidor pode fazer, maior o estrago se o modelo for enganado.',
        artigo: 'prompt-injection',
      },
      fontes: [
        {
          titulo: 'MCP — Security Best Practices',
          url: 'https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices',
        },
      ],
    },
    {
      id: 'configurar-mcp',
      titulo: 'Configure no escopo do projeto',
      resumo:
        'Configure o servidor **só neste projeto** e passe credenciais por variável de ambiente, nunca escritas em arquivos versionados.',
      regras: ['R2'],
      instrucoes: {
        opencode:
          'Adicione o servidor na chave `mcp` do `opencode.json` do projeto. Use `"enabled": false` para desligar sem apagar, e `{env:VARIAVEL}` para ler credenciais do ambiente.',
        cline:
          'No painel do Cline: ícone **MCP Servers** → aba **Configure** → **Configure MCP Servers**, que abre o JSON de configuração. Servidores remotos também podem ser adicionados na aba **Remote Servers**. Esse arquivo fica no seu usuário, fora do repositório: não o versione. Mantenha `autoApprove` vazio ou só com ferramentas de leitura.',
        'claude-code':
          'Use `claude mcp add` com `--scope project` para gravar em `.mcp.json` (versionado e compartilhado com o time). O Claude Code pede aprovação antes de usar servidores vindos de `.mcp.json`. Credenciais entram como `${VARIAVEL}`.',
        antigravity:
          'Para um servidor próprio: menu **…** do painel do agente → **MCP Servers** → **Manage MCP Servers** → **View raw config**. A configuração do workspace fica em `.agents/mcp_config.json`; a global, em `~/.gemini/config/mcp_config.json`.',
        generico:
          'A maioria das ferramentas usa um JSON com `mcpServers`: `command`/`args` para servidores locais e uma URL para remotos. Confira o formato exato na documentação.',
      },
      blocos: [
        {
          tipo: 'arquivo',
          ferramentas: ['opencode'],
          arquivo: 'opencode.json',
          linguagem: 'json',
          conteudo:
            '{\n  "$schema": "https://opencode.ai/config.json",\n  "mcp": {\n    "exemplo-local": {\n      "type": "local",\n      "command": ["npx", "-y", "pacote-do-servidor-mcp"],\n      "enabled": true,\n      "environment": {\n        "API_TOKEN": "{env:EXEMPLO_API_TOKEN}"\n      }\n    },\n    "exemplo-remoto": {\n      "type": "remote",\n      "url": "https://mcp.exemplo.com/mcp",\n      "enabled": true\n    }\n  }\n}\n',
        },
        {
          tipo: 'arquivo',
          ferramentas: ['cline'],
          arquivo: 'cline_mcp_settings.json',
          linguagem: 'json',
          conteudo:
            '{\n  "mcpServers": {\n    "exemplo-local": {\n      "command": "npx",\n      "args": ["-y", "pacote-do-servidor-mcp"],\n      "env": {"API_TOKEN": "<token de escopo mínimo>"},\n      "disabled": false,\n      "autoApprove": []\n    },\n    "exemplo-remoto": {\n      "type": "streamableHttp",\n      "url": "https://mcp.exemplo.com/mcp"\n    }\n  }\n}\n',
        },
        {
          tipo: 'codigo',
          ferramentas: ['claude-code'],
          titulo: 'Terminal',
          linguagem: 'bash',
          conteudo:
            '# servidor remoto (HTTP), compartilhado com o time via .mcp.json\nclaude mcp add --transport http --scope project exemplo https://mcp.exemplo.com/mcp\n\n# servidor local (stdio): tudo depois de -- é o comando do servidor\nclaude mcp add --transport stdio --scope project exemplo-local -- npx -y pacote-do-servidor-mcp\n',
        },
        {
          tipo: 'arquivo',
          ferramentas: ['claude-code'],
          arquivo: '.mcp.json',
          linguagem: 'json',
          conteudo:
            '{\n  "mcpServers": {\n    "exemplo": {\n      "type": "http",\n      "url": "https://mcp.exemplo.com/mcp",\n      "headers": {"Authorization": "Bearer ${EXEMPLO_API_TOKEN}"}\n    }\n  }\n}\n',
        },
        {
          tipo: 'arquivo',
          ferramentas: ['antigravity'],
          arquivo: '.agents/mcp_config.json',
          linguagem: 'json',
          conteudo:
            '{\n  "mcpServers": {\n    "exemplo-local": {\n      "command": "npx",\n      "args": ["-y", "pacote-do-servidor-mcp"]\n    },\n    "exemplo-remoto": {\n      "serverUrl": "https://mcp.exemplo.com/mcp"\n    }\n  }\n}\n',
        },
        {
          tipo: 'aviso',
          nivel: 'warning',
          texto:
            'Os nomes `pacote-do-servidor-mcp` e `mcp.exemplo.com` são marcadores: troque pelo servidor que você auditou. Nunca escreva tokens em arquivos versionados.',
        },
      ],
      fontes: [
        {titulo: 'OpenCode — MCP servers', url: 'https://opencode.ai/docs/mcp-servers/'},
        {titulo: 'Cline — Configuring MCP servers', url: 'https://docs.cline.bot/mcp/configuring-mcp-servers'},
        {titulo: 'Claude Code — MCP', url: 'https://code.claude.com/docs/en/mcp'},
        {titulo: 'Antigravity — MCP', url: 'https://antigravity.google/docs/mcp'},
      ],
    },
    {
      id: 'minimo-privilegio',
      titulo: 'Dê o mínimo de acesso',
      resumo: 'O servidor age com a credencial que você der a ele. Escolha a menor possível.',
      regras: ['R3'],
      blocos: [
        {
          tipo: 'lista',
          titulo: 'Confira',
          itens: [
            'Token somente leitura sempre que possível.',
            'Escopo restrito ao projeto ou repositório necessário.',
            'Ferramentas que escrevem ou apagam continuam pedindo aprovação: não as coloque em auto-aprovação.',
            'Nunca use credenciais de produção.',
          ],
        },
      ],
      porque: {
        texto:
          'Dados privados, conteúdo não confiável e capacidade de comunicação externa juntos formam a combinação que permite exfiltração. Remover qualquer um dos três reduz muito o risco.',
        artigo: 'prompt-injection',
      },
    },
    {
      id: 'testar-mcp',
      titulo: 'Teste e desligue o que não usa',
      resumo: 'Confirme que o servidor funciona e observe o custo em contexto.',
      blocos: [
        {
          tipo: 'prompt',
          titulo: 'Testar o servidor',
          texto:
            'Liste as ferramentas disponíveis no servidor MCP <nome> e o que cada uma faz. Depois, usando apenas ferramentas de leitura, <tarefa simples de teste>.',
        },
        {
          tipo: 'lista',
          titulo: 'Depois do teste',
          itens: [
            'As ferramentas aparecem e funcionam.',
            'Se o servidor ocupa muito contexto, desligue-o quando não estiver usando.',
            'Remova servidores que o projeto não usa mais.',
          ],
        },
      ],
    },
  ],
  proximos: [PROXIMOS_ESTENDER.skill, PROXIMOS_ESTENDER.instrucao],
};
