// Módulo virtual `virtual:artigos`: metadados (frontmatter) e texto puro de cada
// artigo em src/content/artigos/*.mdx, lidos em Node no build. Usado na lista
// de "Aprofundar" e na busca, sem precisar carregar os componentes MDX.
import {readdirSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import type {Plugin} from 'vite';

const ID = 'virtual:artigos';
const ID_RESOLVIDO = '\0' + ID;

export function lerFrontmatter(bruto: string): Record<string, string> {
  const bloco = bruto.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  return Object.fromEntries(
    bloco
      .split('\n')
      .map((l) => l.match(/^(\w+):\s*(.*)$/))
      .filter((m): m is RegExpMatchArray => Boolean(m))
      .map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]),
  );
}

export function textoPuro(bruto: string): string {
  return bruto
    .replace(/^---\n[\s\S]*?\n---/, '')
    .replace(/<\/?[A-Z][^>]*>/g, ' ')
    .replace(/^:::.*$/gm, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_>#|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function artigosPlugin(dir: string): Plugin {
  return {
    name: 'artigos',
    resolveId(id) {
      return id === ID ? ID_RESOLVIDO : undefined;
    },
    load(id) {
      if (id !== ID_RESOLVIDO) return;
      const dados: Record<string, {titulo: string; descricao: string; texto: string}> = {};
      for (const arquivo of readdirSync(dir).filter((f) => f.endsWith('.mdx')).sort()) {
        const caminho = resolve(dir, arquivo);
        this.addWatchFile(caminho);
        const bruto = readFileSync(caminho, 'utf8');
        const fm = lerFrontmatter(bruto);
        const slug = arquivo.replace(/\.mdx$/, '');
        dados[slug] = {titulo: fm.title ?? slug, descricao: fm.description ?? '', texto: textoPuro(bruto)};
      }
      return `export default ${JSON.stringify(dados)};`;
    },
  };
}
