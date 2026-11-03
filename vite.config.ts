/// <reference types="vitest/config" />
import {copyFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import rehypeSlug from 'rehype-slug';
import remarkDirective from 'remark-directive';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import {defineConfig, type Plugin} from 'vite';
import {artigosPlugin} from './config/artigos-plugin.ts';
import {remarkCallouts, remarkCodigo} from './config/mdx-plugins.ts';

// Caminho base do site. GitHub Pages: /ai-usage-standards/.
// Para outro servidor (ex.: laboratório), rode o build com BASE_PATH=/.
const base = process.env.BASE_PATH ?? '/ai-usage-standards/';

// O GitHub Pages não conhece as rotas do app: servir o index.html como 404.html
// faz links diretos (ex.: /configurar/roteiro?…) funcionarem.
function fallback404(): Plugin {
  return {
    name: 'fallback-404',
    apply: 'build',
    writeBundle(options) {
      const dir = options.dir ?? 'dist';
      copyFileSync(resolve(dir, 'index.html'), resolve(dir, '404.html'));
    },
  };
}

export default defineConfig({
  base,
  resolve: {
    alias: {'@': fileURLToPath(new URL('./src', import.meta.url))},
  },
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, {name: 'frontmatter'}],
          remarkGfm,
          remarkDirective,
          remarkCallouts,
          remarkCodigo,
        ],
        rehypePlugins: [rehypeSlug],
      }),
    },
    react({include: /\.(mdx|tsx?)$/}),
    artigosPlugin(fileURLToPath(new URL('./src/content/artigos', import.meta.url))),
    fallback404(),
  ],
  build: {
    // O maior pedaço é o Mermaid, baixado só nos artigos com diagrama.
    chunkSizeWarningLimit: 1600,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: {modules: {classNameStrategy: 'non-scoped'}},
  },
});
