// Gerador de configurações de permissão seguras por ferramenta (regras R2, R3, R4).
import type {Escolha} from '@/content/tipos';
import type {TipoProjeto} from './agentsMd';

export interface OpcoesPermissoes {
  ferramenta: Escolha;
  projeto: TipoProjeto;
  /** Comandos que o agente pode rodar sem pedir (um por item). */
  permitidos: string[];
  /** true: `git push` pede confirmação; false: é bloqueado. */
  pushComConfirmacao: boolean;
}

export interface ResultadoPermissoes {
  /** Arquivo a criar, quando a ferramenta usa arquivo de configuração. */
  arquivo?: string;
  linguagem: 'json' | 'markdown';
  conteudo: string;
  observacoes: string[];
}

export function comandosSugeridos(projeto: TipoProjeto): string[] {
  if (projeto === 'dados') return ['uv run pytest', 'uv run ruff check', 'uv run ruff format'];
  if (projeto === 'infra') return ['terraform fmt', 'terraform validate', 'terraform plan'];
  return ['npm test', 'npm run lint', 'npm run build'];
}

const GIT_LEITURA = ['git status', 'git diff', 'git log'];

function negados(projeto: TipoProjeto): string[] {
  const base = ['rm -rf', 'git push --force', 'git reset --hard'];
  if (projeto === 'infra') {
    return [...base, 'terraform apply', 'terraform destroy', 'kubectl delete', 'kubectl apply', 'helm uninstall'];
  }
  return base;
}

function comConfirmacao(projeto: TipoProjeto): string[] {
  const base = ['npm install', 'pip install', 'uv add', 'curl', 'wget'];
  if (projeto === 'dados') return [...base, 'psql', 'mysql'];
  if (projeto === 'infra') return [...base, 'kubectl', 'ssh'];
  return base;
}

const SEGREDOS_LEITURA = ['.env', '.env.*', 'secrets/**', '*.pem', '*.key'];

function limpar(comandos: string[]): string[] {
  return [...new Set(comandos.map((c) => c.trim()).filter(Boolean))];
}

function opencode(o: OpcoesPermissoes): ResultadoPermissoes {
  // No OpenCode, a última regra que casa vence: "*" primeiro, deny por último.
  const bash: Record<string, string> = {'*': 'ask'};
  for (const c of limpar([...GIT_LEITURA, ...o.permitidos])) bash[`${c}*`] = 'allow';
  for (const c of comConfirmacao(o.projeto)) bash[`${c} *`] = 'ask';
  bash['git push *'] = o.pushComConfirmacao ? 'ask' : 'deny';
  for (const c of negados(o.projeto)) bash[`${c}*`] = 'deny';

  const config = {
    $schema: 'https://opencode.ai/config.json',
    permission: {
      edit: 'ask',
      read: {
        '*': 'allow',
        '*.env': 'deny',
        '*.env.*': 'deny',
        '*.env.example': 'allow',
        'secrets/**': 'deny',
        '*.pem': 'deny',
        '*.key': 'deny',
      },
      bash,
      webfetch: 'ask',
      external_directory: 'ask',
    },
  };
  return {
    arquivo: 'opencode.json',
    linguagem: 'json',
    conteudo: JSON.stringify(config, null, 2) + '\n',
    observacoes: [
      'A última regra que casa é a que vale: a ordem do arquivo importa.',
      'Depois de se acostumar com o fluxo, você pode trocar "edit": "ask" por "allow".',
      'A opção --auto aprova tudo o que seria "ask", mas as regras "deny" continuam valendo.',
    ],
  };
}

function claudeCode(o: OpcoesPermissoes): ResultadoPermissoes {
  // No Claude Code, deny > ask > allow, independentemente da ordem.
  const config = {
    permissions: {
      allow: limpar([...GIT_LEITURA, ...o.permitidos]).map((c) => `Bash(${c} *)`),
      ask: [
        ...comConfirmacao(o.projeto).map((c) => `Bash(${c} *)`),
        ...(o.pushComConfirmacao ? ['Bash(git push *)'] : []),
      ],
      deny: [
        'Read(./.env)',
        'Read(./.env.*)',
        'Read(./secrets/**)',
        'Read(**/*.pem)',
        'Read(**/*.key)',
        ...(o.pushComConfirmacao ? [] : ['Bash(git push *)']),
        ...negados(o.projeto).map((c) => `Bash(${c} *)`),
      ],
    },
  };
  return {
    arquivo: '.claude/settings.json',
    linguagem: 'json',
    conteudo: JSON.stringify(config, null, 2) + '\n',
    observacoes: [
      'deny vence ask, que vence allow: uma regra deny não tem exceção.',
      'Read(./.env.*) também bloqueia o .env.example. Se o agente precisar dele, documente as variáveis no AGENTS.md.',
      'Ajustes pessoais vão em .claude/settings.local.json (fora do git).',
    ],
  };
}

