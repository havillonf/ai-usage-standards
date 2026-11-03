import type {ReactNode} from 'react';
import {Link} from 'react-router';
import {useTituloPagina} from '@/lib/useTituloPagina';
import styles from './Paginas.module.css';

export default function NaoEncontrado(): ReactNode {
  useTituloPagina('Página não encontrada');
  return (
    <div className={`container ${styles.pagina}`}>
      <div className="prosa">
        <h1>Página não encontrada</h1>
        <p>O endereço pode ter mudado. Comece pela página inicial ou use a busca.</p>
        <p>
          <Link to="/" className="botao botao-primario">
            Ir para o início
          </Link>
        </p>
      </div>
    </div>
  );
}
