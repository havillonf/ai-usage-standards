import {useState, type ReactNode} from 'react';
import {Link} from 'react-router';
import styles from './styles.module.css';

// Árvore "onde colocar isto?": hook, AGENTS.md, MCP, skill, comando ou prompt.

interface Pergunta {
  tipo: 'pergunta';
  texto: string;
  ajuda: string;
  sim: string;
  nao: string;
}

interface Resultado {
  tipo: 'resultado';
  titulo: string;
  texto: string;
  link: string;
  /** Rótulo do link: roteiro guiado ou artigo. */
  acao: string;
}

const NOS: Record<string, Pergunta | Resultado> = {
  inicio: {
    tipo: 'pergunta',
    texto: 'Precisa acontecer sempre, sem exceção, de forma determinística?',
    ajuda: 'Ex.: formatar o código após cada edição, bloquear escrita em uma pasta, rodar o linter antes de terminar.',
    sim: 'hook',
    nao: 'sempre',
  },
  sempre: {
    tipo: 'pergunta',
    texto: 'É uma informação curta que vale para toda sessão neste projeto?',
    ajuda: 'Ex.: comandos de build e teste, convenções que fogem do padrão, armadilhas conhecidas do repositório.',
    sim: 'agents',
    nao: 'externo',
  },
  externo: {
    tipo: 'pergunta',
    texto: 'O agente precisa acessar um sistema externo ou dados ao vivo?',
    ajuda: 'Ex.: banco de dados, issue tracker, documentação interna, monitoramento.',
    sim: 'mcp',
    nao: 'procedimento',
  },
  procedimento: {
    tipo: 'pergunta',
    texto: 'É um procedimento de várias etapas ou conhecimento que só importa em algumas tarefas?',
    ajuda: 'Ex.: como gerar um relatório no formato do lab, como migrar um módulo, checklist de release.',
    sim: 'quem',
    nao: 'prompt',
  },
  quem: {
    tipo: 'pergunta',
    texto: 'O agente deve decidir sozinho quando usar?',
    ajuda: 'Responda "não" se o procedimento tem efeitos colaterais e só deve rodar quando você pedir.',
    sim: 'skill',
    nao: 'comando',
  },
  hook: {
    tipo: 'resultado',
    titulo: 'Hook',
    texto:
      'Instruções em texto são sugestões que o modelo pode ignorar. Para garantir que algo aconteça (ou nunca aconteça), use um hook ou uma regra de permissão, que são executados pela ferramenta, não pelo modelo.',
    link: '/estender/instrucao',
    acao: 'Abrir o roteiro de instruções e garantias',
  },
  agents: {
    tipo: 'resultado',
    titulo: 'AGENTS.md',
    texto:
      'Coloque no AGENTS.md do repositório. Mantenha o arquivo curto: cada linha consome contexto em toda sessão.',
    link: '/estender/instrucao',
    acao: 'Abrir o roteiro de instruções',
  },
  mcp: {
    tipo: 'resultado',
    titulo: 'Servidor MCP (ou CLI existente)',
    texto:
      'Use um servidor MCP confiável. Se já existe uma CLI para o sistema (gh, kubectl, psql…), ela costuma ser mais simples e econômica em contexto.',
    link: '/estender/mcp',
    acao: 'Abrir o roteiro de MCP',
  },
  skill: {
    tipo: 'resultado',
    titulo: 'Skill',
    texto:
      'Empacote como skill: só o nome e a descrição ficam sempre no contexto; o resto é carregado quando a tarefa pede. Antes de escrever do zero, procure uma skill pronta e adapte.',
    link: '/estender/skill',
    acao: 'Abrir o roteiro de skills',
  },
  comando: {
    tipo: 'resultado',
    titulo: 'Comando / prompt salvo',
    texto:
      'Use um comando ou workflow invocado manualmente (ou uma skill com invocação automática desativada).',
    link: '/aprofundar/quando-usar-o-que',
    acao: 'Ler mais',
  },
  prompt: {
    tipo: 'resultado',
    titulo: 'Só o prompt',
    texto:
      'Provavelmente não precisa de nenhum mecanismo: escreva no próprio pedido. Se você se pegar repetindo a mesma instrução, volte a esta árvore.',
    link: '/aprofundar/ciclo-de-trabalho',
    acao: 'Ler sobre o ciclo de trabalho',
  },
};

export default function ArvoreDecisao(): ReactNode {
  const [caminho, setCaminho] = useState<string[]>(['inicio']);
  const atual = NOS[caminho[caminho.length - 1]];

  const ir = (proximo: string) => setCaminho([...caminho, proximo]);
  const voltar = () => setCaminho(caminho.slice(0, -1));
  const recomecar = () => setCaminho(['inicio']);

  return (
    <div className={styles.arvore} aria-live="polite">
      <div className={styles.passo}>
        Passo {caminho.length}
        {atual.tipo === 'resultado' && ' — recomendação'}
      </div>
      {atual.tipo === 'pergunta' ? (
        <>
          <p className={styles.pergunta}>{atual.texto}</p>
          <p className={styles.ajuda}>{atual.ajuda}</p>
          <div className={styles.botoes}>
            <button type="button" className="botao botao-primario" onClick={() => ir(atual.sim)}>
              Sim
            </button>
            <button type="button" className="botao" onClick={() => ir(atual.nao)}>
              Não
            </button>
          </div>
        </>
      ) : (
        <>
          <p className={styles.resultado}>{atual.titulo}</p>
          <p>{atual.texto}</p>
          <Link className="botao botao-primario" to={atual.link}>
            {atual.acao} →
          </Link>
        </>
      )}
      {caminho.length > 1 && (
        <div className={styles.navegacao}>
          <button type="button" className="botao botao-link botao-pequeno" onClick={voltar}>
            ← Voltar
          </button>
          <button type="button" className="botao botao-link botao-pequeno" onClick={recomecar}>
            Recomeçar
          </button>
        </div>
      )}
    </div>
  );
}
