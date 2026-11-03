import type {Pergunta} from './tipos';

// Perguntas reutilizadas por mais de um roteiro.

export const PERGUNTA_FERRAMENTA: Pergunta = {
  id: 'ferramenta',
  texto: 'Qual agente você usa?',
  ajuda: 'O roteiro mostra só as instruções da ferramenta escolhida.',
  opcoes: [
    {valor: 'opencode', rotulo: 'OpenCode', descricao: 'CLI open source, vários provedores de modelo'},
    {valor: 'cline', rotulo: 'Cline', descricao: 'Extensão de IDE open source, vários provedores'},
    {valor: 'claude-code', rotulo: 'Claude Code', descricao: 'CLI, IDE, desktop e web, da Anthropic'},
    {valor: 'antigravity', rotulo: 'Antigravity', descricao: 'IDE, app e CLI com agentes, do Google'},
    {
      valor: 'generico',
      rotulo: 'Outro / ainda não uso',
      descricao: 'Instruções genéricas, baseadas em padrões abertos',
    },
  ],
};

export const PERGUNTA_PROJETO: Pergunta = {
  id: 'projeto',
  texto: 'Que tipo de projeto?',
  ajuda: 'Muda o modelo de AGENTS.md e as permissões sugeridas.',
  opcoes: [
    {valor: 'software', rotulo: 'Desenvolvimento de software', descricao: 'Aplicações, APIs, bibliotecas, front-end'},
    {valor: 'dados', rotulo: 'Análise de dados', descricao: 'Notebooks, pipelines, consultas, modelos'},
    {valor: 'infra', rotulo: 'Infraestrutura', descricao: 'IaC, scripts, clusters, CI/CD'},
  ],
};
