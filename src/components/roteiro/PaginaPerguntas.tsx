import type {ReactNode} from 'react';
import {Link, Navigate, useSearchParams} from 'react-router';
import {lerRespostas, proximaPergunta, rotuloResposta, type Roteiro} from '@/content/tipos';
import {useTituloPagina} from '@/lib/useTituloPagina';
import styles from './Perguntas.module.css';

/**
 * Perguntas da jornada, uma por tela. As respostas ficam na URL; quando todas
 * estão respondidas, segue para o roteiro.
 */
export default function PaginaPerguntas({roteiro}: {roteiro: Roteiro}): ReactNode {
  const [params] = useSearchParams();
  const respostas = lerRespostas(roteiro, params);
  const pergunta = proximaPergunta(roteiro, respostas);
  useTituloPagina(roteiro.titulo);

  if (!pergunta) {
    return <Navigate to={`${roteiro.caminho}/roteiro?${new URLSearchParams(respostas)}`} replace />;
  }

  const indice = roteiro.perguntas.indexOf(pergunta);
  const respondidas = roteiro.perguntas.slice(0, indice);
  const comResposta = (valor: string) => `${roteiro.caminho}?${new URLSearchParams({...respostas, [pergunta.id]: valor})}`;
  const anterior = respondidas.at(-1);
  const voltar = anterior
    ? `${roteiro.caminho}?${new URLSearchParams(Object.fromEntries(respondidas.slice(0, -1).map((p) => [p.id, respostas[p.id]])))}`
    : roteiro.caminho.startsWith('/estender/')
      ? '/estender'
      : '/';

  return (
    <div className={`container ${styles.pagina}`}>
      <p className={styles.jornada}>{roteiro.titulo}</p>
      {roteiro.perguntas.length > 1 && (
        <div className={styles.progresso} aria-label={`Pergunta ${indice + 1} de ${roteiro.perguntas.length}`}>
          {roteiro.perguntas.map((p, i) => (
            <span key={p.id} className={i <= indice ? styles.pontoAtivo : styles.ponto} />
          ))}
          <span className={styles.contagem}>
            Pergunta {indice + 1} de {roteiro.perguntas.length}
          </span>
        </div>
      )}

      <h1 className={styles.pergunta}>{pergunta.texto}</h1>
      {pergunta.ajuda && <p className={styles.ajuda}>{pergunta.ajuda}</p>}

      <div className={styles.opcoes}>
        {pergunta.opcoes.map((o) => (
          <Link key={o.valor} to={comResposta(o.valor)} className={styles.opcao}>
            <strong>{o.rotulo}</strong>
            {o.descricao && <span>{o.descricao}</span>}
          </Link>
        ))}
      </div>

      <div className={styles.rodape}>
        <Link to={voltar} className="botao botao-link">
          ← Voltar
        </Link>
        {respondidas.length > 0 && (
          <span className={styles.respostas}>
            {respondidas.map((p) => (
              <span key={p.id} className={styles.chip}>
                {rotuloResposta(roteiro, p.id, respostas[p.id]!)}
              </span>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
