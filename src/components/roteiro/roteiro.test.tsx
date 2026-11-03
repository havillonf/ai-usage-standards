import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createMemoryRouter} from 'react-router';
import {RouterProvider} from 'react-router/dom';
import {describe, expect, it} from 'vitest';
import {configurar} from '@/content/roteiros/configurar';
import {passosAplicaveis} from '@/content/tipos';
import {exportarChecklist} from '@/lib/exportar';
import {ROTAS} from '@/rotas';

function abrir(url: string) {
  const router = createMemoryRouter(ROTAS, {initialEntries: [url]});
  render(<RouterProvider router={router} />);
  return router;
}

describe('jornada Configurar meu ambiente', () => {
  it('as perguntas levam ao roteiro com as respostas na URL', async () => {
    const user = userEvent.setup();
    const router = abrir('/configurar');
    await user.click(await screen.findByRole('link', {name: /Cline/}));
    await user.click(await screen.findByRole('link', {name: /Análise de dados/}));
    await user.click(await screen.findByRole('link', {name: /Não tem/}));
    expect(await screen.findByRole('heading', {level: 1, name: 'Configurar meu ambiente'})).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/configurar/roteiro');
    expect(router.state.location.search).toBe('?ferramenta=cline&projeto=dados&instrucoes=nenhuma');
    // passo condicional de dados aparece; o de infra não
    expect(screen.getByRole('heading', {name: 'Proteja os dados originais'})).toBeInTheDocument();
    expect(screen.queryByRole('heading', {name: 'Separe o agente da produção'})).not.toBeInTheDocument();
    // instruções só da ferramenta escolhida
    expect(screen.getAllByText('No Cline').length).toBeGreaterThan(0);
    expect(screen.queryByText('No OpenCode')).not.toBeInTheDocument();
  });

  it('roteiro sem respostas completas volta para as perguntas', async () => {
    const router = abrir('/configurar/roteiro?ferramenta=opencode');
    expect(await screen.findByRole('heading', {name: 'Que tipo de projeto?'})).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/configurar');
  });

  it('marca progresso, avisa ao fechar a aba e confirma antes de sair', async () => {
    const user = userEvent.setup();
    const router = abrir('/configurar/roteiro?ferramenta=opencode&projeto=software&instrucoes=nenhuma');
    const total = passosAplicaveis(configurar, {ferramenta: 'opencode', projeto: 'software', instrucoes: 'nenhuma'}).length;
    expect(await screen.findByText(`0 de ${total}`)).toBeInTheDocument();

    // sem progresso, fechar a aba não pede confirmação
    const antes = new Event('beforeunload', {cancelable: true});
    window.dispatchEvent(antes);
    expect(antes.defaultPrevented).toBe(false);

    await user.click(screen.getAllByRole('checkbox', {name: 'Marcar como feito'})[0]);
    expect(screen.getByText(`1 de ${total}`)).toBeInTheDocument();

    const depois = new Event('beforeunload', {cancelable: true});
    window.dispatchEvent(depois);
    expect(depois.defaultPrevented).toBe(true);

    // sair por um link do site é bloqueado até a confirmação
    await user.click(screen.getByRole('link', {name: 'Regras'}));
    expect(router.state.location.pathname).toBe('/configurar/roteiro');
    await user.click(screen.getByRole('button', {name: 'Sair e perder o progresso', hidden: true}));
    expect(await screen.findByRole('heading', {level: 1, name: 'Regras obrigatórias'})).toBeInTheDocument();
  });
});

describe('exportarChecklist', () => {
  it('marca os passos feitos e inclui as respostas', () => {
    const respostas = {ferramenta: 'claude-code', projeto: 'infra', instrucoes: 'outro'};
    const passos = passosAplicaveis(configurar, respostas);
    const md = exportarChecklist(configurar, respostas, passos, new Set([passos[0].id]), 'https://exemplo/roteiro');
    expect(md).toContain('# Configurar meu ambiente');
    expect(md).toContain('Claude Code · Infraestrutura · Tem outro arquivo');
    expect(md).toContain(`- [x] **1. ${passos[0].titulo}**`);
    expect(md).toContain(`- [ ] **2. ${passos[1].titulo}**`);
    expect(md).toContain(`1 de ${passos.length} passos`);
  });
});
