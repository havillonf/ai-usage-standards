import type {ReactNode} from 'react';
import {Link} from 'react-router';
import {useTituloPagina} from '@/lib/useTituloPagina';
import styles from './Paginas.module.css';

const OBJETIVOS = [
  {
    para: '/configurar',
    icone: '⚙',
    titulo: 'Configurar meu ambiente',
    texto: 'Prepare o projeto para o agente: AGENTS.md, permissões seguras e proteção de segredos.',
    detalhe: '3 perguntas · roteiro de 6 a 7 passos',
  },
  {
    para: '/estender',
    icone: '＋',
    titulo: 'Estender meu agente',
    texto: 'Adote uma skill, conecte um servidor MCP ou ensine uma regra nova ao agente.',
    detalhe: '1 a 2 perguntas · roteiro de 5 a 6 passos',
  },
];

export default function Inicio(): ReactNode {
  useTituloPagina();
  return (
    <div className={`container ${styles.inicio}`}>
      <p className={styles.sobretitulo}>Guia de agentes de IA · Laboratório Alan Turing — UFC</p>
      <h1 className={styles.chamada}>O que você quer fazer agora?</h1>
      <p className={styles.subtitulo}>
        Responda algumas perguntas e receba um roteiro passo a passo para a ferramenta que você usa: OpenCode, Cline,
        Claude Code, Antigravity ou outra.
      </p>

      <div className={styles.objetivos}>
        {OBJETIVOS.map((o) => (
          <Link key={o.para} to={o.para} className={styles.objetivo}>
            <span className={styles.objetivoIcone} aria-hidden="true">
              {o.icone}
            </span>
            <span className={styles.objetivoTitulo}>{o.titulo}</span>
            <span className={styles.objetivoTexto}>{o.texto}</span>
            <span className={styles.objetivoDetalhe}>{o.detalhe}</span>
            <span className={styles.objetivoSeta} aria-hidden="true">
              Começar →
            </span>
          </Link>
        ))}
      </div>

      <div className={styles.atalhos}>
        <Link to="/regras" className={styles.atalho}>
          <strong>Regras do laboratório</strong>
          <span>As 7 regras de uso de agentes no ATLab</span>
        </Link>
        <Link to="/ferramentas" className={styles.atalho}>
          <strong>Comparar ferramentas</strong>
          <span>O que cada agente suporta, com fontes</span>
        </Link>
        <Link to="/aprofundar" className={styles.atalho}>
          <strong>Aprofundar</strong>
          <span>Os porquês: contexto, segurança, AGENTS.md…</span>
        </Link>
      </div>
    </div>
  );
}
