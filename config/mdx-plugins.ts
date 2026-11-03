// Plugins remark usados na compilação dos artigos (src/content/artigos/*.mdx).
import type {Code, Paragraph, Parent, Root, RootContent, Text} from 'mdast';
import type {ContainerDirective, LeafDirective, TextDirective} from 'mdast-util-directive';
import {visit} from 'unist-util-visit';

const TIPOS_CALLOUT = new Set(['tip', 'info', 'note', 'warning', 'danger']);

function textoDe(no: RootContent): string {
  if ('value' in no && typeof no.value === 'string') return no.value;
  if ('children' in no) return (no.children as RootContent[]).map(textoDe).join('');
  return '';
}

/**
 * Converte caixas `:::tip[Título] … :::` em <aside class="callout callout-tip">.
 * Diretivas não reconhecidas voltam a ser texto, para que um ":" no meio de uma
 * frase nunca suma do conteúdo.
 */
export function remarkCallouts() {
  return (tree: Root) => {
    visit(tree, (no, indice, pai: Parent | undefined) => {
      if (no.type === 'containerDirective') {
        const dir = no as ContainerDirective;
        if (!TIPOS_CALLOUT.has(dir.name)) return;
        let titulo: string | undefined;
        const primeiro = dir.children[0] as Paragraph | undefined;
        if (primeiro?.type === 'paragraph' && primeiro.data && 'directiveLabel' in primeiro.data) {
          titulo = textoDe(primeiro);
          dir.children.shift();
        }
        dir.data = {
          hName: 'aside',
          hProperties: {className: ['callout', `callout-${dir.name}`], dataTitulo: titulo ?? ''},
        };
        return;
      }
      if ((no.type === 'textDirective' || no.type === 'leafDirective') && pai && indice !== undefined) {
        const dir = no as TextDirective | LeafDirective;
        const texto: Text = {type: 'text', value: `:${dir.name}${textoDe(dir)}`};
        pai.children.splice(indice, 1, texto);
      }
    });
  };
}

/**
 * Blocos de código:
 * - ```mermaid vira <Mermaid codigo="…"/> (renderizado no cliente, sob demanda);
 * - o meta title="…" vira o atributo data-titulo do <code>.
 */
export function remarkCodigo() {
  return (tree: Root) => {
    visit(tree, 'code', (no: Code, indice, pai: Parent | undefined) => {
      if (no.lang === 'mermaid' && pai && indice !== undefined) {
        pai.children.splice(indice, 1, {
          type: 'mdxJsxFlowElement',
          name: 'Mermaid',
          attributes: [{type: 'mdxJsxAttribute', name: 'codigo', value: no.value}],
          children: [],
        } as unknown as RootContent);
        return;
      }
      const titulo = no.meta?.match(/title="([^"]+)"/)?.[1];
      if (titulo) {
        no.data = {...no.data, hProperties: {dataTitulo: titulo}};
      }
    });
  };
}
