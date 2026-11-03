import type {ReactNode} from 'react';
import clsx from 'clsx';
import {Link} from 'react-router';
import {SeloRegra} from '@/components/Regra';
import Markdown from '@/components/ui/Markdown';
import {NOME_FERRAMENTA} from '@/data/ferramentas';
import {
  blocoVisivel,
  daFerramenta,
  resolver,
  type Escolha,
  type Passo,
  type Respostas,
} from '@/content/tipos';
import BlocoView from './BlocoView';
import styles from './Roteiro.module.css';

export default function PassoCard({
  passo,
  numero,
  respostas,
  escolha,
  feito,
  alternar,
}: {
  passo: Passo;
  numero: number;
  respostas: Respostas;
  escolha: Escolha;
  feito: boolean;
  alternar: () => void;
}): ReactNode {
  const instrucao = passo.instrucoes ? resolver(daFerramenta(passo.instrucoes, escolha), respostas) : null;
  const blocos = (passo.blocos ?? []).filter((b) => blocoVisivel(b, escolha));
  const tituloId = `passo-${passo.id}-titulo`;

  return (
    <li className={clsx(styles.passo, feito && styles.passoFeito)} id={passo.id} aria-labelledby={tituloId}>
      <div className={styles.marcador} aria-hidden="true">
        {feito ? '✓' : numero}
      </div>
      <article className={styles.passoCorpo}>
        <header className={styles.passoCabecalho}>
          <h2 id={tituloId} className={styles.passoTitulo}>
            {passo.titulo}
          </h2>
          {passo.regras && (
            <div className={styles.selos}>
              {passo.regras.map((r) => (
                <SeloRegra key={r} id={r} />
              ))}
            </div>
          )}
        </header>

        <div className={clsx('prosa', styles.resumo)}>
          <Markdown>{resolver(passo.resumo, respostas)}</Markdown>
        </div>

        {instrucao && (
          <section className={styles.instrucao} aria-label="Como fazer">
            <div className={styles.instrucaoRotulo}>
              {escolha === 'generico' ? 'Como fazer' : `No ${NOME_FERRAMENTA[escolha]}`}
            </div>
            <div className="prosa">
              <Markdown>{instrucao}</Markdown>
            </div>
          </section>
        )}

        {blocos.map((b, i) => (
          <BlocoView key={i} bloco={b} respostas={respostas} escolha={escolha} />
        ))}

        {passo.porque && (
          <details className={styles.porque}>
            <summary>Por quê?</summary>
            <div className="prosa">
              <Markdown>{passo.porque.texto}</Markdown>
              {passo.porque.artigo && (
                <p>
                  <Link to={`/aprofundar/${passo.porque.artigo}`}>Ler o artigo completo em Aprofundar →</Link>
                </p>
              )}
            </div>
          </details>
        )}

        {passo.fontes && passo.fontes.length > 0 && (
          <p className={styles.fontes}>
            Fontes:{' '}
            {passo.fontes.map((f, i) => (
              <span key={f.url}>
                {i > 0 && ' · '}
                <a href={f.url} target="_blank" rel="noopener noreferrer">
                  {f.titulo}
                </a>
              </span>
            ))}
          </p>
        )}

        <label className={styles.feito}>
          <input type="checkbox" checked={feito} onChange={alternar} />
          {feito ? 'Feito' : 'Marcar como feito'}
        </label>
      </article>
    </li>
  );
}
