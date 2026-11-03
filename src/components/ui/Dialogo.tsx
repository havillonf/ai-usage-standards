import {useEffect, useRef, type ReactNode} from 'react';
import styles from './Dialogo.module.css';

/** Diálogo modal de confirmação, baseado no <dialog> nativo. */
export default function Dialogo({
  aberto,
  titulo,
  children,
  confirmar,
  cancelar,
  rotuloConfirmar,
  rotuloCancelar,
}: {
  aberto: boolean;
  titulo: string;
  children: ReactNode;
  confirmar: () => void;
  cancelar: () => void;
  rotuloConfirmar: string;
  rotuloCancelar: string;
}): ReactNode {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aberto && !d.open) d.showModal?.();
    if (!aberto && d.open) d.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      className={styles.dialogo}
      aria-labelledby="dialogo-titulo"
      onCancel={(e) => {
        e.preventDefault();
        cancelar();
      }}>
      <h2 id="dialogo-titulo" className={styles.titulo}>
        {titulo}
      </h2>
      <div className={styles.corpo}>{children}</div>
      <div className={styles.acoes}>
        <button type="button" className="botao botao-primario" onClick={cancelar} autoFocus>
          {rotuloCancelar}
        </button>
        <button type="button" className="botao" onClick={confirmar}>
          {rotuloConfirmar}
        </button>
      </div>
    </dialog>
  );
}
