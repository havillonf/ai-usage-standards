import {resolver, rotuloResposta, type Passo, type Respostas, type Roteiro} from '@/content/tipos';

/** Checklist do roteiro em Markdown, para colar numa issue ou PR. */
export function exportarChecklist(
  roteiro: Roteiro,
  respostas: Respostas,
  passos: Passo[],
  feitos: ReadonlySet<string>,
  url: string,
): string {
  const contexto = roteiro.perguntas
    .filter((p) => respostas[p.id])
    .map((p) => rotuloResposta(roteiro, p.id, respostas[p.id]!))
    .join(' · ');
  const concluidos = passos.filter((p) => feitos.has(p.id)).length;
  const itens = passos.map((p, i) => {
    const resumo = resolver(p.resumo, respostas).replace(/\s+/g, ' ').trim();
    return `- [${feitos.has(p.id) ? 'x' : ' '}] **${i + 1}. ${p.titulo}** — ${resumo}`;
  });

  const cabecalho = [`# ${roteiro.titulo}`, ''];
  if (contexto) cabecalho.push(`**Respostas:** ${contexto}  `);
  cabecalho.push(`**Progresso:** ${concluidos} de ${passos.length} passos  `, `**Roteiro:** ${url}`, '');

  return [...cabecalho, ...itens, '', '_Gerado pelo Guia de Agentes de IA do ATLab._', ''].join('\n');
}

export function baixarArquivo(nome: string, conteudo: string, tipo = 'text/markdown'): void {
  const url = URL.createObjectURL(new Blob([conteudo], {type: `${tipo};charset=utf-8`}));
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
