import type {ReactNode} from 'react';
import {useLocation, type RouteObject} from 'react-router';
import Layout from '@/components/layout/Layout';
import PaginaPerguntas from '@/components/roteiro/PaginaPerguntas';
import PaginaRoteiro from '@/components/roteiro/PaginaRoteiro';
import {ROTEIROS} from '@/content/roteiros';
import type {Roteiro} from '@/content/tipos';
import {Aprofundar, PaginaArtigo} from '@/pages/Aprofundar';
import {Estender, EstenderNaoSei} from '@/pages/Estender';
import {FerramentaAgentsMd, FerramentaPermissoes, Ferramentas} from '@/pages/Ferramentas';
import Inicio from '@/pages/Inicio';
import NaoEncontrado from '@/pages/NaoEncontrado';
import Regras from '@/pages/Regras';

// Novas respostas = roteiro novo: a chave zera o progresso em memória.
function RoteiroPorRespostas({roteiro}: {roteiro: Roteiro}): ReactNode {
  const {search} = useLocation();
  return <PaginaRoteiro key={search} roteiro={roteiro} />;
}

const semBarra = (caminho: string) => caminho.replace(/^\//, '');

export const ROTAS: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {index: true, element: <Inicio />},
      {path: 'estender', element: <Estender />},
      {path: 'estender/nao-sei', element: <EstenderNaoSei />},
      ...ROTEIROS.flatMap((r) => [
        {path: semBarra(r.caminho), element: <PaginaPerguntas roteiro={r} />},
        {path: `${semBarra(r.caminho)}/roteiro`, element: <RoteiroPorRespostas roteiro={r} />},
      ]),
      {path: 'ferramentas', element: <Ferramentas />},
      {path: 'ferramentas/agents-md', element: <FerramentaAgentsMd />},
      {path: 'ferramentas/permissoes', element: <FerramentaPermissoes />},
      {path: 'regras', element: <Regras />},
      {path: 'aprofundar', element: <Aprofundar />},
      {path: 'aprofundar/:slug', element: <PaginaArtigo />},
      {path: '*', element: <NaoEncontrado />},
    ],
  },
];
