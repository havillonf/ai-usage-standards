import {useState, type ReactNode} from 'react';
import styles from './Checklist.module.css';

// Checklists de revisão exigidos pela regra R5 antes de usar skills e
// servidores MCP de terceiros.

export const CHECKLISTS = {
  'auditoria-skill': {
    titulo: 'Auditoria da skill (R5)',
    itens: [
      'Sei quem publica a skill, e a fonte é confiável (repositório oficial, autor conhecido).',
      'A skill tem licença compatível com o uso no projeto.',
      'Li o SKILL.md inteiro: as instruções fazem só o que a descrição promete.',
      'Não há instruções para ler credenciais, enviar dados para fora ou desativar verificações.',
      'Li todos os scripts: sei o que executam, quais arquivos leem e escrevem e que rede acessam.',
      'Não há permissões pré-aprovadas amplas (ex.: allowed-tools) nem comandos executados automaticamente sem necessidade.',
      'A skill está ativa/mantida, ou estou disposto a mantê-la eu mesmo.',
    ],
  },
  'auditoria-mcp': {
    titulo: 'Auditoria do servidor MCP (R5)',
    itens: [
      'O servidor é oficial do fornecedor do sistema ou de uma fonte reconhecida.',
      'Sei quais ferramentas (tools) ele expõe e se alguma escreve ou apaga dados.',
      'Consigo dar a ele um token com escopo mínimo (de preferência somente leitura).',
      'A versão está fixada (servidores locais) e sei como revisar atualizações.',
      'Sei de onde vêm os dados que ele devolve; se vierem de fontes externas, trato como não confiáveis (prompt injection).',
      'A credencial fica em variável de ambiente, não escrita em arquivo versionado.',
      'Vou habilitá-lo só neste projeto, não globalmente.',
    ],
  },
} as const;

export type IdChecklist = keyof typeof CHECKLISTS;

export default function ChecklistAuditoria({id}: {id: IdChecklist}): ReactNode {
  const lista = CHECKLISTS[id];
  const [marcados, setMarcados] = useState<ReadonlySet<number>>(new Set());
  const completo = marcados.size === lista.itens.length;

  const alternar = (i: number) =>
    setMarcados((m) => {
      const n = new Set(m);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <fieldset className={styles.checklist}>
      <legend className={styles.titulo}>{lista.titulo}</legend>
      <ul className={styles.itens}>
        {lista.itens.map((item, i) => (
          <li key={item}>
            <label className={styles.item}>
              <input type="checkbox" checked={marcados.has(i)} onChange={() => alternar(i)} />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className={completo ? styles.ok : styles.pendente} aria-live="polite">
        {completo
          ? '✓ Todos os itens verificados. Pode seguir para a instalação.'
          : `${marcados.size} de ${lista.itens.length} verificados. Se algum item não puder ser confirmado, não instale.`}
      </p>
    </fieldset>
  );
}
