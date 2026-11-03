import type {FerramentaId} from '@/data/ferramentas';

// Modelo de conteúdo dos roteiros guiados.
// Textos são Markdown (renderizados com react-markdown). Um texto pode depender
// das respostas da jornada: nesse caso, use uma função (r) => string.

/** Respostas da jornada, lidas da URL (ex.: ?ferramenta=cline&projeto=dados). */
export type Respostas = Readonly<Record<string, string | undefined>>;

export type Texto = string | ((r: Respostas) => string);

/** Ferramenta escolhida na jornada; 'generico' = outra ferramenta ou nenhuma. */
export type Escolha = FerramentaId | 'generico';

/** Variações de um conteúdo por ferramenta. `generico` é obrigatório (fallback). */
export type PorFerramenta<T> = {generico: T} & Partial<Record<FerramentaId, T>>;

export interface Opcao {
  valor: string;
  rotulo: string;
  descricao?: string;
}

export interface Pergunta {
  id: string;
  texto: string;
  ajuda?: string;
  opcoes: Opcao[];
}

export interface Fonte {
  titulo: string;
  url: string;
}

interface BlocoBase {
  /** Mostra o bloco só para estas escolhas de ferramenta. Omitido = todas. */
  ferramentas?: Escolha[];
}

export type Bloco =
  | (BlocoBase & {tipo: 'prompt'; titulo: string; texto: Texto})
  | (BlocoBase & {tipo: 'arquivo'; arquivo: string; linguagem: string; conteudo: Texto})
  | (BlocoBase & {tipo: 'codigo'; titulo: string; linguagem: string; conteudo: Texto})
  | (BlocoBase & {tipo: 'lista'; titulo: string; itens: string[]})
  | (BlocoBase & {tipo: 'aviso'; nivel: 'info' | 'tip' | 'warning' | 'danger'; titulo?: string; texto: Texto})
  | (BlocoBase & {tipo: 'checklist'; checklist: 'auditoria-skill' | 'auditoria-mcp'})
  | (BlocoBase & {tipo: 'gerador'; gerador: 'agents-md' | 'permissoes'})
  | (BlocoBase & {tipo: 'arvore'});

export interface Passo {
  id: string;
  titulo: string;
  /** O que fazer, em 1–2 frases. */
  resumo: Texto;
  /** Instrução concreta por ferramenta. */
  instrucoes?: PorFerramenta<Texto>;
  blocos?: Bloco[];
  /** Ids de regras obrigatórias relacionadas (ver src/data/regras.ts). */
  regras?: string[];
  /** Explicação curta e, opcionalmente, o artigo de "Aprofundar" (slug#âncora). */
  porque?: {texto: string; artigo?: string};
  fontes?: Fonte[];
  /** Condição para o passo aparecer. Omitido = sempre. */
  quando?: (r: Respostas) => boolean;
}

export interface Roteiro {
  id: string;
  /** Rota das perguntas; o roteiro fica em `${caminho}/roteiro`. */
  caminho: string;
  titulo: string;
  descricao: string;
  perguntas: Pergunta[];
  passos: Passo[];
  proximos?: {titulo: string; descricao: string; para: string}[];
}

export function resolver(t: Texto, r: Respostas): string {
  return typeof t === 'function' ? t(r) : t;
}

export function escolhaDe(r: Respostas): Escolha {
  const f = r.ferramenta;
  return f === 'opencode' || f === 'cline' || f === 'claude-code' || f === 'antigravity'
    ? f
    : 'generico';
}

export function daFerramenta<T>(v: PorFerramenta<T>, e: Escolha): T {
  return (e !== 'generico' ? v[e] : undefined) ?? v.generico;
}

export function blocoVisivel(b: Bloco, e: Escolha): boolean {
  return !b.ferramentas || b.ferramentas.includes(e);
}

/** Passos que se aplicam às respostas dadas. */
export function passosAplicaveis(roteiro: Roteiro, r: Respostas): Passo[] {
  return roteiro.passos.filter((p) => !p.quando || p.quando(r));
}

/** Respostas válidas da URL, na ordem das perguntas do roteiro. */
export function lerRespostas(roteiro: Roteiro, params: URLSearchParams): Record<string, string> {
  const r: Record<string, string> = {};
  for (const p of roteiro.perguntas) {
    const v = params.get(p.id);
    if (v && p.opcoes.some((o) => o.valor === v)) r[p.id] = v;
  }
  return r;
}

export function proximaPergunta(roteiro: Roteiro, r: Respostas): Pergunta | undefined {
  return roteiro.perguntas.find((p) => !r[p.id]);
}

export function rotuloResposta(roteiro: Roteiro, perguntaId: string, valor: string): string {
  const p = roteiro.perguntas.find((x) => x.id === perguntaId);
  return p?.opcoes.find((o) => o.valor === valor)?.rotulo ?? valor;
}
