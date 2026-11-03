import {describe, expect, it} from 'vitest';
import type {Escolha} from '@/content/tipos';
import {exemploAgentsMd, gerarAgentsMd, type TipoProjeto} from './agentsMd';
import {comandosSugeridos, gerarPermissoes} from './permissoes';

const FERRAMENTAS: Escolha[] = ['opencode', 'cline', 'claude-code', 'antigravity', 'generico'];
const PROJETOS: TipoProjeto[] = ['software', 'dados', 'infra'];

describe('gerarPermissoes', () => {
  for (const ferramenta of FERRAMENTAS) {
    for (const projeto of PROJETOS) {
      for (const pushComConfirmacao of [true, false]) {
        it(`${ferramenta}/${projeto}/push=${pushComConfirmacao} gera saída válida`, () => {
          const r = gerarPermissoes({ferramenta, projeto, permitidos: comandosSugeridos(projeto), pushComConfirmacao});
          expect(r.conteudo).not.toMatch(/undefined|\[object Object\]/);
          if (r.linguagem === 'json') expect(() => JSON.parse(r.conteudo)).not.toThrow();
        });
      }
    }
  }

  it('OpenCode: "*" primeiro, segredos negados e destrutivos por último', () => {
    const r = gerarPermissoes({ferramenta: 'opencode', projeto: 'infra', permitidos: ['make test'], pushComConfirmacao: false});
    const cfg = JSON.parse(r.conteudo);
    const bash = Object.entries(cfg.permission.bash as Record<string, string>);
    expect(bash[0]).toEqual(['*', 'ask']);
    expect(cfg.permission.bash['make test*']).toBe('allow');
    expect(cfg.permission.bash['git push *']).toBe('deny');
    expect(cfg.permission.bash['terraform apply*']).toBe('deny');
    // a última regra que casa vence: nenhum allow pode vir depois de um deny
    const ultimoAllow = bash.findLastIndex(([, v]) => v === 'allow');
    const primeiroDeny = bash.findIndex(([, v]) => v === 'deny');
    expect(ultimoAllow).toBeLessThan(primeiroDeny);
    expect(cfg.permission.read['*.env']).toBe('deny');
    expect(cfg.permission.read['*.env.example']).toBe('allow');
  });

  it('Claude Code: deny de leitura de segredos e push conforme a opção', () => {
    const comConfirmacao = JSON.parse(
      gerarPermissoes({ferramenta: 'claude-code', projeto: 'software', permitidos: ['npm test'], pushComConfirmacao: true})
        .conteudo,
    );
    expect(comConfirmacao.permissions.allow).toContain('Bash(npm test *)');
    expect(comConfirmacao.permissions.deny).toContain('Read(./.env)');
    expect(comConfirmacao.permissions.ask).toContain('Bash(git push *)');
    expect(comConfirmacao.permissions.deny).not.toContain('Bash(git push *)');

    const bloqueado = JSON.parse(
      gerarPermissoes({ferramenta: 'claude-code', projeto: 'software', permitidos: [], pushComConfirmacao: false}).conteudo,
    );
    expect(bloqueado.permissions.deny).toContain('Bash(git push *)');
  });

  it('ignora linhas vazias e duplicadas nos comandos permitidos', () => {
    const cfg = JSON.parse(
      gerarPermissoes({
        ferramenta: 'claude-code',
        projeto: 'software',
        permitidos: ['npm test', '', '  npm test  ', 'git status'],
        pushComConfirmacao: true,
      }).conteudo,
    );
    expect(cfg.permissions.allow.filter((a: string) => a === 'Bash(npm test *)')).toHaveLength(1);
    expect(cfg.permissions.allow).not.toContain('Bash( *)');
  });
});

describe('gerarAgentsMd', () => {
  it('gera as seções preenchidas e omite as vazias', () => {
    const dados = {...exemploAgentsMd('software'), nome: 'Projeto X', arquitetura: ''};
    const md = gerarAgentsMd(dados);
    expect(md).toMatch(/^# Projeto X\n/);
    expect(md).toContain('## Comandos');
    expect(md).toContain('- Testes: `npm test`');
    expect(md).not.toContain('## Arquitetura');
    expect(md).toContain('Co-Authored-By');
    expect(md.endsWith('\n')).toBe(true);
  });

  it('usa um título padrão e remove marcadores de lista digitados', () => {
    const md = gerarAgentsMd({...exemploAgentsMd('dados'), nome: '  ', convencoes: '- item um\n* item dois\n\n'});
    expect(md).toMatch(/^# Nome do projeto/);
    expect(md).toContain('- item um\n- item dois');
  });

  it('não declara uso de agente quando desmarcado', () => {
    const md = gerarAgentsMd({...exemploAgentsMd('infra'), git: '', declararAgente: false});
    expect(md).not.toContain('## Git');
  });
});
