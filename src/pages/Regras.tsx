import type {ReactNode} from 'react';
import {Link} from 'react-router';
import {ListaRegras} from '@/components/Regra';
import {useTituloPagina} from '@/lib/useTituloPagina';
import styles from './Paginas.module.css';

export default function Regras(): ReactNode {
  useTituloPagina('Regras obrigatórias');
  return (
    <div className={`container ${styles.pagina}`}>
      <div className="prosa">
        <p className={styles.trilha}>
          <Link to="/">Início</Link> / Regras
        </p>
        <h1>Regras obrigatórias</h1>
        <p>
          Estas são as únicas <strong>regras obrigatórias</strong> do guia; todo o resto é recomendação. Elas valem
          para <strong>qualquer ferramenta e qualquer modelo</strong> e cobrem o que não pode dar errado: sempre há
          uma pessoa responsável, credenciais ficam fora do contexto, o agente começa com o mínimo de poder, ações
          irreversíveis têm aprovação humana, nada de terceiros entra sem revisão e o uso de agentes é declarado.
        </p>
        <aside className="callout callout-warning">
          <span className="callout-titulo">Proposta</span>
          <p>
            As regras abaixo aguardam aprovação da coordenação do ATLab. Quando uma regra for aprovada, o selo muda
            para <em>Aprovada</em>.
          </p>
        </aside>
        <p className={styles.legenda}>
          <strong>DEVE / NÃO DEVE</strong>: obrigatório, sem exceção sem aprovação da coordenação ·{' '}
          <strong>DEVERIA</strong>: recomendação forte (no espírito da{' '}
          <a href="https://www.rfc-editor.org/rfc/rfc2119" target="_blank" rel="noopener noreferrer">
            RFC 2119
          </a>
          )
        </p>
      </div>
      <ListaRegras />
    </div>
  );
}
