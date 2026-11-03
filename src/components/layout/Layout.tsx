import {useEffect, useRef, type ReactNode} from 'react';
import {Link, NavLink, Outlet, ScrollRestoration} from 'react-router';
import {ProvedorAbas} from '@/components/NaPratica';
import Busca from './Busca';
import styles from './Layout.module.css';

const REPO = 'https://github.com/havillonf/ai-usage-standards';
const MARCA = `${import.meta.env.BASE_URL}marca/`;

export default function Layout(): ReactNode {
  const cabecalho = useRef<HTMLElement>(null);

  // Expõe a altura do cabeçalho para elementos fixos (ex.: barra de progresso).
  useEffect(() => {
    const el = cabecalho.current;
    if (!el) return;
    const atualizar = () =>
      document.documentElement.style.setProperty('--altura-cabecalho', `${el.offsetHeight}px`);
    atualizar();
    if (typeof ResizeObserver === 'undefined') return;
    const obs = new ResizeObserver(atualizar);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <ProvedorAbas>
      <a className={styles.pular} href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className={styles.aviso}>
        Protótipo em validação pela coordenação do ATLab. As regras obrigatórias ainda são uma{' '}
        <strong>proposta</strong>.
      </div>
      <header ref={cabecalho} className={styles.cabecalho}>
        <div className={`container ${styles.barra}`}>
          <Link to="/" className={styles.marca}>
            <img
              className={styles.marcaLogo}
              src={`${MARCA}atlab-reduzido-cor.png`}
              alt="ATLab"
              width="353"
              height="80"
            />
            <span className={styles.marcaSeparador} aria-hidden="true" />
            <span className={styles.marcaNome}>Guia de Agentes de IA</span>
          </Link>
          <nav className={styles.nav} aria-label="Principal">
            <NavLink to="/regras">Regras</NavLink>
            <NavLink to="/ferramentas">Ferramentas</NavLink>
            <NavLink to="/aprofundar">Aprofundar</NavLink>
          </nav>
          <div className={styles.extras}>
            <Busca />
          </div>
        </div>
      </header>
      <main id="conteudo" className={styles.principal}>
        <Outlet />
      </main>
      <footer className={styles.rodape}>
        <div className={`container ${styles.rodapeConteudo}`}>
          <div className={styles.rodapeMarcas}>
            <a href="https://www.atlab.ufc.br/" target="_blank" rel="noopener noreferrer">
              <img
                className={styles.logoAtlab}
                src={`${MARCA}atlab-completa-negativa.svg`}
                alt="ATLab — Laboratório Alan Turing"
                width="4110"
                height="725"
              />
            </a>
            <span className={styles.rodapeSeparador} aria-hidden="true" />
            <a href="https://dc.ufc.br/" target="_blank" rel="noopener noreferrer">
              <img
                className={styles.logoParceiro}
                src={`${MARCA}dc-branco.png`}
                alt="Departamento de Computação"
                width="251"
                height="80"
              />
            </a>
            <a href="https://www.ufc.br/" target="_blank" rel="noopener noreferrer">
              <img
                className={styles.logoParceiro}
                src={`${MARCA}ufc-branco.png`}
                alt="Universidade Federal do Ceará"
                width="215"
                height="96"
              />
            </a>
          </div>
          <div className={styles.rodapeTexto}>
            <span>
              Laboratório Alan Turing (ATLab) — UFC · Conteúdo sob{' '}
              <a href="https://creativecommons.org/licenses/by/4.0/deed.pt_BR" target="_blank" rel="noopener noreferrer">
                CC BY 4.0
              </a>
            </span>
            <span className={styles.rodapeLinks}>
              <Link to="/aprofundar/sobre-o-guia">Sobre o guia</Link>
              <Link to="/aprofundar/contribuir">Como contribuir</Link>
              <a href={REPO} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </span>
          </div>
        </div>
      </footer>
      <ScrollRestoration />
    </ProvedorAbas>
  );
}
