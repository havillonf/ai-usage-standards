import {useEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import {useNavigate} from 'react-router';
import {buscar} from '@/lib/busca';
import styles from './Busca.module.css';

/** Botão de busca do cabeçalho + diálogo de resultados (atalho Ctrl+K ou /). */
export default function Busca(): ReactNode {
  const [aberto, setAberto] = useState(false);
  const [consulta, setConsulta] = useState('');
  const [ativo, setAtivo] = useState(0);
  const dialogo = useRef<HTMLDialogElement>(null);
  const navegar = useNavigate();
  const resultados = useMemo(() => (consulta.trim().length >= 2 ? buscar(consulta.trim()) : []), [consulta]);

  useEffect(() => {
    const atalho = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      const digitando = alvo.closest('input, textarea, select, [contenteditable]');
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !digitando)) {
        e.preventDefault();
        setAberto(true);
      }
    };
    window.addEventListener('keydown', atalho);
    return () => window.removeEventListener('keydown', atalho);
  }, []);

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (aberto && !d.open) d.showModal?.();
    if (!aberto && d.open) d.close();
  }, [aberto]);

  const fechar = () => {
    setAberto(false);
    setConsulta('');
    setAtivo(0);
  };
  const ir = (para: string) => {
    fechar();
    void navegar(para);
  };

  return (
    <>
      <button type="button" className={styles.botao} onClick={() => setAberto(true)} aria-label="Buscar no guia">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className={styles.rotulo}>Buscar</span>
        <kbd className={styles.atalho}>Ctrl K</kbd>
      </button>
      <dialog
        ref={dialogo}
        className={styles.dialogo}
        aria-label="Buscar no guia"
        onCancel={(e) => {
          e.preventDefault();
          fechar();
        }}
        onClick={(e) => e.target === dialogo.current && fechar()}>
        <div className={styles.caixa}>
          <input
            className={styles.campo}
            type="search"
            placeholder="Buscar roteiros, artigos e ferramentas…"
            value={consulta}
            autoFocus
            aria-controls="resultados-busca"
            aria-activedescendant={resultados[ativo] ? `resultado-${ativo}` : undefined}
            onChange={(e) => {
              setConsulta(e.target.value);
              setAtivo(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setAtivo((a) => Math.min(a + 1, resultados.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setAtivo((a) => Math.max(a - 1, 0));
              } else if (e.key === 'Enter' && resultados[ativo]) {
                ir(resultados[ativo].para);
              }
            }}
          />
          <ul id="resultados-busca" role="listbox" className={styles.resultados}>
            {resultados.map((r, i) => (
              <li
                key={r.id}
                id={`resultado-${i}`}
                role="option"
                aria-selected={i === ativo}
                className={i === ativo ? styles.ativo : undefined}
                onMouseEnter={() => setAtivo(i)}
                onClick={() => ir(r.para)}>
                <span className={styles.tipo}>{r.tipo}</span>
                <strong>{r.titulo}</strong>
                <span className={styles.contexto}>{r.contexto}</span>
              </li>
            ))}
          </ul>
          {consulta.trim().length >= 2 && resultados.length === 0 && (
            <p className={styles.vazio}>Nada encontrado para “{consulta}”.</p>
          )}
          <p className={styles.ajuda}>
            <kbd>↑</kbd> <kbd>↓</kbd> para navegar · <kbd>Enter</kbd> para abrir · <kbd>Esc</kbd> para fechar
          </p>
        </div>
      </dialog>
    </>
  );
}
