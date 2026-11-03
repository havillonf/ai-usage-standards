import {useEffect, useId, useState, type ReactNode} from 'react';
import {useTema} from '@/lib/tema';

/** Lê os tokens de tokens.css para que os diagramas usem as cores da marca. */
function variaveisDaMarca(): Record<string, string> {
  const css = getComputedStyle(document.documentElement);
  const token = (nome: string) => css.getPropertyValue(nome).trim();
  return {
    fontFamily: token('--fonte-base'),
    background: token('--cor-fundo'),
    primaryColor: token('--cor-primaria-suave'),
    primaryBorderColor: token('--cor-primaria'),
    primaryTextColor: token('--cor-texto'),
    secondaryColor: token('--cor-superficie'),
    tertiaryColor: token('--cor-fundo'),
    lineColor: token('--cor-texto-suave'),
    textColor: token('--cor-texto'),
    noteBkgColor: token('--cor-aviso-suave'),
    noteTextColor: token('--cor-texto'),
  };
}

/** Diagrama Mermaid renderizado no cliente; a biblioteca só é baixada quando usada. */
export default function Mermaid({codigo}: {codigo: string}): ReactNode {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [tema] = useTema();
  const [svg, setSvg] = useState<string | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;
    void import('mermaid')
      .then(async ({default: mermaid}) => {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: variaveisDaMarca(),
          securityLevel: 'strict',
        });
        const {svg} = await mermaid.render(`mermaid-${id}-${tema}`, codigo);
        if (ativo) setSvg(svg);
      })
      .catch(() => ativo && setErro(true));
    return () => {
      ativo = false;
    };
  }, [codigo, id, tema]);

  if (erro) {
    return (
      <pre>
        <code>{codigo}</code>
      </pre>
    );
  }
  return (
    <figure
      style={{margin: '1.25rem 0', textAlign: 'center', minHeight: '4rem'}}
      aria-label="Diagrama"
      dangerouslySetInnerHTML={svg ? {__html: svg} : undefined}
    />
  );
}
