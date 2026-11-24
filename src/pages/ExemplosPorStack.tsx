import type {ReactNode} from 'react';
import clsx from 'clsx';
import {Link, useSearchParams} from 'react-router';
import BlocoCodigo from '@/components/ui/BlocoCodigo';
import Markdown from '@/components/ui/Markdown';
import {EXEMPLOS, SEM_ITEM_OFICIAL, TIPOS, VERIFICADO_EM, semItemOficial, type Exemplo, type TipoExemplo} from '@/data/exemplos';
import {CAMADAS, STACKS, STACKS_POR_ID, type StackId} from '@/data/stacks';
import {useTituloPagina} from '@/lib/useTituloPagina';
import paginas from './Paginas.module.css';
import styles from './ExemplosPorStack.module.css';

const ROTULO_TIPO = Object.fromEntries(TIPOS.map((t) => [t.id, t.rotulo])) as Record<TipoExemplo, string>;

function lerLista<T extends string>(valor: string | null, validos: readonly T[]): T[] {
  if (!valor) return [];
  return valor.split(',').filter((v): v is T => (validos as readonly string[]).includes(v));
}

function dataBr(iso: string): string {
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
}

/** "React, Next.js" ou, se o item vale para a camada inteira, "Qualquer front-end". */
function rotuloStacks(ids: StackId[]): string {
  const camada = CAMADAS.find((c) => {
    const todas = STACKS.filter((s) => s.camada === c.id).map((s) => s.id);
    return todas.length > 1 && todas.every((s) => ids.includes(s));
  });
  return camada ? `Qualquer stack de ${camada.rotulo.toLowerCase()}` : ids.map((s) => STACKS_POR_ID[s].nome).join(', ');
}

