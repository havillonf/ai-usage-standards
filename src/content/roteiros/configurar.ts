import {PERGUNTA_FERRAMENTA, PERGUNTA_PROJETO} from '../perguntas';
import type {Respostas, Roteiro} from '../tipos';

const FONTE_AGENTS_MD = {titulo: 'agents.md', url: 'https://agents.md/'};
const FONTE_BOAS_PRATICAS = {
  titulo: 'Anthropic — Best practices for Claude Code',
  url: 'https://code.claude.com/docs/en/best-practices',
};

const REVISAO_AGENTS_MD = [
  'Rode cada comando listado e confirme que funciona.',
  'Apague o que o agente descobriria sozinho lendo o código.',
  'Nenhum segredo, token, senha ou dado pessoal (R2).',
  'Cada linha passa no teste: _"se eu apagar isto, o agente vai errar?"_',
  'O arquivo tem menos de ~200 linhas.',
];

function promptCriarAgentsMd(r: Respostas): string {
  const extra =
    r.projeto === 'dados'
      ? '- onde ficam os dados brutos (somente leitura) e os processados, e como reproduzir os experimentos (seeds, versões de dados e de ambiente);\n'
      : r.projeto === 'infra'
        ? '- como validar mudanças (fmt, validate, plan) e que apply/destroy são feitos só por pessoas ou pelo CI;\n'
        : '';
  return `Analise este repositório e crie um arquivo AGENTS.md na raiz, em português, com no máximo ~100 linhas.

Inclua apenas o que um agente não descobriria lendo o código:
- comandos para instalar, rodar todos os testes, rodar um teste só, lint/formatação e build;
- convenções que fogem do padrão da linguagem;
- decisões de arquitetura próprias do projeto;
- o que não deve ser alterado (código gerado, migrações já aplicadas, dados originais);
- convenções de git (branches, commits, PRs);
${extra}
Não inclua segredos, tokens ou senhas, nem descrições arquivo por arquivo.
Escreva instruções concretas e verificáveis (ex.: "rode \`npm test\` antes de commitar", e não "teste suas mudanças").
Quando não souber algo, pergunte em vez de inventar.
Mostre o arquivo para eu revisar antes de salvar.`;
}

