import type {ReactNode} from 'react';
import {Link} from 'react-router';
import ArvoreDecisao from '@/components/ArvoreDecisao';
import {useTituloPagina} from '@/lib/useTituloPagina';
import perguntas from '@/components/roteiro/Perguntas.module.css';
import styles from './Paginas.module.css';

const OPCOES = [
  {
    para: '/estender/instrucao',
    rotulo: 'Uma instrução ou regra',
    descricao: 'Algo que o agente deve sempre seguir (ou nunca fazer) neste projeto.',
  },
  {
    para: '/estender/skill',
    rotulo: 'Um procedimento ou conhecimento',
    descricao: 'Uma skill: passos, checklists e scripts que o agente usa quando a tarefa pede.',
  },
  {
    para: '/estender/mcp',
    rotulo: 'Acesso a um sistema externo',
    descricao: 'Um servidor MCP: banco de dados, issue tracker, documentação, monitoramento.',
  },
  {
    para: '/estender/nao-sei',
    rotulo: 'Não sei',
    descricao: 'Responda sim ou não a algumas perguntas e descubra o mecanismo certo.',
  },
];

export function Estender(): ReactNode {
  useTituloPagina('Estender meu agente');
  return (
    <div className={`container ${perguntas.pagina}`}>
      <p className={perguntas.jornada}>Estender meu agente</p>
      <h1 className={perguntas.pergunta}>O que você quer acrescentar?</h1>
      <p className={perguntas.ajuda}>Cada opção leva a um roteiro próprio.</p>
      <div className={perguntas.opcoes}>
        {OPCOES.map((o) => (
          <Link key={o.para} to={o.para} className={perguntas.opcao}>
            <strong>{o.rotulo}</strong>
            <span>{o.descricao}</span>
          </Link>
        ))}
      </div>
      <Link to="/" className="botao botao-link">
        ← Voltar
      </Link>
    </div>
  );
}

export function EstenderNaoSei(): ReactNode {
  useTituloPagina('Onde coloco isso?');
  return (
    <div className={`container ${perguntas.pagina}`}>
      <p className={perguntas.jornada}>Estender meu agente</p>
      <h1 className={perguntas.pergunta}>Onde coloco isso?</h1>
      <p className={perguntas.ajuda}>
        Pense no que você quer ensinar ao agente e responda. No fim, você recebe o mecanismo recomendado e o roteiro
        correspondente.
      </p>
      <div className={styles.arvore}>
        <ArvoreDecisao />
      </div>
      <Link to="/estender" className="botao botao-link">
        ← Voltar
      </Link>
    </div>
  );
}
