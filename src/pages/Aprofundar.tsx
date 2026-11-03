import {useEffect, useState, type ComponentProps, type ReactElement, type ReactNode} from 'react';
import {MDXProvider} from '@mdx-js/react';
import type {MDXComponents, MDXContent} from 'mdx/types';
import {Link, useLocation, useParams} from 'react-router';
import ArvoreDecisao from '@/components/ArvoreDecisao';
import MatrizCompatibilidade from '@/components/MatrizCompatibilidade';
import NaPratica, {TabItem} from '@/components/NaPratica';
import Regra, {ListaRegras} from '@/components/Regra';
import BlocoCodigo from '@/components/ui/BlocoCodigo';
import {LinkInteligente} from '@/components/ui/Markdown';
import Mermaid from '@/components/ui/Mermaid';
import {ARTIGOS, CATEGORIAS} from '@/content/artigos';
import {useTituloPagina} from '@/lib/useTituloPagina';
import NaoEncontrado from './NaoEncontrado';
import styles from './Paginas.module.css';

const REPO_EDICAO = 'https://github.com/havillonf/ai-usage-standards/edit/main/src/content/artigos';

const TITULO_CALLOUT: Record<string, string> = {
  tip: 'Dica',
  info: 'Nota',
  note: 'Nota',
  warning: 'Atenção',
  danger: 'Cuidado',
};

type PropsComDados = ComponentProps<'aside'> & {'data-titulo'?: string};

function Callout({className = '', children, ...props}: PropsComDados): ReactNode {
  const tipo = className.match(/callout-(\w+)/)?.[1] ?? 'info';
  const titulo = props['data-titulo'] || TITULO_CALLOUT[tipo];
  return (
    <aside className={className}>
      <span className="callout-titulo">{titulo}</span>
      {children}
    </aside>
  );
}

function PreMdx({children}: ComponentProps<'pre'>): ReactNode {
  const codigo = children as ReactElement<{className?: string; children?: string; 'data-titulo'?: string}>;
  const props = codigo?.props ?? {};
  const linguagem = props.className?.replace('language-', '');
  return <BlocoCodigo codigo={String(props.children ?? '')} linguagem={linguagem} titulo={props['data-titulo']} />;
}

/** Componentes disponíveis em qualquer artigo .mdx, sem import. */
const COMPONENTES: MDXComponents = {
  a: ({href, children}) => <LinkInteligente href={href}>{children}</LinkInteligente>,
  aside: Callout,
  pre: PreMdx,
  Regra,
  ListaRegras,
  NaPratica,
  TabItem,
  MatrizCompatibilidade,
  ArvoreDecisao,
  Mermaid,
};

function normalizar(t: string): string {
  return t.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

export function Aprofundar(): ReactNode {
  useTituloPagina('Aprofundar');
  const [filtro, setFiltro] = useState('');
  const termo = normalizar(filtro.trim());
  const combina = (slug: string) => {
    const a = ARTIGOS[slug];
    return !termo || normalizar(`${a.titulo} ${a.descricao} ${a.texto}`).includes(termo);
  };

  return (
    <div className={`container ${styles.pagina}`}>
      <div className="prosa">
        <p className={styles.trilha}>
          <Link to="/">Início</Link> / Aprofundar
        </p>
        <h1>Aprofundar</h1>
        <p>
          Os porquês por trás dos roteiros: como agentes usam contexto, como escrever instruções, como manter a
          segurança. Os passos dos roteiros apontam para estes artigos.
        </p>
      </div>
      <label className={styles.filtro}>
        <span className="visualmente-oculto">Filtrar artigos</span>
        <input type="search" placeholder="Filtrar artigos…" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
      </label>
      {CATEGORIAS.map((c) => {
        const artigos = c.artigos.filter((s) => ARTIGOS[s] && combina(s));
        if (!artigos.length) return null;
        return (
          <section key={c.titulo} aria-labelledby={`cat-${c.titulo}`}>
            <h2 id={`cat-${c.titulo}`} className={styles.categoria}>
              {c.titulo}
            </h2>
            <div className={styles.atalhos}>
              {artigos.map((s) => (
                <Link key={s} to={`/aprofundar/${s}`} className={styles.atalho}>
                  <strong>{ARTIGOS[s].titulo}</strong>
                  <span>{ARTIGOS[s].descricao}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function PaginaArtigo(): ReactNode {
  const {slug = ''} = useParams();
  const artigo = ARTIGOS[slug];
  const {hash} = useLocation();
  const [Conteudo, setConteudo] = useState<{slug: string; componente: MDXContent} | null>(null);
  useTituloPagina(artigo?.titulo);

  useEffect(() => {
    if (!artigo) return;
    let ativo = true;
    void artigo.carregar().then((m) => ativo && setConteudo({slug: artigo.slug, componente: m.default}));
    return () => {
      ativo = false;
    };
  }, [artigo]);

  const carregado = Conteudo?.slug === slug ? Conteudo.componente : null;

  // Âncoras (#secao) só existem depois que o artigo carrega.
  useEffect(() => {
    if (!carregado || !hash) return;
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [carregado, hash]);

  if (!artigo) return <NaoEncontrado />;

  const categoria = CATEGORIAS.find((c) => c.artigos.includes(slug));
  const irmaos = categoria?.artigos.filter((s) => ARTIGOS[s]) ?? [];
  const pos = irmaos.indexOf(slug);
  const anterior = pos > 0 ? ARTIGOS[irmaos[pos - 1]] : undefined;
  const proximo = pos >= 0 && pos < irmaos.length - 1 ? ARTIGOS[irmaos[pos + 1]] : undefined;
  const Componente = carregado;

  return (
    <div className={`container ${styles.pagina}`}>
      <article className="prosa">
        <p className={styles.trilha}>
          <Link to="/">Início</Link> / <Link to="/aprofundar">Aprofundar</Link>
          {categoria && <> / {categoria.titulo}</>}
        </p>
        <h1>{artigo.titulo}</h1>
        {artigo.descricao && <p className={styles.descricaoArtigo}>{artigo.descricao}</p>}
        {Componente ? (
          <MDXProvider components={COMPONENTES}>
            <Componente components={COMPONENTES} />
          </MDXProvider>
        ) : (
          <p aria-live="polite">Carregando…</p>
        )}
      </article>
      <nav className={styles.navArtigo} aria-label="Outros artigos">
        {anterior ? (
          <Link to={`/aprofundar/${anterior.slug}`} className={styles.atalho}>
            <span>← Anterior</span>
            <strong>{anterior.titulo}</strong>
          </Link>
        ) : (
          <span />
        )}
        {proximo && (
          <Link to={`/aprofundar/${proximo.slug}`} className={`${styles.atalho} ${styles.proximoArtigo}`}>
            <span>Próximo →</span>
            <strong>{proximo.titulo}</strong>
          </Link>
        )}
      </nav>
      <p className={styles.editar}>
        <a href={`${REPO_EDICAO}/${slug}.mdx`} target="_blank" rel="noopener noreferrer">
          Sugerir uma mudança neste artigo ↗
        </a>
      </p>
    </div>
  );
}
