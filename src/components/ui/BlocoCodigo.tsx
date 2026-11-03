import {useState, type ReactNode} from 'react';
import {baixarArquivo} from '@/lib/exportar';
import styles from './BlocoCodigo.module.css';

export function useCopiar(): [boolean, (texto: string) => void] {
  const [copiado, setCopiado] = useState(false);
  const copiar = (texto: string) => {
    void navigator.clipboard?.writeText(texto).then(
      () => {
        setCopiado(true);
        window.setTimeout(() => setCopiado(false), 2000);
      },
      () => setCopiado(false),
    );
  };
  return [copiado, copiar];
}

/**
 * Bloco de código com título, botão de copiar e, opcionalmente, de baixar.
 * Usado para prompts prontos, arquivos de configuração e trechos dos artigos.
 */
export default function BlocoCodigo({
  codigo,
  titulo,
  linguagem,
  nomeArquivo,
  variante = 'codigo',
}: {
  codigo: string;
  titulo?: string;
  linguagem?: string;
  /** Se informado, mostra o botão "Baixar" com este nome de arquivo. */
  nomeArquivo?: string;
  variante?: 'codigo' | 'prompt';
}): ReactNode {
  const [copiado, copiar] = useCopiar();
  const texto = codigo.replace(/\n$/, '');
  return (
    <figure className={`${styles.bloco} ${variante === 'prompt' ? styles.prompt : ''}`}>
      <figcaption className={styles.cabecalho}>
        <span className={styles.titulo}>
          {variante === 'prompt' && <span className={styles.etiqueta}>Prompt</span>}
          {titulo ?? linguagem ?? ''}
        </span>
        <span className={styles.acoes}>
          {nomeArquivo && (
            <button
              type="button"
              className="botao botao-pequeno"
              onClick={() => baixarArquivo(nomeArquivo.split('/').pop()!, codigo, 'text/plain')}>
              Baixar
            </button>
          )}
          <button type="button" className="botao botao-pequeno" onClick={() => copiar(texto)}>
            {copiado ? 'Copiado ✓' : 'Copiar'}
          </button>
          <span className="visualmente-oculto" aria-live="polite">
            {copiado ? 'Copiado para a área de transferência' : ''}
          </span>
        </span>
      </figcaption>
      <pre className={styles.pre}>
        <code className={linguagem ? `language-${linguagem}` : undefined}>{texto}</code>
      </pre>
    </figure>
  );
}
