import './Traumas.css'

const STATS = [
  {
    label: 'MARCAS REGISTRADAS',
    value: '3 ATIVAS',
    tone: 'white',
  },
  {
    label: 'SEVERIDADE MÉDIA',
    value: 'ALTA',
    tone: 'magenta',
  },
  {
    label: 'CARGA EMOCIONAL',
    value: '47%',
    tone: 'magenta',
  },
  {
    label: 'REGULAÇÃO',
    value: 'EM CURSO',
    tone: 'amber',
  },
]

const TRAUMAS = [
  {
    id: 'TRM-01',
    title: 'PERDA SEM DESPEDIDA',
    level: 'CRÍTICA',
    type: 'LUTO NÃO RESOLVIDO',
    registro: 'Março · 2015',
    integrity: 31,
    integrityLabel: 'PROCESSAMENTO',
    fragment:
      'Ainda espero a mensagem que nunca chegou. O corpo reage como se o adeus pudesse ser desfeito — e o silêncio volta a ocupar o quarto.',
    tags: ['#luto', '#ausencia', '#familia'],
  },
  {
    id: 'TRM-02',
    title: 'ABANDONO AFETIVO',
    level: 'ALTA',
    type: 'VÍNCULO ROMPIDO',
    registro: 'Abril · 2019',
    integrity: 48,
    integrityLabel: 'PROCESSAMENTO',
    fragment:
      'Aprendi cedo a não pedir demais. Quando alguém se afasta, a mesma certeza retorna: eu era demais — ou nunca fui o suficiente.',
    tags: ['#abandono', '#medo', '#vinculo'],
  },
  {
    id: 'TRM-03',
    title: 'MEDO DE FALHAR EM PÚBLICO',
    level: 'ALTA',
    type: 'ANSIEDADE / VERGONHA',
    registro: 'Setembro · 2021',
    integrity: 52,
    integrityLabel: 'PROCESSAMENTO',
    fragment:
      'Um olhar, um riso, um erro pequeno — e o peito aperta. A cena antiga se sobrepõe ao presente como se o julgamento nunca tivesse acabado.',
    tags: ['#ansiedade', '#vergonha', '#infancia'],
  },
]

const LOGS = [
  {
    t: '14:09:01',
    level: 'CRITICAL',
    msg: 'Gatilho de luto identificado — intensificação de tristeza e evitação',
  },
  {
    t: '14:09:07',
    level: 'WARNING',
    msg: 'Padrão de autoacusação ativado após lembrança de abandono',
  },
  {
    t: '14:09:12',
    level: 'NORMAL',
    msg: 'Respiração e aterramento aplicados — arousal em queda',
  },
  {
    t: '14:09:18',
    level: 'WARNING',
    msg: 'Flashback parcial de vergonha escolar — duração ~40s',
  },
  {
    t: '14:09:24',
    level: 'CRITICAL',
    msg: 'Carga emocional agregada em 47% — atenção recomendada',
  },
  {
    t: '14:09:31',
    level: 'NORMAL',
    msg: 'Registro afetivo salvo no diário de processamento',
  },
  {
    t: '14:09:38',
    level: 'WARNING',
    msg: 'Evitar isolamento prolongado nas próximas 24h',
  },
]

export function Traumas() {
  return (
    <main className="traumas" id="traumas">
      <section className="traumas-stats" aria-label="Panorama emocional">
        {STATS.map((stat) => (
          <article key={stat.label} className={`traumas-stat tone-${stat.tone}`}>
            <p className="traumas-stat-label">{stat.label}</p>
            <p className="traumas-stat-value">{stat.value}</p>
          </article>
        ))}
      </section>

      <div className="traumas-layout">
        <section className="traumas-main" aria-label="Traumas pessoais">
          <h2 className="traumas-section-title">
            <span aria-hidden="true">♦</span> MAPA DE FERIDAS E MARCAS PSICOLÓGICAS
          </h2>

          <ul className="traumas-list">
            {TRAUMAS.map((trauma) => (
              <li key={trauma.id} className="traumas-card">
                <header className="traumas-card-head">
                  <div className="traumas-card-title-row">
                    <span className="traumas-card-id">[{trauma.id}]</span>
                    <h3 className="traumas-card-title">{trauma.title}</h3>
                  </div>
                  <span className="traumas-card-level">NÍVEL: {trauma.level}</span>
                </header>

                <dl className="traumas-card-meta">
                  <div>
                    <dt>TIPO</dt>
                    <dd>{trauma.type}</dd>
                  </div>
                  <div>
                    <dt>ÉPOCA</dt>
                    <dd>{trauma.registro}</dd>
                  </div>
                </dl>

                <div className="traumas-integrity">
                  <div className="traumas-integrity-label">
                    <span>{trauma.integrityLabel}</span>
                    <span>{trauma.integrity}%</span>
                  </div>
                  <div className="traumas-integrity-track">
                    <span style={{ width: `${trauma.integrity}%` }} />
                  </div>
                </div>

                <div className="traumas-fragment">
                  <p>
                    <span className="traumas-prompt">&gt; RELATO:</span> “{trauma.fragment}”
                  </p>
                </div>

                <div className="traumas-tags">
                  {trauma.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="traumas-log" aria-label="Diário de regulação">
          <header className="traumas-log-head">
            <h2>DIÁRIO DE REGULAÇÃO</h2>
            <span className="traumas-log-live" aria-hidden="true" />
          </header>

          <ul className="traumas-log-list">
            {LOGS.map((entry) => (
              <li key={`${entry.t}-${entry.msg}`} className={`level-${entry.level.toLowerCase()}`}>
                <p className="traumas-log-meta">
                  [{entry.t}] // <span>{entry.level}</span>
                </p>
                <p className="traumas-log-msg">{entry.msg}</p>
              </li>
            ))}
          </ul>

          <footer className="traumas-log-foot">
            <span>ESTADO EMOCIONAL:</span>
            <strong>EM PROCESSAMENTO</strong>
          </footer>
        </aside>
      </div>
    </main>
  )
}

export default Traumas
