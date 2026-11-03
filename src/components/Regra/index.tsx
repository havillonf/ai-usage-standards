import type {ReactNode} from 'react';
import clsx from 'clsx';
import {Link} from 'react-router';
import {REGRAS, REGRAS_POR_ID, type RegraObrigatoria} from '@/data/regras';
import styles from './styles.module.css';

function StatusBadge({status}: {status: RegraObrigatoria['status']}) {
  return (
    <span
      className={clsx(styles.status, status === 'aprovada' ? styles.aprovada : styles.proposta)}
      title={
        status === 'aprovada'
          ? 'Regra aprovada pela coordenação do ATLab'
          : 'Proposta aguardando aprovação da coordenação do ATLab'
      }>
      {status === 'aprovada' ? 'Aprovada' : 'Proposta'}
    </span>
  );
}

function buscar(id: string): RegraObrigatoria {
  const regra = REGRAS_POR_ID[id];
  if (!regra) throw new Error(`Regra desconhecida: "${id}". Verifique src/data/regras.ts.`);
  return regra;
}

function CartaoRegra({regra, comLink}: {regra: RegraObrigatoria; comLink: boolean}) {
  const obrigatoria = regra.nivel !== 'DEVERIA';
  return (
    <div
      className={clsx(styles.regra, obrigatoria ? styles.obrigatoria : styles.recomendada)}
      role="note"
      aria-label={`Regra ${regra.id}: ${regra.titulo}`}>
      <div className={styles.cabecalho}>
        <span className={styles.id}>{regra.id}</span>
        <span className={styles.nivel}>{regra.nivel}</span>
        <strong className={styles.titulo}>{regra.titulo}</strong>
        <StatusBadge status={regra.status} />
      </div>
      <p className={styles.texto}>{regra.texto}</p>
      {comLink && (
        <Link className={styles.link} to={regra.detalhes}>
          Entender a regra →
        </Link>
      )}
    </div>
  );
}

/** Exibe uma regra obrigatória a partir do seu id (ex.: <Regra id="R2" />). */
export default function Regra({id, comLink = false}: {id: string; comLink?: boolean}): ReactNode {
  return <CartaoRegra regra={buscar(id)} comLink={comLink} />;
}

/** Selo compacto de regra, usado nos passos dos roteiros. */
export function SeloRegra({id}: {id: string}): ReactNode {
  const regra = buscar(id);
  return (
    <Link
      to="/regras"
      className={clsx(styles.selo, regra.nivel === 'DEVERIA' && styles.seloRecomendada)}
      title={regra.texto}>
      {regra.id} · {regra.titulo}
    </Link>
  );
}

/** Lista todas as regras obrigatórias, na ordem de src/data/regras.ts. */
export function ListaRegras(): ReactNode {
  return (
    <div className={styles.lista}>
      {REGRAS.map((r) => (
        <CartaoRegra key={r.id} regra={r} comLink />
      ))}
    </div>
  );
}
