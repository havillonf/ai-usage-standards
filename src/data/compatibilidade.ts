import type {FerramentaId} from './ferramentas';

// Matriz de compatibilidade: qual ferramenta suporta qual recurso.
// Toda célula deve ter fonte ou ficar como 'verificar'. Atualize `VERIFICADO_EM`
// sempre que revisar a matriz inteira.

export const VERIFICADO_EM = '2026-10';

export type Suporte = 'sim' | 'parcial' | 'nao' | 'verificar';

export interface Celula {
  suporte: Suporte;
  nota?: string;
  fonte?: string;
}

export interface Recurso {
  id: string;
  recurso: string;
  descricao: string;
  celulas: Record<FerramentaId, Celula>;
}

export const MATRIZ: Recurso[] = [
  {
    id: 'modelos',
    recurso: 'Escolha de modelo/provedor',
    descricao: 'Permite usar LLMs de provedores diferentes ou endpoints próprios.',
    celulas: {
      opencode: {
        suporte: 'sim',
        nota: 'Vários provedores e endpoints compatíveis com a API da OpenAI.',
        fonte: 'https://opencode.ai/docs/providers/',
      },
      cline: {
        suporte: 'sim',
        nota: 'Vários provedores; permite modelos diferentes para Plan e Act.',
        fonte: 'https://docs.cline.bot/features/plan-and-act',
      },
      'claude-code': {
        suporte: 'parcial',
        nota: 'Focado nos modelos Claude (API direta ou provedores de nuvem).',
        fonte: 'https://code.claude.com/docs/',
      },
      antigravity: {
        suporte: 'parcial',
        nota: 'Conjunto de modelos oferecido pela própria ferramenta.',
        fonte: 'https://antigravity.google/docs/',
      },
    },
  },
  {
    id: 'agents-md',
    recurso: 'AGENTS.md',
    descricao: 'Lê instruções de projeto do arquivo aberto AGENTS.md.',
    celulas: {
      opencode: {
        suporte: 'sim',
        nota: 'Padrão nativo; usa CLAUDE.md como alternativa se não houver AGENTS.md.',
        fonte: 'https://opencode.ai/docs/rules/',
      },
      cline: {
        suporte: 'sim',
        nota: 'Detectado junto com .clinerules/; aparece no painel de regras.',
        fonte: 'https://docs.cline.bot/customization/cline-rules',
      },
      'claude-code': {
        suporte: 'sim',
        nota: 'Lido quando não há CLAUDE.md (configurável); ou via import em CLAUDE.md.',
        fonte: 'https://code.claude.com/docs/en/memory',
      },
      antigravity: {
        suporte: 'sim',
        nota: 'Na raiz, em subdiretórios e global (~/.gemini/AGENTS.md).',
        fonte: 'https://antigravity.google/docs/rules',
      },
    },
  },
  {
    id: 'regras-escopo',
    recurso: 'Regras com escopo por caminho',
    descricao: 'Instruções que só carregam ao trabalhar em certos arquivos.',
    celulas: {
      opencode: {
        suporte: 'parcial',
        nota: 'AGENTS.md por diretório e campo "instructions" com globs.',
        fonte: 'https://opencode.ai/docs/rules/',
      },
      cline: {
        suporte: 'sim',
        nota: 'Frontmatter "paths" nas regras.',
        fonte: 'https://docs.cline.bot/customization/cline-rules',
      },
      'claude-code': {
        suporte: 'sim',
        nota: '.claude/rules/ com escopo por caminho.',
        fonte: 'https://code.claude.com/docs/en/memory',
      },
      antigravity: {
        suporte: 'sim',
        nota: 'Gatilho "glob" em .agents/rules/.',
        fonte: 'https://antigravity.google/docs/rules',
      },
    },
  },
  {
    id: 'skills',
    recurso: 'Agent Skills (SKILL.md)',
    descricao: 'Pacotes de instruções e scripts carregados sob demanda.',
    celulas: {
      opencode: {
        suporte: 'sim',
        nota: 'Inclui compatibilidade com .claude/skills.',
        fonte: 'https://opencode.ai/docs/rules/',
      },
      cline: {
        suporte: 'parcial',
        nota: 'Experimental: habilitar em Settings → Features.',
        fonte: 'https://docs.cline.bot/features/skills',
      },
      'claude-code': {
        suporte: 'sim',
        fonte: 'https://code.claude.com/docs/en/skills',
      },
      antigravity: {
        suporte: 'verificar',
        nota: 'Há suporte documentado, mas os caminhos variam entre versões.',
      },
    },
  },
  {
    id: 'mcp',
    recurso: 'MCP',
    descricao: 'Conecta servidores Model Context Protocol.',
    celulas: {
      opencode: {suporte: 'sim', fonte: 'https://opencode.ai/docs/mcp-servers/'},
      cline: {suporte: 'sim', fonte: 'https://docs.cline.bot/'},
      'claude-code': {suporte: 'sim', fonte: 'https://code.claude.com/docs/en/mcp'},
      antigravity: {suporte: 'sim', fonte: 'https://antigravity.google/docs/'},
    },
  },
  {
    id: 'plano',
    recurso: 'Modo de planejamento',
    descricao: 'Modo que explora e planeja sem editar arquivos.',
    celulas: {
      opencode: {
        suporte: 'sim',
        nota: 'Agente "plan" (alternar com Tab).',
        fonte: 'https://opencode.ai/docs/agents/',
      },
      cline: {
        suporte: 'sim',
        nota: 'Modos Plan e Act.',
        fonte: 'https://docs.cline.bot/features/plan-and-act',
      },
      'claude-code': {
        suporte: 'sim',
        nota: 'Plan mode (Shift+Tab).',
        fonte: 'https://code.claude.com/docs/en/best-practices',
      },
      antigravity: {
        suporte: 'sim',
        nota: 'Modo de planejamento; agentMode "plan" no CLI.',
        fonte: 'https://antigravity.google/docs/settings?tab=ide',
      },
    },
  },
  {
    id: 'permissoes',
    recurso: 'Regras de permissão (allow/ask/deny)',
    descricao: 'Regras declarativas por ferramenta ou comando.',
    celulas: {
      opencode: {
        suporte: 'sim',
        nota: 'Chave "permission" no opencode.json.',
        fonte: 'https://opencode.ai/docs/permissions/',
      },
      cline: {
        suporte: 'parcial',
        nota: 'Chaves de auto-aprovação por categoria; não há regras por comando.',
        fonte: 'https://docs.cline.bot/features/auto-approve',
      },
      'claude-code': {
        suporte: 'sim',
        nota: 'permissions.allow/ask/deny em settings.json.',
        fonte: 'https://code.claude.com/docs/en/permissions',
      },
      antigravity: {
        suporte: 'sim',
        nota: 'Allowlist e denylist de terminal; regras allow/ask/deny no CLI.',
        fonte: 'https://antigravity.google/docs/settings?tab=ide',
      },
    },
  },
  {
    id: 'sandbox',
    recurso: 'Sandbox de execução',
    descricao: 'Isolamento de sistema de arquivos e rede para comandos.',
    celulas: {
      opencode: {suporte: 'verificar'},
      cline: {suporte: 'verificar'},
      'claude-code': {
        suporte: 'sim',
        fonte: 'https://code.claude.com/docs/en/sandboxing',
      },
      antigravity: {
        suporte: 'sim',
        nota: 'Terminal sandbox (macOS e Linux); ativado no strict mode.',
        fonte: 'https://antigravity.google/docs/settings?tab=ide',
      },
    },
  },
  {
    id: 'hooks',
    recurso: 'Hooks',
    descricao: 'Scripts determinísticos disparados em eventos do agente.',
    celulas: {
      opencode: {
        suporte: 'parcial',
        nota: 'Via plugins.',
        fonte: 'https://opencode.ai/docs/plugins/',
      },
      cline: {
        suporte: 'sim',
        nota: 'Hooks como PreToolUse.',
        fonte: 'https://docs.cline.bot/customization/clineignore',
      },
      'claude-code': {
        suporte: 'sim',
        fonte: 'https://code.claude.com/docs/en/hooks-guide',
      },
      antigravity: {suporte: 'verificar'},
    },
  },
  {
    id: 'subagentes',
    recurso: 'Subagentes',
    descricao: 'Agentes auxiliares com contexto próprio.',
    celulas: {
      opencode: {
        suporte: 'sim',
        nota: 'Subagentes "general" e "explore" embutidos, mais agentes customizados.',
        fonte: 'https://opencode.ai/docs/agents/',
      },
      cline: {suporte: 'verificar'},
      'claude-code': {
        suporte: 'sim',
        fonte: 'https://code.claude.com/docs/en/sub-agents',
      },
      antigravity: {suporte: 'verificar'},
    },
  },
  {
    id: 'headless',
    recurso: 'Execução não interativa (CI)',
    descricao: 'Roda o agente a partir de scripts e pipelines.',
    celulas: {
      opencode: {
        suporte: 'sim',
        nota: 'opencode run.',
        fonte: 'https://opencode.ai/docs/permissions/',
      },
      cline: {
        suporte: 'sim',
        nota: 'Pelo Cline CLI.',
        fonte: 'https://docs.cline.bot/',
      },
      'claude-code': {
        suporte: 'sim',
        nota: 'claude -p.',
        fonte: 'https://code.claude.com/docs/en/headless',
      },
      antigravity: {
        suporte: 'verificar',
        nota: 'Existe um CLI; o modo não interativo ainda não foi verificado.',
      },
    },
  },
];
