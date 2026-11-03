import MiniSearch from 'minisearch';
import {ARTIGOS} from '@/content/artigos';
import {ROTEIROS} from '@/content/roteiros';
import {resolver} from '@/content/tipos';

export interface Documento {
  id: string;
  titulo: string;
  tipo: 'Roteiro' | 'Artigo' | 'Ferramenta' | 'Página';
  contexto: string;
  texto: string;
  para: string;
}

function documentos(): Documento[] {
  const docs: Documento[] = [];
  for (const r of ROTEIROS) {
    docs.push({id: r.id, titulo: r.titulo, tipo: 'Roteiro', contexto: r.descricao, texto: r.descricao, para: r.caminho});
    for (const p of r.passos) {
      docs.push({
        id: `${r.id}/${p.id}`,
        titulo: p.titulo,
        tipo: 'Roteiro',
        contexto: r.titulo,
        texto: [resolver(p.resumo, {}), p.porque?.texto ?? ''].join(' '),
        para: r.caminho,
      });
    }
  }
  for (const a of Object.values(ARTIGOS)) {
    docs.push({id: `artigo/${a.slug}`, titulo: a.titulo, tipo: 'Artigo', contexto: a.descricao, texto: a.texto, para: `/aprofundar/${a.slug}`});
  }
  docs.push(
    {
      id: 'pagina/regras',
      titulo: 'Regras obrigatórias',
      tipo: 'Página',
      contexto: 'As 7 regras de uso de agentes no ATLab',
      texto: 'regras obrigatórias deve não deve proposta coordenação segredos permissões produção revisão',
      para: '/regras',
    },
    {
      id: 'pagina/ferramentas',
      titulo: 'Comparar ferramentas',
      tipo: 'Ferramenta',
      contexto: 'Matriz de compatibilidade com filtros',
      texto: 'comparar ferramentas matriz compatibilidade opencode cline claude code antigravity suporte',
      para: '/ferramentas',
    },
    {
      id: 'pagina/gerador-agents-md',
      titulo: 'Gerador de AGENTS.md',
      tipo: 'Ferramenta',
      contexto: 'Monte o AGENTS.md do projeto com prévia ao vivo',
      texto: 'gerador agents.md instruções de projeto formulário',
      para: '/ferramentas/agents-md',
    },
    {
      id: 'pagina/gerador-permissoes',
      titulo: 'Gerador de permissões',
      tipo: 'Ferramenta',
      contexto: 'Configuração segura de permissões por ferramenta',
      texto: 'gerador permissões allow ask deny opencode.json settings.json auto approve segurança',
      para: '/ferramentas/permissoes',
    },
  );
  return docs;
}

let indice: MiniSearch<Documento> | null = null;

/** Busca nos roteiros, artigos e ferramentas. O índice é montado na primeira busca. */
export function buscar(consulta: string): Documento[] {
  if (!indice) {
    indice = new MiniSearch<Documento>({
      fields: ['titulo', 'contexto', 'texto'],
      storeFields: ['titulo', 'tipo', 'contexto', 'para'],
      searchOptions: {boost: {titulo: 3, contexto: 1.5}, prefix: true, fuzzy: 0.2, combineWith: 'AND'},
      processTerm: (t) => t.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase(),
    });
    indice.addAll(documentos());
  }
  return indice.search(consulta).slice(0, 12) as unknown as Documento[];
}
