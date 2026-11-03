// Fonte única das regras obrigatórias do ATLab.
// Usada por <Regra id="..."/> nas páginas e por <ListaRegras/> na página de regras.
// Ao aprovar uma regra, mude `status` para 'aprovada' e registre no changelog.

export type Nivel = 'DEVE' | 'NÃO DEVE' | 'DEVERIA';
export type StatusRegra = 'proposta' | 'aprovada';

export interface RegraObrigatoria {
  id: string;
  nivel: Nivel;
  titulo: string;
  texto: string;
  status: StatusRegra;
  // Rota do app com o artigo que detalha a regra.
  detalhes: string;
}

export const REGRAS: RegraObrigatoria[] = [
  {
    id: 'R1',
    nivel: 'DEVE',
    titulo: 'Responsabilidade de quem submete',
    texto:
      'Quem submete código DEVE revisá-lo e é responsável por ele, independentemente de ter sido escrito por uma pessoa ou por um agente.',
    status: 'proposta',
    detalhes: '/aprofundar/principios',
  },
  {
    id: 'R2',
    nivel: 'NÃO DEVE',
    titulo: 'Segredos fora do alcance do agente',
    texto:
      'Segredos e credenciais NÃO DEVEM ser expostos ao agente: nem em prompts, nem em memória, nem em skills, nem em arquivos que ele possa ler.',
    status: 'proposta',
    detalhes: '/aprofundar/segredos',
  },
  {
    id: 'R3',
    nivel: 'DEVE',
    titulo: 'Permissões mínimas',
    texto:
      'Agentes DEVEM rodar com as permissões mínimas necessárias. Auto-aprovação total ("YOLO") só é permitida em ambiente isolado (contêiner ou VM).',
    status: 'proposta',
    detalhes: '/aprofundar/permissoes',
  },
  {
    id: 'R4',
    nivel: 'DEVE',
    titulo: 'Aprovação humana em ações destrutivas',
    texto:
      'Ações em produção e ações destrutivas ou irreversíveis DEVEM ter aprovação humana explícita, uma a uma.',
    status: 'proposta',
    detalhes: '/aprofundar/producao-e-infra',
  },
  {
    id: 'R5',
    nivel: 'DEVE',
    titulo: 'Revisão de skills e MCPs de terceiros',
    texto:
      'Skills e servidores MCP de terceiros DEVEM ser revisados antes do uso e vir de fontes confiáveis.',
    status: 'proposta',
    detalhes: '/aprofundar/cadeia-de-suprimentos',
  },
  {
    id: 'R6',
    nivel: 'DEVE',
    titulo: 'Mesmo padrão de qualidade e transparência',
    texto:
      'Código gerado por agente DEVE passar pelos mesmos testes e pela mesma revisão de qualquer código, e o uso de agente DEVE ser declarado no PR ou no commit.',
    status: 'proposta',
    detalhes: '/aprofundar/principios',
  },
  {
    id: 'R7',
    nivel: 'DEVERIA',
    titulo: 'AGENTS.md nos repositórios ativos',
    texto:
      'Repositórios ativos DEVERIAM ter um AGENTS.md com as instruções de projeto para agentes.',
    status: 'proposta',
    detalhes: '/aprofundar/agents-md',
  },
];

export const REGRAS_POR_ID: Record<string, RegraObrigatoria> =
  Object.fromEntries(REGRAS.map((r) => [r.id, r]));