function CartaoExemplo({exemplo}: {exemplo: Exemplo}): ReactNode {
  return (
    <article className={styles.cartao}>
      <header className={styles.cabecalho}>
        <h3 className={styles.nome}>{exemplo.nome}</h3>
        <span className={styles.organizacao}>{exemplo.organizacao}</span>
      </header>
      <div className={styles.etiquetas}>
        {exemplo.tipos.map((t) => (
          <span key={t} className={styles.etiqueta}>
            {ROTULO_TIPO[t]}
          </span>
        ))}
        <span className={styles.stacksDoItem}>{rotuloStacks(exemplo.stacks)}</span>
      </div>
      <div className="prosa">
        <Markdown>{exemplo.descricao}</Markdown>
      </div>
      {exemplo.instalacao?.map((c) => (
        <BlocoCodigo key={c.titulo} titulo={c.titulo} linguagem={c.linguagem} codigo={c.conteudo} />
      ))}
      {exemplo.cuidados && (
        <div className="prosa">
          <p>
            <strong>Cuidados</strong>
          </p>
          <ul>
            {exemplo.cuidados.map((c) => (
              <li key={c}>
                <Markdown inline>{c}</Markdown>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className={styles.rodape}>
        {exemplo.requisitos && <span>Requisitos: {exemplo.requisitos}</span>}
        {exemplo.licenca && <span>Licença: {exemplo.licenca}</span>}
        <span>Verificado em {dataBr(exemplo.verificado)}</span>
      </p>
      <p className={styles.links}>
        <a href={exemplo.url} target="_blank" rel="noopener noreferrer">
          Documentação oficial ↗
        </a>
        {exemplo.fontes?.map((f) => (
          <a key={f.url} href={f.url} target="_blank" rel="noopener noreferrer">
            {f.titulo} ↗
          </a>
        ))}
      </p>
    </article>
  );
}

/** Skills, MCPs e guias oficiais por stack. Os filtros ficam na URL (?stack=…&tipo=…). */
export default function ExemplosPorStack(): ReactNode {
  useTituloPagina('Exemplos por stack');
  const [params, setParams] = useSearchParams();
  const stacks = lerLista<StackId>(
    params.get('stack'),
    STACKS.map((s) => s.id),
  );
  const tipos = lerLista<TipoExemplo>(
    params.get('tipo'),
    TIPOS.map((t) => t.id),
  );

  const atualizar = (chave: 'stack' | 'tipo', lista: string[]) =>
    setParams(
      (p) => {
        const n = new URLSearchParams(p);
        if (lista.length) n.set(chave, lista.join(','));
        else n.delete(chave);
        return n;
      },
      {replace: true},
    );

  const alternar = <T extends string>(chave: 'stack' | 'tipo', atual: T[], valor: T) =>
    atualizar(chave, atual.includes(valor) ? atual.filter((v) => v !== valor) : [...atual, valor]);

  const visiveis = EXEMPLOS.filter(
    (e) => (!stacks.length || e.stacks.some((s) => stacks.includes(s))) && (!tipos.length || e.tipos.some((t) => tipos.includes(t))),
  );
  const semItem = stacks.filter(semItemOficial);
  const algumFiltro = stacks.length > 0 || tipos.length > 0;

  return (
    <div className={`container ${paginas.pagina}`}>
      <div className="prosa">
        <p className={paginas.trilha}>
          <Link to="/">Início</Link> / <Link to="/ferramentas">Ferramentas</Link> / Exemplos por stack
        </p>
        <h1>Exemplos por stack</h1>
        <p>
          Skills, servidores MCP e guias <strong>oficiais</strong>, mantidos por quem mantém a stack ou o serviço. Escolha as
          stacks do seu projeto. Os comandos vêm da documentação oficial de cada item; para saber onde cada ferramenta
          instala skills e servidores, siga os roteiros <Link to="/estender/skill">Adotar uma skill</Link> e{' '}
          <Link to="/estender/mcp">Conectar um servidor MCP</Link>.
        </p>
        <aside className="callout callout-warning">
          <span className="callout-titulo">Estar aqui não é aprovação</span>
          <p>
            Antes de instalar qualquer item, faça a auditoria do roteiro (regra <Link to="/regras">R5</Link>). Vários
            fornecedores documentam a instalação com <code>npx skills add</code>, um instalador de terceiros que copia as
            pastas das skills para o projeto: confira o que foi copiado. Verificado em {dataBr(VERIFICADO_EM)}; esses
            itens mudam rápido.
          </p>
        </aside>
      </div>

      <fieldset className={paginas.requisitos}>
        <legend>Stacks do projeto</legend>
        {CAMADAS.map((c) => (
          <div key={c.id} className={styles.grupoFiltro}>
            <span className={styles.rotuloGrupo}>{c.rotulo}</span>
            <div className={paginas.chips}>
              {STACKS.filter((s) => s.camada === c.id).map((s) => (
                <label key={s.id} className={clsx(paginas.chipFiltro, stacks.includes(s.id) && paginas.chipAtivo)}>
                  <input
                    type="checkbox"
                    className="visualmente-oculto"
                    checked={stacks.includes(s.id)}
                    onChange={() => alternar('stack', stacks, s.id)}
                  />
                  {s.nome}
                </label>
              ))}
            </div>
          </div>
        ))}
      </fieldset>

      <fieldset className={paginas.requisitos}>
        <legend>Tipo</legend>
        <div className={paginas.chips}>
          {TIPOS.map((t) => (
            <label key={t.id} className={clsx(paginas.chipFiltro, tipos.includes(t.id) && paginas.chipAtivo)}>
              <input
                type="checkbox"
                className="visualmente-oculto"
                checked={tipos.includes(t.id)}
                onChange={() => alternar('tipo', tipos, t.id)}
              />
              {t.rotulo}
            </label>
          ))}
        </div>
      </fieldset>

      {algumFiltro && (
        <button type="button" className="botao botao-pequeno" onClick={() => setParams(new URLSearchParams(), {replace: true})}>
          Limpar filtros
        </button>
      )}

      <div aria-live="polite">
        {semItem.length > 0 && (
          <aside className="callout callout-info">
            <span className="callout-titulo">Sem item oficial</span>
            <p>
              Não encontramos skill nem MCP oficial para {semItem.map((s) => STACKS_POR_ID[s].nome).join(', ')}. Veja abaixo
              o que fazer nesse caso.
            </p>
          </aside>
        )}

        <p className={paginas.legenda}>
          {visiveis.length} {visiveis.length === 1 ? 'item' : 'itens'}
        </p>

        {CAMADAS.map((c) => {
          const daCamada = visiveis.filter((e) => STACKS_POR_ID[e.stacks[0]].camada === c.id);
          if (!daCamada.length) return null;
          return (
            <section key={c.id}>
              <h2>{c.rotulo}</h2>
              <div className={styles.grade}>
                {daCamada.map((e) => (
                  <CartaoExemplo key={e.id} exemplo={e} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="prosa">
        <h2>Minha stack não tem item oficial</h2>
        <p>
          Node.js, Django, Spring Boot, pytest e outras stacks muito usadas ainda não têm skill nem MCP oficial. Nesses casos:
        </p>
        <ol>
          {SEM_ITEM_OFICIAL.map((t) => (
            <li key={t}>
              <Markdown inline>{t}</Markdown>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
