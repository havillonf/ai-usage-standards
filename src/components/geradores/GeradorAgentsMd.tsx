import {useId, useMemo, useState, type ReactNode} from 'react';
import BlocoCodigo from '@/components/ui/BlocoCodigo';
import {exemploAgentsMd, gerarAgentsMd, type DadosAgentsMd, type TipoProjeto} from '@/geradores/agentsMd';
import styles from './Gerador.module.css';

const TIPOS: {valor: TipoProjeto; rotulo: string}[] = [
  {valor: 'software', rotulo: 'Software'},
  {valor: 'dados', rotulo: 'Análise de dados'},
  {valor: 'infra', rotulo: 'Infraestrutura'},
];

/** Formulário que monta um AGENTS.md com prévia ao vivo. */
export default function GeradorAgentsMd({tipoInicial = 'software'}: {tipoInicial?: TipoProjeto}): ReactNode {
  const id = useId();
  const [tipo, setTipo] = useState<TipoProjeto>(tipoInicial);
  const [dados, setDados] = useState<DadosAgentsMd>(() => exemploAgentsMd(tipoInicial));
  const resultado = useMemo(() => gerarAgentsMd(dados), [dados]);

  const trocarTipo = (t: TipoProjeto) => {
    setTipo(t);
    setDados((d) => ({...exemploAgentsMd(t), nome: d.nome, descricao: d.descricao}));
  };
  const campo = <K extends keyof DadosAgentsMd>(k: K, v: DadosAgentsMd[K]) => setDados((d) => ({...d, [k]: v}));
  const comando = (k: keyof DadosAgentsMd['comandos'], v: string) =>
    setDados((d) => ({...d, comandos: {...d.comandos, [k]: v}}));

  return (
    <div className={styles.envoltorio}>
      <div className={styles.gerador}>
        <form className={styles.formulario} onSubmit={(e) => e.preventDefault()} aria-label="Dados do AGENTS.md">
          <fieldset className={styles.grupo}>
            <legend>Tipo de projeto</legend>
            <div className={styles.opcoes}>
              {TIPOS.map((t) => (
                <label key={t.valor} className={styles.opcao}>
                  <input
                    type="radio"
                    name={`${id}-tipo`}
                    checked={tipo === t.valor}
                    onChange={() => trocarTipo(t.valor)}
                  />
                  {t.rotulo}
                </label>
              ))}
            </div>
            <p className={styles.dica}>Trocar o tipo recarrega os exemplos de comandos e convenções.</p>
          </fieldset>

          <label className={styles.rotulo}>
            Nome do projeto
            <input value={dados.nome} onChange={(e) => campo('nome', e.target.value)} placeholder="API de agendamento" />
          </label>
          <label className={styles.rotulo}>
            Descrição em uma frase
            <input
              value={dados.descricao}
              onChange={(e) => campo('descricao', e.target.value)}
              placeholder="O que o projeto faz e para quem"
            />
          </label>

          <fieldset className={styles.grupo}>
            <legend>Comandos (deixe em branco o que não se aplica)</legend>
            {(
              [
                ['instalar', 'Instalar dependências'],
                ['testar', 'Rodar os testes'],
                ['testeUnico', 'Rodar um teste só'],
                ['lint', 'Lint / formatação'],
                ['build', 'Build'],
              ] as const
            ).map(([k, rotulo]) => (
              <label key={k} className={styles.rotulo}>
                {rotulo}
                <input className={styles.mono} value={dados.comandos[k]} onChange={(e) => comando(k, e.target.value)} />
              </label>
            ))}
          </fieldset>

          {(
            [
              ['convencoes', 'Convenções que fogem do padrão', 'Uma por linha'],
              ['arquitetura', 'Arquitetura (decisões próprias do projeto)', 'Uma por linha'],
              ['naoMexer', 'Não mexer', 'Código gerado, migrações aplicadas…'],
              ['git', 'Git (branches, commits, PRs)', 'Uma por linha'],
            ] as const
          ).map(([k, rotulo, dica]) => (
            <label key={k} className={styles.rotulo}>
              {rotulo}
              <textarea rows={3} value={dados[k]} onChange={(e) => campo(k, e.target.value)} placeholder={dica} />
            </label>
          ))}

          <label className={styles.opcao}>
            <input
              type="checkbox"
              checked={dados.declararAgente}
              onChange={(e) => campo('declararAgente', e.target.checked)}
            />
            Pedir que o agente declare o próprio uso nos commits (regra R6)
          </label>
          <p className={styles.alerta}>
            Nunca coloque segredos, tokens ou senhas no AGENTS.md (regra R2).
          </p>
        </form>

        <div className={styles.previa}>
          <BlocoCodigo codigo={resultado} titulo="AGENTS.md" linguagem="markdown" nomeArquivo="AGENTS.md" />
          <p className={styles.dica}>
            {resultado.split('\n').length} linhas. Mantenha o arquivo curto: ele é carregado em toda sessão.
          </p>
        </div>
      </div>
    </div>
  );
}
