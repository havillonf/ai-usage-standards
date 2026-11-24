import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createMemoryRouter} from 'react-router';
import {RouterProvider} from 'react-router/dom';
import {describe, expect, it} from 'vitest';
import {ROTAS} from '@/rotas';

function abrir(url: string) {
  const router = createMemoryRouter(ROTAS, {initialEntries: [url]});
  render(<RouterProvider router={router} />);
  return router;
}

describe('Exemplos por stack', () => {
  it('filtra por stack e tipo a partir da URL', async () => {
    abrir('/ferramentas/exemplos-por-stack?stack=playwright&tipo=mcp');
    expect(await screen.findByRole('heading', {level: 3, name: 'Playwright MCP'})).toBeInTheDocument();
    expect(screen.queryByRole('heading', {level: 3, name: 'Playwright CLI com skills'})).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', {level: 3, name: 'Svelte MCP'})).not.toBeInTheDocument();
  });

  it('avisa quando a stack não tem item oficial', async () => {
    abrir('/ferramentas/exemplos-por-stack?stack=django');
    expect(await screen.findByText(/Não encontramos skill nem MCP oficial para Django/)).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Minha stack não tem item oficial'})).toBeInTheDocument();
  });

  it('itens que valem para a camada inteira aparecem com qualquer stack dela', async () => {
    abrir('/ferramentas/exemplos-por-stack?stack=vue');
    expect(await screen.findByRole('heading', {level: 3, name: 'Chrome DevTools MCP'})).toBeInTheDocument();
    expect(screen.getByRole('heading', {level: 3, name: 'Documentação do Vue para agentes (llms.txt)'})).toBeInTheDocument();
  });

  it('marcar um filtro atualiza a URL', async () => {
    const user = userEvent.setup();
    const router = abrir('/ferramentas/exemplos-por-stack');
    await user.click(await screen.findByRole('checkbox', {name: 'FastAPI'}));
    expect(router.state.location.search).toBe('?stack=fastapi');
    expect(screen.getByRole('heading', {level: 3, name: 'Skill oficial do FastAPI'})).toBeInTheDocument();
  });
});
