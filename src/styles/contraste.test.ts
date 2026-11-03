import {readdirSync, readFileSync, statSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

// Protege a identidade visual: os pares texto/fundo do tema claro precisam
// passar no contraste AA (WCAG 2.x), e os componentes não podem usar cores
// fixas (todas saem de tokens.css).

const RAIZ = resolve(process.cwd(), 'src');
const tokensCss = readFileSync(resolve(RAIZ, 'styles/tokens.css'), 'utf8');

function lerTokens(css: string): Map<string, string> {
  const bloco = /:root\s*\{([^}]*)\}/.exec(css);
  if (!bloco) throw new Error('Bloco :root não encontrado em tokens.css');
  const tokens = new Map<string, string>();
  for (const [, nome, valor] of bloco[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    tokens.set(nome, valor.trim());
  }
  return tokens;
}

const TOKENS = lerTokens(tokensCss);

function resolverCor(nome: string): string {
  let valor = TOKENS.get(nome);
  for (let i = 0; valor && i < 10; i++) {
    const ref = /^var\((--[\w-]+)\)$/.exec(valor);
    if (!ref) break;
    valor = TOKENS.get(ref[1]);
  }
  if (!valor || !/^#[0-9a-f]{6}$/i.test(valor)) {
    throw new Error(`${nome} não resolve para uma cor #rrggbb (valor: ${valor})`);
  }
  return valor;
}

function luminancia(hex: string): number {
  const canais = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = canais.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a: string, b: string): number {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

// [texto, fundo, mínimo]. 4,5 para texto comum; 3 para elementos gráficos.
const PARES: [string, string, number][] = [
  ['--cor-texto', '--cor-fundo', 4.5],
  ['--cor-texto', '--cor-superficie', 4.5],
  ['--cor-texto-suave', '--cor-fundo', 4.5],
  ['--cor-texto-suave', '--cor-superficie', 4.5],
  ['--cor-primaria', '--cor-fundo', 4.5],
  ['--cor-primaria', '--cor-superficie', 4.5],
  ['--cor-primaria', '--cor-primaria-suave', 4.5],
  ['--cor-primaria-forte', '--cor-fundo', 4.5],
  ['--cor-primaria-forte', '--cor-primaria-suave', 4.5],
  ['--cor-sobre-primaria', '--cor-primaria', 4.5],
  ['--cor-sobre-primaria', '--cor-primaria-forte', 4.5],
  ['--cor-sobre-primaria', '--cor-regra', 4.5],
  ['--cor-sobre-primaria', '--cor-recomendacao', 4.5],
  ['--cor-texto', '--cor-codigo-fundo', 4.5],
  ['--cor-texto', '--cor-aviso-suave', 4.5],
  ['--cor-texto', '--cor-sucesso-suave', 4.5],
  ['--cor-texto', '--cor-perigo-suave', 4.5],
  ['--cor-texto', '--cor-info-suave', 4.5],
  ['--cor-regra', '--cor-fundo', 4.5],
  ['--cor-proposta', '--cor-fundo', 4.5],
  ['--cor-aprovada', '--cor-fundo', 4.5],
  ['--cor-rodape-texto', '--cor-rodape-fundo', 4.5],
  ['--cor-rodape-link', '--cor-rodape-fundo', 4.5],
  ['--cor-destaque', '--cor-fundo', 3],
];

describe('contraste do tema claro', () => {
  it.each(PARES)('%s sobre %s', (texto, fundo, minimo) => {
    const razao = contraste(resolverCor(texto), resolverCor(fundo));
    expect(razao, `${razao.toFixed(2)}:1`).toBeGreaterThanOrEqual(minimo);
  });
});

describe('cores só nos tokens', () => {
  function arquivosCss(dir: string): string[] {
    return readdirSync(dir).flatMap((nome) => {
      const caminho = join(dir, nome);
      if (statSync(caminho).isDirectory()) return arquivosCss(caminho);
      return nome.endsWith('.css') && !caminho.endsWith('tokens.css') ? [caminho] : [];
    });
  }

  it.each(arquivosCss(RAIZ).map((c) => [c.slice(RAIZ.length + 1), c]))('%s', (_, caminho) => {
    const css = readFileSync(caminho, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const fixas = css.match(/#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(/gi) ?? [];
    expect(fixas).toEqual([]);
  });
});
