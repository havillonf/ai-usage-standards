import type {MDXContent} from 'mdx/types';
import metadados from 'virtual:artigos';

// Artigos de "Aprofundar": cada arquivo em src/content/artigos/<slug>.mdx vira
// /aprofundar/<slug>. O componente é carregado sob demanda; título, descrição
// e texto puro (para a busca) vêm do módulo virtual gerado no build
// (config/artigos-plugin.ts).

interface ModuloArtigo {
  default: MDXContent;
}

const modulos = import.meta.glob<ModuloArtigo>('./artigos/*.mdx');

export interface Artigo {
  slug: string;
  titulo: string;
  descricao: string;
  /** Texto sem marcação, para a busca. */
  texto: string;
  carregar: () => Promise<ModuloArtigo>;
}

export const CATEGORIAS: {titulo: string; artigos: string[]}[] = [
  {titulo: 'Fundamentos e fluxo de trabalho', artigos: ['principios', 'ciclo-de-trabalho', 'gestao-de-contexto', 'antipadroes']},
  {titulo: 'Instruções, memória e extensões', artigos: ['agents-md', 'memoria', 'quando-usar-o-que']},
  {
    titulo: 'Segurança',
    artigos: ['permissoes', 'segredos', 'prompt-injection', 'cadeia-de-suprimentos', 'producao-e-infra', 'dados'],
  },
  {titulo: 'Sobre o guia', artigos: ['sobre-o-guia', 'historico', 'contribuir', 'bibliografia']},
];

export const ARTIGOS: Record<string, Artigo> = Object.fromEntries(
  Object.entries(metadados).map(([slug, m]) => [
    slug,
    {slug, ...m, carregar: modulos[`./artigos/${slug}.mdx`]},
  ]),
);