export const configurar: Roteiro = {
  id: 'configurar',
  caminho: '/configurar',
  titulo: 'Configurar meu ambiente',
  descricao:
    'Prepare o projeto para trabalhar com um agente: instruções de projeto, permissões seguras e proteção de segredos.',
  perguntas: [
    PERGUNTA_FERRAMENTA,
    PERGUNTA_PROJETO,
    {
      id: 'instrucoes',
      texto: 'O projeto já tem instruções para agentes?',
      ajuda: 'Arquivos que dizem ao agente como trabalhar neste repositório.',
      opcoes: [
        {valor: 'nenhuma', rotulo: 'Não tem', descricao: 'Vamos criar um AGENTS.md do zero'},
        {valor: 'agents-md', rotulo: 'Já tem AGENTS.md', descricao: 'Vamos revisar o que existe'},
        {
          valor: 'outro',
          rotulo: 'Tem outro arquivo',
          descricao: 'CLAUDE.md, .clinerules, GEMINI.md, .cursorrules…',
        },
      ],
    },
  ],
  passos: [
    {
      id: 'conectar-modelo',
      titulo: 'Abra a ferramenta e conecte um modelo',
      resumo:
        'Instale a ferramenta e configure o provedor de modelo que você vai usar. O guia vale para qualquer modelo; para esta parte, siga a documentação oficial.',
      instrucoes: {
        opencode:
          'Instale seguindo a [documentação do OpenCode](https://opencode.ai/docs/). Abra o OpenCode na pasta do projeto, use `/connect` para adicionar um provedor e `/models` para escolher o modelo.',
        cline:
          'Instale a extensão do Cline no seu editor ([documentação](https://docs.cline.bot/)). Nas configurações do Cline, escolha o provedor e o modelo. Dá para usar modelos diferentes nos modos Plan e Act.',
        'claude-code':
          'Instale seguindo a [documentação do Claude Code](https://code.claude.com/docs/) e rode `claude` na pasta do projeto. O login é pedido na primeira execução.',
        antigravity:
          'Baixe e instale pelo [site do Antigravity](https://antigravity.google/), faça login e abra a pasta do projeto como workspace.',
        generico:
          'Siga a documentação da sua ferramenta. Confira na [comparação de ferramentas](/ferramentas) se ela lê `AGENTS.md`: os próximos passos partem desse padrão aberto.',
      },
      regras: ['R2'],
      blocos: [
        {
          tipo: 'aviso',
          nivel: 'warning',
          texto:
            'Guarde a chave de API do provedor fora do repositório: numa variável de ambiente ou no armazenamento de segredos da ferramenta. Nunca a escreva em arquivos versionados.',
        },
      ],
    },
    {
      id: 'criar-agents-md',
      titulo: 'Crie o AGENTS.md',
      quando: (r) => r.instrucoes === 'nenhuma',
      resumo:
        'O `AGENTS.md` é o "README para agentes": comandos, convenções e armadilhas que o agente não descobre sozinho. Escolha um dos caminhos: **deixar o agente rascunhar** (prompt abaixo) ou **preencher o formulário**. Nos dois casos, revise antes de salvar.',
      instrucoes: {
        opencode:
          'O comando `/init` do OpenCode analisa o repositório e cria o `AGENTS.md`. Você também pode usar o prompt abaixo, que já segue as recomendações do laboratório.',
        generico: 'Cole o prompt abaixo na sua ferramenta, com o projeto aberto.',
      },
      regras: ['R7'],
      blocos: [
        {tipo: 'prompt', titulo: 'Rascunhar o AGENTS.md', texto: promptCriarAgentsMd},
        {tipo: 'lista', titulo: 'Revise o rascunho', itens: REVISAO_AGENTS_MD},
        {
          tipo: 'aviso',
          nivel: 'info',
          titulo: 'Prefere preencher à mão?',
          texto: 'Use o formulário abaixo. A prévia é atualizada enquanto você digita, e dá para copiar ou baixar o arquivo.',
        },
        {tipo: 'gerador', gerador: 'agents-md'},
      ],
      porque: {
        texto:
          'Instruções de projeto evitam repetir as mesmas explicações em toda sessão. Como o arquivo é carregado **sempre**, cada linha ocupa contexto: curto e concreto funciona melhor do que completo e longo.',
        artigo: 'agents-md',
      },
      fontes: [FONTE_AGENTS_MD, FONTE_BOAS_PRATICAS],
    },
    {
      id: 'revisar-agents-md',
      titulo: 'Revise o AGENTS.md existente',
      quando: (r) => r.instrucoes === 'agents-md',
      resumo:
        'Instruções desatualizadas são piores que nenhuma: o agente segue com confiança o que já não vale. Peça ao agente uma revisão e decida o que muda.',
      regras: ['R7'],
      blocos: [
        {
          tipo: 'prompt',
          titulo: 'Revisar o AGENTS.md',
          texto:
            'Leia o AGENTS.md deste repositório e compare com o código atual. Aponte:\n- instruções desatualizadas (comandos, caminhos ou ferramentas que não existem mais);\n- contradições;\n- o que você descobriria sozinho lendo o código e pode ser removido;\n- o que está faltando (comandos de teste, armadilhas conhecidas).\nProponha as mudanças como diff e não salve nada antes da minha aprovação.',
        },
        {tipo: 'lista', titulo: 'Confira depois da revisão', itens: REVISAO_AGENTS_MD},
      ],
      porque: {
        texto: 'Trate o AGENTS.md como código: revise quando o agente errar e pode regularmente.',
        artigo: 'agents-md',
      },
      fontes: [FONTE_AGENTS_MD, FONTE_BOAS_PRATICAS],
    },
    {
      id: 'migrar-para-agents-md',
      titulo: 'Traga as instruções para o AGENTS.md',
      quando: (r) => r.instrucoes === 'outro',
      resumo:
        'Consolide o conteúdo comum num `AGENTS.md`, para que qualquer agente leia as mesmas instruções. Nos arquivos de cada ferramenta, deixe só o que for exclusivo dela.',
      regras: ['R7'],
      blocos: [
        {
          tipo: 'prompt',
          titulo: 'Migrar para AGENTS.md',
          texto:
            'Encontre os arquivos de instruções para agentes deste repositório (CLAUDE.md, .clinerules/, GEMINI.md, .cursorrules, .github/copilot-instructions.md). Crie um AGENTS.md na raiz com o conteúdo comum a todos, sem duplicações nem contradições. Nos arquivos específicos de cada ferramenta, deixe só o que for exclusivo daquela ferramenta. Não inclua segredos. Mostre o resultado como diff antes de salvar.',
        },
        {tipo: 'lista', titulo: 'Confira depois da migração', itens: REVISAO_AGENTS_MD},
      ],
      porque: {
        texto:
          'Um arquivo por ferramenta com o mesmo conteúdo acaba divergindo. O `AGENTS.md` é um padrão aberto lido por dezenas de ferramentas.',
        artigo: 'agents-md',
      },
      fontes: [FONTE_AGENTS_MD],
    },
    {
      id: 'ferramenta-le-agents-md',
      titulo: 'Garanta que a ferramenta lê o AGENTS.md',
      resumo: 'Cada ferramenta procura instruções em lugares um pouco diferentes. Confira o que vale para a sua.',
      instrucoes: {
        opencode:
          'Nada a fazer: o OpenCode lê o `AGENTS.md` do projeto automaticamente, além do global em `~/.config/opencode/AGENTS.md`. Se existirem `AGENTS.md` e `CLAUDE.md`, só o `AGENTS.md` é usado. Para incluir outros arquivos, use o campo `instructions` do `opencode.json`.',
        cline:
          'O Cline detecta o `AGENTS.md` e o mostra no painel de regras (ícone de balança, ao lado do seletor de modelo), com uma chave liga/desliga. Confira se ele aparece e está ligado. Regras exclusivas do Cline podem ficar em `.clinerules/`.',
        'claude-code':
          'O Claude Code lê o `AGENTS.md` quando o projeto **não tem** `CLAUDE.md`. Se você também tem (ou quer) um `CLAUDE.md`, importe o `AGENTS.md` nele para não duplicar conteúdo, como no arquivo abaixo. Atenção: a presença de um `CLAUDE.local.md` também faz o Claude Code deixar de ler o `AGENTS.md` por padrão; o import resolve.',
        antigravity:
          'Nada a fazer: o Antigravity lê o `AGENTS.md` na raiz e em subdiretórios, além das regras em `.agents/rules/`. Arquivos de regra acima de ~24 KB são truncados.',
        generico:
          'Verifique na documentação se a ferramenta lê `AGENTS.md`. Se não ler, crie o arquivo que ela espera contendo só uma referência ao `AGENTS.md`, ou um link simbólico para ele.',
      },
      blocos: [
        {
          tipo: 'arquivo',
          ferramentas: ['claude-code'],
          arquivo: 'CLAUDE.md',
          linguagem: 'markdown',
          conteudo: '@AGENTS.md\n\n## Específico do Claude Code\n- (instruções que só valem para o Claude Code)\n',
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
      id: 'permissoes',
      titulo: 'Configure permissões seguras',
      resumo:
        'O agente roda comandos e edita arquivos **com as suas permissões**. Comece pelo mínimo: liberar o que é seguro e repetitivo, pedir confirmação para o resto e negar o destrutivo. Ajuste as opções abaixo e copie o resultado.',
      instrucoes: {
        opencode:
          'Salve como `opencode.json` na raiz do projeto (ou mescle com o existente) e versione, para o time inteiro partir da mesma base.',
        'claude-code':
          'Salve em `.claude/settings.json` e versione. Ajustes pessoais vão em `.claude/settings.local.json`, fora do git.',
        cline: 'O Cline controla permissões por categoria, em **Settings → Auto Approve**. Ajuste conforme a lista abaixo.',
        antigravity: 'Ajuste nas configurações do Antigravity conforme a lista abaixo.',
        generico: 'Use a lista abaixo como referência e traduza para a configuração da sua ferramenta.',
      },
      regras: ['R3'],
      blocos: [{tipo: 'gerador', gerador: 'permissoes'}],
      porque: {
        texto:
          'Aprovar tudo manualmente cansa e, depois da décima confirmação, ninguém mais lê. A saída não é liberar tudo: é liberar o seguro e manter a confirmação para o que importa. Autonomia total só em contêiner ou VM.',
        artigo: 'permissoes',
      },
      fontes: [
        {titulo: 'OpenCode — Permissions', url: 'https://opencode.ai/docs/permissions/'},
        {titulo: 'Cline — Auto Approve', url: 'https://docs.cline.bot/features/auto-approve'},
        {titulo: 'Claude Code — Permissions', url: 'https://code.claude.com/docs/en/permissions'},
        {titulo: 'Antigravity — Settings', url: 'https://antigravity.google/docs/settings?tab=ide'},
      ],
    },
    {
      id: 'segredos',
      titulo: 'Proteja segredos',
      resumo:
        'Tudo o que o agente lê vai para o contexto do modelo e pode sair da sua máquina. Mantenha credenciais fora do alcance dele.',
      instrucoes: {
        opencode:
          'O bloqueio de leitura de `.env`, `secrets/` e chaves já está na configuração do passo anterior. Você confere no passo de validação.',
        'claude-code':
          'O bloqueio de leitura de `.env`, `secrets/` e chaves já está na configuração do passo anterior (regras `Read` em `deny`). Um `.claudeignore` não tem efeito. Você confere no passo de validação.',
        cline:
          'O `.clineignore` **não** é uma barreira de segurança: arquivos ignorados ainda podem ser lidos por menção `@` ou por comandos. Mantenha "Execute all commands" desligado e, para bloquear de fato, use o hook `PreToolUse` descrito na [documentação do Cline](https://docs.cline.bot/customization/clineignore).',
        antigravity:
          'Em projetos sensíveis, ative o **strict mode**: o agente passa a respeitar o `.gitignore` (onde os `.env` normalmente estão) e perde acesso fora do workspace. Mantenha os comandos em "Request Review".',
        generico:
          'Configure a ferramenta para negar a leitura de `.env`, `.env.*`, `secrets/` e chaves (`*.pem`, `*.key`). Arquivos de "ignore" costumam só evitar o carregamento automático; prefira regras que bloqueiem de fato.',
      },
      regras: ['R2'],
      blocos: [
        {
          tipo: 'lista',
          titulo: 'Confira',
          itens: [
            '`.env` e arquivos de credenciais estão no `.gitignore`.',
            'Existe um `.env.example` sem valores reais, para o agente saber quais variáveis existem.',
            'O terminal onde o agente roda não tem credenciais de produção em variáveis de ambiente.',
            'As credenciais de desenvolvimento têm escopo mínimo e validade curta.',
          ],
        },
        {
          tipo: 'aviso',
          nivel: 'danger',
          titulo: 'Vazou? Troque.',
          texto:
            'Se uma credencial apareceu num prompt, numa saída lida pelo agente, num commit ou numa memória, considere-a comprometida: revogue e gere outra. Apagar o texto não desfaz o envio.',
        },
      ],
      porque: {
        texto:
          'Além do envio ao provedor, segredos podem ficar em logs e históricos de sessão e reaparecer em código gerado. Um agente vulnerável a prompt injection pode ser induzido a enviar o que leu para fora.',
        artigo: 'segredos',
      },
    },
    {
      id: 'dados-originais',
      titulo: 'Proteja os dados originais',
      quando: (r) => r.projeto === 'dados',
      resumo:
        'Em análise de dados, os maiores riscos são o agente alterar dados brutos e "ajustar" resultados para que pareçam bons.',
      blocos: [
        {
          tipo: 'lista',
          titulo: 'Confira',
          itens: [
            'Os dados brutos são somente leitura: diretório protegido ou permissão negada.',
            'O agente trabalha em cópias ou amostras, nunca em bases de produção.',
            'Dados pessoais ou de parceiros não entram no contexto: use dados sintéticos ou anonimizados.',
            'O agente mostra o código de cada transformação, e você confere os resultados em amostras conhecidas.',
            'Seeds e versões dos dados ficam registradas.',
          ],
        },
      ],
      porque: {
        texto:
          'Um agente que "faz o teste passar" pode fazer a métrica melhorar pelo motivo errado. Resultado só vale com código revisável e dados rastreáveis.',
        artigo: 'principios',
      },
    },
    {
      id: 'producao',
      titulo: 'Separe o agente da produção',
      quando: (r) => r.projeto === 'infra',
      resumo:
        'Em infraestrutura, um comando errado pode apagar dados ou derrubar serviços. O agente escreve e planeja; quem aplica é uma pessoa.',
      regras: ['R4'],
      blocos: [
        {
          tipo: 'lista',
          titulo: 'Confira',
          itens: [
            'O agente não tem credenciais de produção na sessão.',
            'Mudanças de IaC passam por `plan` ou `--dry-run`, e o apply é feito por uma pessoa ou pelo CI com revisão.',
            'Comandos destrutivos estão negados nas permissões do passo anterior.',
            'Para diagnóstico, o acesso é somente leitura.',
            'Existe backup testado, e há commits antes de cada etapa.',
          ],
        },
      ],
      porque: {
        texto:
          'Checkpoints de agentes costumam desfazer só edições de arquivo, não efeitos de comandos. Uma regra `deny` funciona mesmo quando o modelo "decide" executar.',
        artigo: 'producao-e-infra',
      },
    },
    {
      id: 'validar',
      titulo: 'Valide a configuração',
      resumo:
        'Abra uma **sessão nova** e confirme que o agente carregou as instruções e respeita as permissões. Antes, crie um arquivo falso `.env.teste` com o conteúdo `TESTE=1`. **Nunca faça este teste com o `.env` real.**',
      instrucoes: {
        opencode:
          'Se o `AGENTS.md` não foi carregado, confira se a sessão foi aberta dentro da pasta do projeto: o OpenCode procura o arquivo subindo a partir do diretório atual.',
        cline: 'Confira também o painel de regras e as opções de Auto Approve.',
        'claude-code': 'Use também `/context` para ver os arquivos de instrução carregados e `/permissions` para revisar as regras.',
        antigravity: 'Confira também as regras carregadas e as políticas de execução nas configurações.',
        generico: 'Se a ferramenta tiver um comando para inspecionar o contexto, use-o também.',
      },
      blocos: [
        {
          tipo: 'prompt',
          titulo: 'Validar a configuração',
          texto:
            'Sem alterar nenhum arquivo:\n1. Liste as instruções de projeto e regras que você carregou nesta sessão, com o arquivo de origem de cada uma.\n2. Diga quais comandos você pode rodar sem pedir minha confirmação.\n3. Tente ler o arquivo .env.teste e me diga se conseguiu.',
        },
        {
          tipo: 'aviso',
          nivel: 'tip',
          titulo: 'Resultado esperado',
          texto:
            'O agente cita o `AGENTS.md`, descreve permissões coerentes com o passo 4 e **não** consegue ler o `.env.teste` (ou pede sua confirmação, que você nega). Depois, apague o `.env.teste`.',
        },
      ],
    },
  ],
  proximos: [
    {titulo: 'Estender meu agente', descricao: 'Adicione uma skill, conecte um MCP ou crie uma regra.', para: '/estender'},
    {
      titulo: 'Trabalhar bem com o agente',
      descricao: 'O ciclo explorar → planejar → implementar → verificar.',
      para: '/aprofundar/ciclo-de-trabalho',
    },
    {titulo: 'Regras do laboratório', descricao: 'As 7 regras de uso de agentes no ATLab.', para: '/regras'},
  ],
};
