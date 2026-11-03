// Ferramentas de referência usadas nas abas "Na prática" e na matriz.
// A ordem aqui é a ordem em que aparecem no site.

export type FerramentaId = 'opencode' | 'cline' | 'claude-code' | 'antigravity';

export interface Ferramenta {
  id: FerramentaId;
  nome: string;
  formato: string;
  licenca: string;
  site: string;
  docs: string;
}

export const FERRAMENTAS: Ferramenta[] = [
  {
    id: 'opencode',
    nome: 'OpenCode',
    formato: 'CLI (TUI)',
    licenca: 'Open source',
    site: 'https://opencode.ai/',
    docs: 'https://opencode.ai/docs/',
  },
  {
    id: 'cline',
    nome: 'Cline',
    formato: 'Extensão de IDE e CLI',
    licenca: 'Open source',
    site: 'https://cline.bot/',
    docs: 'https://docs.cline.bot/',
  },
  {
    id: 'claude-code',
    nome: 'Claude Code',
    formato: 'CLI, extensões de IDE, desktop e web',
    licenca: 'Proprietária',
    site: 'https://claude.com/product/claude-code',
    docs: 'https://code.claude.com/docs/',
  },
  {
    id: 'antigravity',
    nome: 'Antigravity',
    formato: 'IDE, app e CLI',
    licenca: 'Proprietária',
    site: 'https://antigravity.google/',
    docs: 'https://antigravity.google/docs/',
  },
];

export const NOME_FERRAMENTA: Record<FerramentaId, string> = Object.fromEntries(
  FERRAMENTAS.map((f) => [f.id, f.nome]),
) as Record<FerramentaId, string>;
