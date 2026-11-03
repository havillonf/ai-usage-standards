import {useId, useMemo, useState, type ReactNode} from 'react';
import BlocoCodigo from '@/components/ui/BlocoCodigo';
import Markdown from '@/components/ui/Markdown';
import type {Escolha} from '@/content/tipos';
import {PERGUNTA_FERRAMENTA, PERGUNTA_PROJETO} from '@/content/perguntas';
import type {TipoProjeto} from '@/geradores/agentsMd';
import {comandosSugeridos, gerarPermissoes} from '@/geradores/permissoes';
import styles from './Gerador.module.css';

/**
 * Gera a configuração de permissões segura para a ferramenta e o tipo de
 * projeto. Dentro de um roteiro, recebe a ferramenta e o projeto já escolhidos;
 * avulso, mostra os seletores.
 */
export default function GeradorPermissoes({
  ferramenta: ferramentaFixa,
  projeto: projetoFixo,
}: {
  ferramenta?: Escolha;
  projeto?: TipoProjeto;
}): ReactNode {
  const id = useId();
  const [ferramenta, setFerramenta] = useState<Escolha>(ferramentaFixa ?? 'opencode');
  const [projeto, setProjeto] = useState<TipoProjeto>(projetoFixo ?? 'software');
  const [permitidos, setPermitidos] = useState(() => comandosSugeridos(projetoFixo ?? 'software').join('\n'));
  const [pushComConfirmacao, setPush] = useState(true);

  const f = ferramentaFixa ?? ferramenta;
  const p = projetoFixo ?? projeto;
  const resultado = useMemo(
    () => gerarPermissoes({ferramenta: f, projeto: p, permitidos: permitidos.split('\n'), pushComConfirmacao}),
    [f, p, permitidos, pushComConfirmacao],
  );

  const trocarProjeto = (novo: TipoProjeto) => {
    setProjeto(novo);
    setPermitidos(comandosSugeridos(novo).join('\n'));
  };

  return (
    <div className={styles.envoltorio}>
      <div className={styles.gerador}>
        <form className={styles.formulario} onSubmit={(e) => e.preventDefault()} aria-label="Opções de permissão">
          {!ferramentaFixa && (
            <label className={styles.rotulo}>
              Ferramenta
              <select value={ferramenta} onChange={(e) => setFerramenta(e.target.value as Escolha)}>
                {PERGUNTA_FERRAMENTA.opcoes.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.rotulo}
                  </option>
                ))}
              </select>
            </label>
          )}
          {!projetoFixo && (
            <label className={styles.rotulo}>
              Tipo de projeto
              <select value={projeto} onChange={(e) => trocarProjeto(e.target.value as TipoProjeto)}>
                {PERGUNTA_PROJETO.opcoes.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.rotulo}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className={styles.rotulo}>
            Comandos que o agente pode rodar sem pedir (um por linha)
            <textarea
              className={styles.mono}
              rows={4}
              value={permitidos}
              onChange={(e) => setPermitidos(e.target.value)}
            />
          </label>
          <fieldset className={styles.grupo}>
            <legend>
              <code>git push</code>
            </legend>
            <label className={styles.opcao}>
              <input
                type="radio"
                name={`${id}-push`}
                checked={pushComConfirmacao}
                onChange={() => setPush(true)}
              />
              Pedir confirmação
            </label>
            <label className={styles.opcao}>
              <input
                type="radio"
                name={`${id}-push`}
                checked={!pushComConfirmacao}
                onChange={() => setPush(false)}
              />
              Bloquear (o push é sempre feito por você)
            </label>
          </fieldset>
          <p className={styles.dica}>
            Sempre incluídos: bloqueio de leitura de <code>.env</code>, <code>secrets/</code> e chaves (R2), e negação
            de comandos destrutivos{p === 'infra' ? ', inclusive apply/destroy/delete de infraestrutura (R4)' : ''}.
          </p>
        </form>

        <div className={styles.previa}>
          {resultado.linguagem === 'json' ? (
            <BlocoCodigo
              codigo={resultado.conteudo}
              titulo={resultado.arquivo}
              linguagem="json"
              nomeArquivo={resultado.arquivo}
            />
          ) : (
            <div className={`${styles.lista} prosa`}>
              <Markdown>{resultado.conteudo}</Markdown>
            </div>
          )}
          <ul className={styles.observacoes}>
            {resultado.observacoes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
