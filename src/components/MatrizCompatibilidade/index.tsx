import type {ReactNode} from 'react';
import clsx from 'clsx';
import {FERRAMENTAS} from '@/data/ferramentas';
import {MATRIZ, VERIFICADO_EM, type Suporte} from '@/data/compatibilidade';
import styles from './styles.module.css';

const ROTULO: Record<Suporte, {icone: string; texto: string}> = {
  sim: {icone: '✓', texto: 'Sim'},
  parcial: {icone: '≈', texto: 'Parcial'},
  nao: {icone: '✕', texto: 'Não'},
  verificar: {icone: '?', texto: 'A verificar'},
};

/** Tabela de compatibilidade gerada a partir de src/data/compatibilidade.ts. */
export default function MatrizCompatibilidade({
  recursos,
}: {
  // Ids de recursos a exibir; omitido = todos.
  recursos?: string[];
}): ReactNode {
  const linhas = recursos ? MATRIZ.filter((r) => recursos.includes(r.id)) : MATRIZ;
  return (
    <figure className={styles.figura}>
      <div className={styles.rolagem}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th scope="col">Recurso</th>
              {FERRAMENTAS.map((f) => (
                <th scope="col" key={f.id}>
                  <a href={f.docs} target="_blank" rel="noopener noreferrer">
                    {f.nome}
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((r) => (
              <tr key={r.id}>
                <th scope="row">
                  <span className={styles.recurso}>{r.recurso}</span>
                  <span className={styles.descricao}>{r.descricao}</span>
                </th>
                {FERRAMENTAS.map((f) => {
                  const c = r.celulas[f.id];
                  const rotulo = ROTULO[c.suporte];
                  return (
                    <td key={f.id} className={styles[c.suporte]}>
                      <span className={styles.selo}>
                        <span aria-hidden="true">{rotulo.icone}</span> {rotulo.texto}
                      </span>
                      {c.nota && <span className={styles.nota}>{c.nota}</span>}
                      {c.fonte && (
                        <a
                          className={styles.fonte}
                          href={c.fonte}
                          target="_blank"
                          rel="noopener noreferrer">
                          fonte
                        </a>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className={clsx(styles.legenda)}>
        Verificado em {VERIFICADO_EM}. As ferramentas mudam rápido: confira a
        fonte antes de decidir. “A verificar” significa que ainda não confirmamos
        na documentação oficial.
      </figcaption>
    </figure>
  );
}
