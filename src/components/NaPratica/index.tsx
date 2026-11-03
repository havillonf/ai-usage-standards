import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useId,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import clsx from 'clsx';
import {FERRAMENTAS, type FerramentaId} from '@/data/ferramentas';
import styles from './styles.module.css';

interface TabItemProps {
  value: FerramentaId;
  children?: ReactNode;
}

/** Conteúdo de uma aba de <NaPratica>. */
export function TabItem({children}: TabItemProps): ReactNode {
  return <>{children}</>;
}

// A aba escolhida é compartilhada entre os blocos durante a visita (só em
// memória; nada é salvo no navegador).
const AbaContexto = createContext<{aba: FerramentaId | null; setAba: (f: FerramentaId) => void}>({
  aba: null,
  setAba: () => {},
});

export function ProvedorAbas({children}: {children: ReactNode}): ReactNode {
  const [aba, setAba] = useState<FerramentaId | null>(null);
  return <AbaContexto.Provider value={{aba, setAba}}>{children}</AbaContexto.Provider>;
}

/**
 * Bloco "Na prática" dos artigos: abas com o passo a passo de cada ferramenta.
 *
 *   <NaPratica>
 *     <TabItem value="opencode">…</TabItem>
 *     <TabItem value="cline">…</TabItem>
 *   </NaPratica>
 */
export default function NaPratica({
  titulo = 'Na prática',
  children,
}: {
  titulo?: string;
  children: ReactNode;
}): ReactNode {
  const {aba, setAba} = useContext(AbaContexto);
  const id = useId();
  const ordem = new Map(FERRAMENTAS.map((f, i) => [f.id as string, i]));
  const itens = Children.toArray(children)
    .filter((c): c is ReactElement<TabItemProps> => isValidElement(c))
    .sort((a, b) => (ordem.get(a.props.value) ?? 99) - (ordem.get(b.props.value) ?? 99));
  for (const item of itens) {
    if (!ordem.has(item.props.value)) {
      throw new Error(`<NaPratica>: aba "${item.props.value}" desconhecida.`);
    }
  }
  const ativa = itens.find((i) => i.props.value === aba) ?? itens[0];
  if (!ativa) return null;

  return (
    <div className={styles.bloco}>
      <div className={styles.titulo}>{titulo}</div>
      <div role="tablist" className={styles.abas} aria-label={titulo}>
        {itens.map((item) => {
          const selecionada = item === ativa;
          return (
            <button
              key={item.props.value}
              type="button"
              role="tab"
              id={`${id}-${item.props.value}`}
              aria-selected={selecionada}
              aria-controls={`${id}-painel`}
              className={clsx(styles.aba, selecionada && styles.abaAtiva)}
              onClick={() => setAba(item.props.value)}>
              {FERRAMENTAS.find((f) => f.id === item.props.value)!.nome}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${id}-painel`}
        aria-labelledby={`${id}-${ativa.props.value}`}
        className={styles.painel}>
        {ativa.props.children}
      </div>
    </div>
  );
}
