// Gerador determinístico de AGENTS.md a partir de um formulário.

export type TipoProjeto = 'software' | 'dados' | 'infra';

export interface DadosAgentsMd {
  nome: string;
  descricao: string;
  comandos: {
    instalar: string;
    testar: string;
    testeUnico: string;
    lint: string;
    build: string;
  };
  /** Campos de texto livre: uma instrução por linha. */
  convencoes: string;
  arquitetura: string;
  naoMexer: string;
  git: string;
  declararAgente: boolean;
}

/** Valores de exemplo por tipo de projeto, usados como ponto de partida. */
export function exemploAgentsMd(tipo: TipoProjeto): DadosAgentsMd {
  const base = {
    nome: '',
    descricao: '',
    git: 'Branches: feat/…, fix/…\nCommits no padrão Conventional Commits',
    declararAgente: true,
  };
  if (tipo === 'dados') {
    return {
      ...base,
      comandos: {
        instalar: 'uv sync',
        testar: 'uv run pytest -q',
        testeUnico: 'uv run pytest tests/test_x.py -q',
        lint: 'uv run ruff check --fix && uv run ruff format',
        build: '',
      },
      convencoes:
        'Transformações reutilizáveis ficam em src/, não em notebooks\nFixe seeds e registre a versão dos dados em cada experimento\nNunca altere dados em data/raw/; gere saídas em data/processed/',
      arquitetura: 'notebooks/ para exploração; src/ para código versionado e testado',
      naoMexer: 'data/raw/ (dados originais, somente leitura)',
    };
  }
  if (tipo === 'infra') {
    return {
      ...base,
      comandos: {
        instalar: '',
        testar: 'terraform validate',
        testeUnico: '',
        lint: 'terraform fmt -recursive',
        build: 'terraform plan',
      },
      convencoes:
        'Toda mudança passa por terraform plan; o apply é feito por uma pessoa ou pelo CI\nNunca use credenciais de produção na sessão do agente',
      arquitetura: 'modules/ para módulos reutilizáveis; envs/<ambiente>/ para cada ambiente',
      naoMexer: 'envs/prod/ sem revisão humana\nArquivos de estado (*.tfstate)',
    };
  }
  return {
    ...base,
    comandos: {
      instalar: 'npm ci',
      testar: 'npm test',
      testeUnico: 'npm test -- caminho/do/arquivo.test.ts',
      lint: 'npm run lint',
      build: 'npm run build',
    },
    convencoes: 'TypeScript estrito; sem any\nComponentes em PascalCase, funções em camelCase',
    arquitetura: 'src/api/ só valida e delega; regras de negócio ficam em src/services/',
    naoMexer: 'Código gerado em src/generated/\nMigrações já aplicadas: crie uma nova',
  };
}

function linhas(texto: string): string[] {
  return texto
    .split('\n')
    .map((l) => l.trim().replace(/^[-*]\s+/, ''))
    .filter(Boolean);
}

function secao(titulo: string, itens: string[]): string {
  return itens.length ? `## ${titulo}\n${itens.map((i) => `- ${i}`).join('\n')}\n` : '';
}

export function gerarAgentsMd(d: DadosAgentsMd): string {
  const c = d.comandos;
  const comandos = [
    c.instalar && `Instalar: \`${c.instalar}\``,
    c.testar && `Testes: \`${c.testar}\``,
    c.testeUnico && `Um teste só: \`${c.testeUnico}\``,
    c.lint && `Lint/formatação: \`${c.lint}\``,
    c.build && `Build: \`${c.build}\``,
  ].filter((x): x is string => Boolean(x));

  const git = linhas(d.git);
  if (d.declararAgente) git.push('Declare o uso de agente de IA no commit (Co-Authored-By) ou no PR');

  const partes = [
    `# ${d.nome.trim() || 'Nome do projeto'}\n`,
    d.descricao.trim() ? `${d.descricao.trim()}\n` : '',
    secao('Comandos', comandos),
    secao('Convenções', linhas(d.convencoes)),
    secao('Arquitetura', linhas(d.arquitetura)),
    secao('Não mexer', linhas(d.naoMexer)),
    secao('Git', git),
  ];
  return partes.filter(Boolean).join('\n').trimEnd() + '\n';
}
