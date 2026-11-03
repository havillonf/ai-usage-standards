import {useState, type ReactNode} from 'react';
import clsx from 'clsx';
import {Link} from 'react-router';
import GeradorAgentsMd from '@/components/geradores/GeradorAgentsMd';
import GeradorPermissoes from '@/components/geradores/GeradorPermissoes';
import MatrizCompatibilidade from '@/components/MatrizCompatibilidade';
import {MATRIZ, type Suporte} from '@/data/compatibilidade';
import {FERRAMENTAS} from '@/data/ferramentas';
import {useTituloPagina} from '@/lib/useTituloPagina';
import styles from './Paginas.module.css';

type Avaliacao = 'atende' | 'parcial' | 'nao' | 'incerto';

function avaliar(suportes: Suporte[]): Avaliacao {
  if (suportes.some((s) => s === 'nao')) return 'nao';
  if (suportes.some((s) => s === 'verificar')) return 'incerto';
  if (suportes.some((s) => s === 'parcial')) return 'parcial';
  return 'atende';
}

const ROTULO_AVALIACAO: Record<Avaliacao, string> = {
  atende: 'Atende a tudo',
  parcial: 'Atende parcialmente',
  nao: 'Não atende',
  incerto: 'Há itens a verificar',
};

/** Comparador: o usuário marca o que precisa e vê quais ferramentas atendem. */
export function Ferramentas(): ReactNode {
  useTituloPagina('Comparar ferramentas');
  const [requisitos, setRequisitos] = useState<ReadonlySet<string>>(new Set());

  const alternar = (id: string) =>
    setRequisitos((r) => {
      const n = new Set(r);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const selecionados = MATRIZ.filter((r) => requisitos.has(r.id));

  return (
    <div className={`container ${styles.pagina}`}>
      <div className="prosa">
        <p className={styles.trilha}>
          <Link to="/">Início</Link> / Ferramentas
        </p>
        <h1>Comparar ferramentas</h1>
        <p>
          Marque o que você precisa e veja quais ferramentas de referência atendem. Os dados vêm da documentação oficial
          de cada ferramenta, com link para a fonte em cada célula da tabela.
        </p>
      </div>

      <fieldset className={styles.requisitos}>
        <legend>Eu preciso de…</legend>
        <div className={styles.chips}>
          {MATRIZ.map((r) => (
            <label key={r.id} className={clsx(styles.chipFiltro, requisitos.has(r.id) && styles.chipAtivo)}>
              <input
                type="checkbox"
                className="visualmente-oculto"
                checked={requisitos.has(r.id)}
                onChange={() => alternar(r.id)}
              />
              {r.recurso}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.cartoesFerramentas} aria-live="polite">
        {FERRAMENTAS.map((f) => {
          const av = selecionados.length ? avaliar(selecionados.map((r) => r.celulas[f.id].suporte)) : null;
          return (
            <div key={f.id} className={clsx(styles.cartaoFerramenta, av && styles[av])}>
              <strong>{f.nome}</strong>
              <span className={styles.ferramentaInfo}>
                {f.formato} · {f.licenca}
              </span>
              {av && <span className={styles.avaliacao}>{ROTULO_AVALIACAO[av]}</span>}
              <a href={f.docs} target="_blank" rel="noopener noreferrer" className={styles.ferramentaLink}>
                Documentação ↗
              </a>
            </div>
          );
        })}
      </div>

      <h2>Matriz completa</h2>
      <MatrizCompatibilidade recursos={selecionados.length ? selecionados.map((r) => r.id) : undefined} />
      {selecionados.length > 0 && (
        <button type="button" className="botao botao-pequeno" onClick={() => setRequisitos(new Set())}>
          Mostrar todos os recursos
        </button>
      )}

      <h2>Geradores</h2>
      <div className={styles.atalhos}>
        <Link to="/ferramentas/agents-md" className={styles.atalho}>
          <strong>Gerador de AGENTS.md</strong>
          <span>Monte as instruções de projeto com prévia ao vivo.</span>
        </Link>
        <Link to="/ferramentas/permissoes" className={styles.atalho}>
          <strong>Gerador de permissões</strong>
          <span>Configuração segura para a sua ferramenta e o seu tipo de projeto.</span>
        </Link>
      </div>
    </div>
  );
}

export function FerramentaAgentsMd(): ReactNode {
  useTituloPagina('Gerador de AGENTS.md');
  return (
    <div className={`container ${styles.pagina}`}>
      <div className="prosa">
        <p className={styles.trilha}>
          <Link to="/">Início</Link> / <Link to="/ferramentas">Ferramentas</Link> / Gerador de AGENTS.md
        </p>
        <h1>Gerador de AGENTS.md</h1>
        <p>
          Preencha o formulário e copie ou baixe o arquivo. Prefere que o agente rascunhe por você? Use o roteiro{' '}
          <Link to="/configurar">Configurar meu ambiente</Link>, que traz um prompt pronto. Entenda o que entra e o que
          não entra no arquivo em <Link to="/aprofundar/agents-md">AGENTS.md</Link>.
        </p>
      </div>
      <GeradorAgentsMd />
    </div>
  );
}

export function FerramentaPermissoes(): ReactNode {
  useTituloPagina('Gerador de permissões');
  return (
    <div className={`container ${styles.pagina}`}>
      <div className="prosa">
        <p className={styles.trilha}>
          <Link to="/">Início</Link> / <Link to="/ferramentas">Ferramentas</Link> / Gerador de permissões
        </p>
        <h1>Gerador de permissões</h1>
        <p>
          Gera uma configuração inicial segura: libera o que é seguro e repetitivo, pede confirmação para o resto e nega
          o destrutivo e a leitura de segredos. Entenda os níveis de autonomia em{' '}
          <Link to="/aprofundar/permissoes">Permissões e auto-aprovação</Link>.
        </p>
      </div>
      <GeradorPermissoes />
    </div>
  );
}
