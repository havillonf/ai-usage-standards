import {useState, type ReactNode} from 'react';
import {Link, Navigate, useSearchParams} from 'react-router';
import Dialogo from '@/components/ui/Dialogo';
import {useCopiar} from '@/components/ui/BlocoCodigo';
import {
  escolhaDe,
  lerRespostas,
  passosAplicaveis,
  proximaPergunta,
  rotuloResposta,
  type Roteiro,
} from '@/content/tipos';
import {baixarArquivo, exportarChecklist} from '@/lib/exportar';
import {useProtecaoSaida} from '@/lib/useProtecaoSaida';
import {useTituloPagina} from '@/lib/useTituloPagina';
import PassoCard from './PassoCard';
import styles from './Roteiro.module.css';

/**
 * Roteiro gerado a partir das respostas da jornada (lidas da URL).
 * O progresso fica só em memória; sair com progresso pede confirmação.
 */
export default function PaginaRoteiro({roteiro}: {roteiro: Roteiro}): ReactNode {
  const [params] = useSearchParams();
  const respostas = lerRespostas(roteiro, params);
  const [feitos, setFeitos] = useState<ReadonlySet<string>>(new Set());
  const [copiado, copiar] = useCopiar();
  const [confirmandoRecomeco, setConfirmandoRecomeco] = useState(false);
  const bloqueio = useProtecaoSaida(feitos.size > 0);
  useTituloPagina(roteiro.titulo);

  if (proximaPergunta(roteiro, respostas)) {
    return <Navigate to={`${roteiro.caminho}?${new URLSearchParams(respostas)}`} replace />;
  }

  const escolha = escolhaDe(respostas);
  const passos = passosAplicaveis(roteiro, respostas);
  const concluidos = passos.filter((p) => feitos.has(p.id)).length;
  const percentual = passos.length ? Math.round((concluidos / passos.length) * 100) : 0;

  const alternar = (id: string) =>
    setFeitos((f) => {
      const n = new Set(f);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const exportar = () =>
    baixarArquivo(
      `roteiro-${roteiro.id}.md`,
      exportarChecklist(roteiro, respostas, passos, feitos, window.location.href),
    );

  return (
    <div className={`container ${styles.pagina}`}>
      <nav className={styles.trilha} aria-label="Você está em">
        <Link to="/">Início</Link>
        {roteiro.caminho.startsWith('/estender/') && (
          <>
            <span aria-hidden="true">/</span>
            <Link to="/estender">Estender meu agente</Link>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span>{roteiro.titulo}</span>
      </nav>

      <header className={styles.cabecalho}>
        <h1>{roteiro.titulo}</h1>
        <p className={styles.descricao}>{roteiro.descricao}</p>
        <div className={styles.respostas}>
          {roteiro.perguntas.map((p) => (
            <span key={p.id} className={styles.chip} title={p.texto}>
              {rotuloResposta(roteiro, p.id, respostas[p.id]!)}
            </span>
          ))}
          <Link to={roteiro.caminho} className="botao botao-link botao-pequeno">
            Alterar respostas
          </Link>
        </div>
      </header>

      <div className={styles.barra} role="region" aria-label="Progresso do roteiro">
        <div className={styles.progresso}>
          <div className={styles.progressoTexto}>
            <strong>
              {concluidos} de {passos.length}
            </strong>{' '}
            passos feitos
          </div>
          <div
            className={styles.trilho}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentual}
            aria-label="Progresso">
            <div className={styles.preenchido} style={{width: `${percentual}%`}} />
          </div>
        </div>
        <div className={styles.acoes}>
          <button type="button" className="botao botao-pequeno" onClick={exportar}>
            Exportar checklist (.md)
          </button>
          <button type="button" className="botao botao-pequeno" onClick={() => copiar(window.location.href)}>
            {copiado ? 'Link copiado ✓' : 'Copiar link'}
          </button>
          <button
            type="button"
            className="botao botao-pequeno"
            disabled={feitos.size === 0}
            onClick={() => setConfirmandoRecomeco(true)}>
            Recomeçar
          </button>
        </div>
      </div>
      <p className={styles.nota}>
        O progresso não é salvo: ele some ao fechar a aba. Para guardá-lo, exporte o checklist.
      </p>

      <ol className={styles.passos}>
        {passos.map((p, i) => (
          <PassoCard
            key={p.id}
            passo={p}
            numero={i + 1}
            respostas={respostas}
            escolha={escolha}
            feito={feitos.has(p.id)}
            alternar={() => alternar(p.id)}
          />
        ))}
      </ol>

      {concluidos === passos.length && passos.length > 0 && (
        <p className={styles.concluido} role="status">
          ✓ Roteiro concluído. Exporte o checklist se quiser registrar o que foi feito.
        </p>
      )}

      {roteiro.proximos && (
        <section className={styles.proximos} aria-labelledby="proximos">
          <h2 id="proximos">Próximos passos</h2>
          <div className={styles.proximosGrade}>
            {roteiro.proximos.map((p) => (
              <Link key={p.para} to={p.para} className={styles.proximo}>
                <strong>{p.titulo}</strong>
                <span>{p.descricao}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Dialogo
        aberto={bloqueio.state === 'blocked'}
        titulo="Sair do roteiro?"
        rotuloCancelar="Continuar no roteiro"
        rotuloConfirmar="Sair e perder o progresso"
        cancelar={() => bloqueio.reset?.()}
        confirmar={() => bloqueio.proceed?.()}>
        <p>
          Você marcou {concluidos} {concluidos === 1 ? 'passo' : 'passos'} como {concluidos === 1 ? 'feito' : 'feitos'}.
          O progresso não é salvo e será perdido. Se quiser guardá-lo, exporte o checklist antes de sair.
        </p>
      </Dialogo>

      <Dialogo
        aberto={confirmandoRecomeco}
        titulo="Recomeçar o roteiro?"
        rotuloCancelar="Manter o progresso"
        rotuloConfirmar="Desmarcar tudo"
        cancelar={() => setConfirmandoRecomeco(false)}
        confirmar={() => {
          setFeitos(new Set());
          setConfirmandoRecomeco(false);
        }}>
        <p>Todos os passos voltam a ficar desmarcados.</p>
      </Dialogo>
    </div>
  );
}
