import {useEffect} from 'react';
import {useBlocker, type Blocker} from 'react-router';

/**
 * Protege progresso que só existe em memória:
 * - fechar/recarregar a aba: o navegador pede confirmação (beforeunload). O texto
 *   é o padrão do navegador e ele só pergunta se houve interação com a página;
 * - sair por um link do próprio site para outra página: devolve um blocker para
 *   o app mostrar um diálogo de confirmação.
 * Mudanças só na query string (ex.: marcar um passo) não são bloqueadas.
 */
export function useProtecaoSaida(ativo: boolean): Blocker {
  useEffect(() => {
    if (!ativo) return;
    const aviso = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Navegadores antigos exigem returnValue preenchido.
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', aviso);
    return () => window.removeEventListener('beforeunload', aviso);
  }, [ativo]);

  return useBlocker(
    ({currentLocation, nextLocation}) => ativo && currentLocation.pathname !== nextLocation.pathname,
  );
}
