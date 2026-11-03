import {useSyncExternalStore} from 'react';

// Tema claro/escuro. Nesta fase o site usa só o tema claro: não há botão de
// tema e nada chama definirTema. Quando o tema escuro voltar, ele será a única
// preferência guardada no navegador, e o index.html deverá aplicá-lo antes da
// primeira pintura, para não piscar.

export type Tema = 'claro' | 'escuro';

const ouvintes = new Set<() => void>();

function atual(): Tema {
  return document.documentElement.dataset.tema === 'escuro' ? 'escuro' : 'claro';
}

export function definirTema(tema: Tema): void {
  document.documentElement.dataset.tema = tema;
  try {
    localStorage.setItem('tema', tema);
  } catch {
    // Sem armazenamento disponível: o tema vale só nesta visita.
  }
  ouvintes.forEach((o) => o());
}

export function useTema(): [Tema, (t: Tema) => void] {
  const tema = useSyncExternalStore(
    (o) => {
      ouvintes.add(o);
      return () => ouvintes.delete(o);
    },
    atual,
    () => 'claro' as Tema,
  );
  return [tema, definirTema];
}
