import type {ReactNode} from 'react';
import ArvoreDecisao from '@/components/ArvoreDecisao';
import ChecklistAuditoria from '@/components/geradores/ChecklistAuditoria';
import GeradorAgentsMd from '@/components/geradores/GeradorAgentsMd';
import GeradorPermissoes from '@/components/geradores/GeradorPermissoes';
import BlocoCodigo from '@/components/ui/BlocoCodigo';
import Markdown from '@/components/ui/Markdown';
import {resolver, type Bloco, type Escolha, type Respostas} from '@/content/tipos';
import type {TipoProjeto} from '@/geradores/agentsMd';

const TITULO_AVISO = {info: 'Nota', tip: 'Dica', warning: 'Atenção', danger: 'Cuidado'} as const;

function projetoDe(r: Respostas): TipoProjeto | undefined {
  const p = r.projeto;
  return p === 'software' || p === 'dados' || p === 'infra' ? p : undefined;
}

export default function BlocoView({
  bloco,
  respostas,
  escolha,
}: {
  bloco: Bloco;
  respostas: Respostas;
  escolha: Escolha;
}): ReactNode {
  switch (bloco.tipo) {
    case 'prompt':
      return <BlocoCodigo variante="prompt" titulo={bloco.titulo} codigo={resolver(bloco.texto, respostas)} />;
    case 'arquivo':
      return (
        <BlocoCodigo
          titulo={bloco.arquivo}
          linguagem={bloco.linguagem}
          nomeArquivo={bloco.arquivo}
          codigo={resolver(bloco.conteudo, respostas)}
        />
      );
    case 'codigo':
      return <BlocoCodigo titulo={bloco.titulo} linguagem={bloco.linguagem} codigo={resolver(bloco.conteudo, respostas)} />;
    case 'lista':
      return (
        <div className="prosa">
          <p>
            <strong>{bloco.titulo}</strong>
          </p>
          <ul>
            {bloco.itens.map((item) => (
              <li key={item}>
                <Markdown inline>{item}</Markdown>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'aviso':
      return (
        <aside className={`callout callout-${bloco.nivel}`}>
          <span className="callout-titulo">{bloco.titulo ?? TITULO_AVISO[bloco.nivel]}</span>
          <Markdown>{resolver(bloco.texto, respostas)}</Markdown>
        </aside>
      );
    case 'checklist':
      return <ChecklistAuditoria id={bloco.checklist} />;
    case 'gerador':
      return bloco.gerador === 'agents-md' ? (
        <GeradorAgentsMd tipoInicial={projetoDe(respostas)} />
      ) : (
        <GeradorPermissoes ferramenta={escolha} projeto={projetoDe(respostas)} />
      );
    case 'arvore':
      return <ArvoreDecisao />;
  }
}