function cline(o: OpcoesPermissoes): ResultadoPermissoes {
  const conteudo = [
    '## Cline → Settings → Auto Approve',
    '',
    '- [x] **Read project files**',
    '- [ ] **Read all files** (fora do workspace): manter desligado',
    '- [ ] **Edit project files**: ligar só depois de conhecer o fluxo',
    '- [ ] **Edit all files** (fora do workspace): manter desligado',
    '- [ ] **Execute safe commands**: ligar só depois de conhecer o fluxo',
    '- [ ] **Execute all commands**: manter desligado',
    '- [ ] **Use MCP servers**: avaliar servidor a servidor',
    '- [ ] **YOLO Mode**: só em contêiner ou VM (regra R3)',
    '',
    '## Comandos que exigem atenção ao aprovar',
    '',
    ...negados(o.projeto).map((c) => `- \`${c}\`: recuse`),
    `- \`git push\`: ${o.pushComConfirmacao ? 'aprove só depois de revisar o diff' : 'recuse; faça o push você mesmo'}`,
    ...comConfirmacao(o.projeto).map((c) => `- \`${c}\`: confira antes de aprovar`),
  ].join('\n');
  return {
    linguagem: 'markdown',
    conteudo: conteudo + '\n',
    observacoes: [
      'O Cline não tem regras por comando: o controle é por categoria de ação.',
      '.clineignore não bloqueia a leitura de segredos. Para bloquear de fato, use o hook PreToolUse documentado pelo Cline.',
      'Ative os Checkpoints para poder desfazer edições.',
    ],
  };
}

function antigravity(o: OpcoesPermissoes): ResultadoPermissoes {
  const conteudo = [
    '## Antigravity → Settings',
    '',
    '- **Terminal command auto execution:** "Request Review" (evite "Always Proceed")',
    `- **Allowlist do terminal:** ${limpar([...GIT_LEITURA, ...o.permitidos]).map((c) => `\`${c}\``).join(', ')}`,
    `- **Denylist do terminal:** ${negados(o.projeto).map((c) => `\`${c}\``).join(', ')}${o.pushComConfirmacao ? '' : ', `git push`'}`,
    '- **Non-workspace file access:** desligado (padrão)',
    '- **Strict mode:** recomendado ao trabalhar com código ou dados sensíveis',
    '- **Terminal sandbox:** ligado (macOS e Linux)',
  ].join('\n');
  return {
    linguagem: 'markdown',
    conteudo: conteudo + '\n',
    observacoes: [
      'O strict mode força "Request Review", ignora a allowlist, respeita o .gitignore e ativa o sandbox sem rede.',
      'No Antigravity CLI, use toolPermission "request-review" e regras deny em permissions.',
    ],
  };
}

function generico(o: OpcoesPermissoes): ResultadoPermissoes {
  const conteudo = [
    '## Princípios para qualquer agente',
    '',
    `- **Permitir sem perguntar:** ${limpar([...GIT_LEITURA, ...o.permitidos]).map((c) => `\`${c}\``).join(', ')}`,
    `- **Pedir confirmação:** edições de arquivo, ${comConfirmacao(o.projeto).map((c) => `\`${c}\``).join(', ')}${o.pushComConfirmacao ? ', `git push`' : ''}`,
    `- **Negar:** ${negados(o.projeto).map((c) => `\`${c}\``).join(', ')}${o.pushComConfirmacao ? '' : ', `git push`'}`,
    `- **Negar leitura:** ${SEGREDOS_LEITURA.map((c) => `\`${c}\``).join(', ')}`,
    '- **Acesso fora da pasta do projeto:** negado',
    '- **Auto-aprovação total:** só em contêiner ou VM (regra R3)',
  ].join('\n');
  return {
    linguagem: 'markdown',
    conteudo: conteudo + '\n',
    observacoes: ['Procure na documentação da sua ferramenta como expressar cada item acima.'],
  };
}

export function gerarPermissoes(o: OpcoesPermissoes): ResultadoPermissoes {
  switch (o.ferramenta) {
    case 'opencode':
      return opencode(o);
    case 'claude-code':
      return claudeCode(o);
    case 'cline':
      return cline(o);
    case 'antigravity':
      return antigravity(o);
    default:
      return generico(o);
  }
}
