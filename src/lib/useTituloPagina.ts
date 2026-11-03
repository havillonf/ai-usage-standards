import {useEffect} from 'react';

const SITE = 'Guia de Agentes de IA — ATLab';

/** Define o <title> da página atual. */
export function useTituloPagina(titulo?: string): void {
  useEffect(() => {
    document.title = titulo ? `${titulo} · ${SITE}` : SITE;
  }, [titulo]);
}
