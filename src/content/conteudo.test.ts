import {readdirSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import GithubSlugger from 'github-slugger';
import {describe, expect, it} from 'vitest';
import {REGRAS_POR_ID} from '@/data/regras';
import {MATRIZ} from '@/data/compatibilidade';
import {FERRAMENTAS} from '@/data/ferramentas';
import {ARTIGOS, CATEGORIAS} from './artigos';
import {ROTEIROS} from './roteiros';
import {passosAplicaveis, resolver, type Respostas, type Roteiro} from './tipos';

// Verificações de integridade do conteúdo: links internos, âncoras, regras,
// artigos e exemplos de configuração.

const DIR_ARTIGOS = resolve(process.cwd(), 'src/content/artigos');
const brutos = Object.fromEntries(
  readdirSync(DIR_ARTIGOS)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => [f.replace('.mdx', ''), readFileSync(resolve(DIR_ARTIGOS, f), 'utf8')]),
);

const ROTAS_FIXAS = new Set(['/', '/estender', '/estender/nao-sei', '/ferramentas', '/ferramentas/agents-md', '/ferramentas/permissoes', '/regras', '/aprofundar']);
for (const r of ROTEIROS) {
  ROTAS_FIXAS.add(r.caminho);
  ROTAS_FIXAS.add(`${r.caminho}/roteiro`);
}
for (const slug of Object.keys(ARTIGOS)) ROTAS_FIXAS.add(`/aprofundar/${slug}`);

function ancorasDe(slug: string): Set<string> {
  const slugger = new GithubSlugger();
  const titulos = [...brutos[slug].replace(/```[\s\S]*?```/g, '').matchAll(/^#{2,6}\s+(.+)$/gm)];
  return new Set(titulos.map((m) => slugger.slug(m[1].trim())));
}

function verificarLink(href: string, origem: string): void {
  if (!href.startsWith('/')) return;
  const [caminho, ancora] = href.split('#');
  expect(ROTAS_FIXAS.has(caminho), `${origem}: rota inexistente ${href}`).toBe(true);
  if (ancora && caminho.startsWith('/aprofundar/')) {
    const slug = caminho.replace('/aprofundar/', '');
    expect(ancorasDe(slug).has(decodeURIComponent(ancora)), `${origem}: âncora inexistente ${href}`).toBe(true);
  }
}

function linksMarkdown(texto: string): string[] {
  return [...texto.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]);
}

/** Todas as combinações de respostas de um roteiro. */
function combinacoes(roteiro: Roteiro): Respostas[] {
  return roteiro.perguntas.reduce<Respostas[]>(
    (acc, p) => acc.flatMap((r) => p.opcoes.map((o) => ({...r, [p.id]: o.valor}))),
    [{}],
  );
}

describe('artigos', () => {
  it('todo artigo tem título e descrição e está numa categoria', () => {
    const categorizados = new Set(CATEGORIAS.flatMap((c) => c.artigos));
    for (const a of Object.values(ARTIGOS)) {
      expect(a.titulo, a.slug).not.toBe(a.slug);
      expect(a.descricao, a.slug).not.toBe('');
      expect(categorizados.has(a.slug), `${a.slug} sem categoria`).toBe(true);
    }
    for (const s of categorizados) expect(ARTIGOS[s], `categoria cita artigo inexistente: ${s}`).toBeDefined();
  });

  it('links internos dos artigos apontam para rotas e âncoras existentes', () => {
    for (const [slug, bruto] of Object.entries(brutos)) {
      for (const href of linksMarkdown(bruto)) {
        if (href.startsWith('#')) {
          expect(ancorasDe(slug).has(decodeURIComponent(href.slice(1))), `${slug}: âncora ${href}`).toBe(true);
        } else {
          verificarLink(href, slug);
        }
      }
    }
  });

  it('artigos só usam regras e abas de ferramenta conhecidas', () => {
    const ids = new Set(FERRAMENTAS.map((f) => f.id));
    for (const [slug, bruto] of Object.entries(brutos)) {
      for (const m of bruto.matchAll(/<Regra id="(\w+)"/g)) expect(REGRAS_POR_ID[m[1]], `${slug}: ${m[1]}`).toBeDefined();
      for (const m of bruto.matchAll(/<TabItem value="([\w-]+)"/g)) expect(ids.has(m[1] as never), `${slug}: ${m[1]}`).toBe(true);
    }
  });
});

describe('roteiros', () => {
  it('ids de roteiros e passos são únicos', () => {
    expect(new Set(ROTEIROS.map((r) => r.id)).size).toBe(ROTEIROS.length);
    for (const r of ROTEIROS) expect(new Set(r.passos.map((p) => p.id)).size, r.id).toBe(r.passos.length);
  });

  for (const roteiro of ROTEIROS) {
    it(`${roteiro.id}: toda combinação de respostas gera um roteiro válido`, () => {
      for (const respostas of combinacoes(roteiro)) {
        const passos = passosAplicaveis(roteiro, respostas);
        expect(passos.length, JSON.stringify(respostas)).toBeGreaterThan(2);
        for (const p of passos) {
          const textos = [
            resolver(p.resumo, respostas),
            ...(p.instrucoes ? Object.values(p.instrucoes).map((t) => resolver(t!, respostas)) : []),
            ...(p.blocos ?? []).flatMap((b) =>
              b.tipo === 'prompt'
                ? [resolver(b.texto, respostas)]
                : b.tipo === 'aviso'
                  ? [resolver(b.texto, respostas)]
                  : b.tipo === 'lista'
                    ? b.itens
                    : [],
            ),
            p.porque?.texto ?? '',
          ];
          for (const t of textos) {
            expect(t, `${roteiro.id}/${p.id}`).not.toMatch(/undefined|\[object Object\]/);
            for (const href of linksMarkdown(t)) verificarLink(href, `${roteiro.id}/${p.id}`);
          }
        }
      }
    });
  }

  it('regras, artigos e próximos passos citados existem', () => {
    for (const r of ROTEIROS) {
      for (const p of r.passos) {
        for (const id of p.regras ?? []) expect(REGRAS_POR_ID[id], `${r.id}/${p.id}: ${id}`).toBeDefined();
        if (p.porque?.artigo) verificarLink(`/aprofundar/${p.porque.artigo}`, `${r.id}/${p.id}`);
      }
      for (const prox of r.proximos ?? []) verificarLink(prox.para, r.id);
    }
  });

  it('exemplos JSON dos roteiros são JSON válido', () => {
    for (const r of ROTEIROS) {
      for (const p of r.passos) {
        for (const b of p.blocos ?? []) {
          if ((b.tipo === 'arquivo' || b.tipo === 'codigo') && b.linguagem === 'json') {
            expect(() => JSON.parse(resolver(b.conteudo, {})), `${r.id}/${p.id}`).not.toThrow();
          }
        }
      }
    }
  });
});

describe('dados', () => {
  it('toda célula da matriz tem fonte ou está marcada para verificação', () => {
    for (const recurso of MATRIZ) {
      for (const f of FERRAMENTAS) {
        const c = recurso.celulas[f.id];
        expect(c.suporte === 'verificar' || Boolean(c.fonte), `${recurso.id}/${f.id}`).toBe(true);
      }
    }
  });

  it('regras apontam para artigos existentes', () => {
    for (const r of Object.values(REGRAS_POR_ID)) verificarLink(r.detalhes, r.id);
  });
});
