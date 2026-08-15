import './Traumas.css'

const STATS = [
  {
    label: 'TRAUMAS REGISTRADOS',
    value: '3 REGISTROS',
    tone: 'white',
  },
  {
    label: 'NÍVEL DE SEVERIDADE',
    value: 'CRÍTICO',
    tone: 'magenta',
  },
  {
    label: 'IMPACTO NEURAL',
    value: '47.00%',
    tone: 'magenta',
  },
  {
    label: 'PROTOCOLO DE CONTENÇÃO',
    value: 'ATIVO',
    tone: 'amber',
  },
]

const TRAUMAS = [
  {
    id: 'TRM-0xA1F2',
    title: 'PERDA SÚBITA',
    level: 'CRÍTICA',
    type: 'RUPTURA AFETIVA',
    registro: '2015-11-03 · 02:17:44',
    integrity: 31,
    fragment:
      'O sinal corta no meio da frase. Há um buraco onde deveria haver um rosto — o índice marca NULL e se recusa a reconstruir.',
    tags: ['#perda', '#luto', '#ruptura'],
  },
  {
    id: 'TRM-0xB83C',
    title: 'FALHA DE ÂNCORA',
    level: 'ALTA',
    type: 'DESORIENTAÇÃO',
    registro: '2019-04-21 · 23:08:11',
    integrity: 48,
    fragment:
      'Coordenadas emocionais desalinhadas. O vault tenta remapear a âncora, mas o checksum da sessão original não confere.',
    tags: ['#desconexao', '#ancora', '#alerta'],
  },
  {
    id: 'TRM-0xC01E',
    title: 'ECO RECORRENTE',
    level: 'ALTA',
    type: 'LOOP MNÊMICO',
    registro: '2021-09-30 · 06:41:02',
    integrity: 52,
    fragment:
      'O mesmo fragmento replaya a cada 00:17. Contenção parcial — o loop foi isolado, mas ainda consome banda cognitiva.',
    tags: ['#loop', '#eco', '#contencao'],
  },
]

const LOGS = [
  {
    t: '14:09:01',
    level: 'CRITICAL',
    msg: 'TRM-0xA1F2 excedeu limiar de integridade (31%)',
  },
  {
    t: '14:09:07',
    level: 'WARNING',
    msg: 'Protocolo de contenção engajado — isolamento setorial',
  },
  {
    t: '14:09:12',
    level: 'NORMAL',
    msg: 'Neural link estável · latência 14ms',
  },
  {
    t: '14:09:18',
    level: 'WARNING',
    msg: 'Eco recorrente detectado em cluster 0xC01E',
  },
  {
    t: '14:09:24',
    level: 'CRITICAL',
    msg: 'Impacto neural agregado: 47.00%',
  },
  {
    t: '14:09:31',
    level: 'NORMAL',
    msg: 'Dump de diagnóstico gravado em /vault/trm/',
  },
  {
    t: '14:09:38',
    level: 'WARNING',
    msg: 'Operador MONITOR-01 autenticado na seção TRAUMAS',
  },
]

export function Traumas() {
  return (
    <main className="traumas" id="traumas">
      <section className="traumas-stats" aria-label="Métricas de traumas">
        {STATS.map((stat) => (
          <article key={stat.label} className={`traumas-stat tone-${stat.tone}`}>
            <p className="traumas-stat-label">{stat.label}</p>
            <p className="traumas-stat-value">{stat.value}</p>
          </article>
        ))}
      </section>

      <div className="traumas-layout">
        <section className="traumas-main" aria-label="Diagnóstico neural">
          <h2 className="traumas-section-title">
            <span aria-hidden="true">♦</span> DIAGNÓSTICO E MAPEAMENTO DE EXCEÇÃO NEURAL
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
                    <dt>REGISTRO</dt>
                    <dd>{trauma.registro}</dd>
                  </div>
                </dl>

                <div className="traumas-integrity">
                  <div className="traumas-integrity-label">
                    <span>INTEGRIDADE DE MEMÓRIA</span>
                    <span>{trauma.integrity}%</span>
                  </div>
                  <div className="traumas-integrity-track">
                    <span style={{ width: `${trauma.integrity}%` }} />
                  </div>
                </div>

                <div className="traumas-fragment">
                  <p>
                    <span className="traumas-prompt">&gt; FRAGMENT_OUTPUT:</span>{' '}
                    “{trauma.fragment}”
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

        <aside className="traumas-log" aria-label="Log de contenção">
          <header className="traumas-log-head">
            <h2>LOG DE CONTENÇÃO</h2>
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
            <span>SISTEMA DE SEGURANÇA:</span>
            <strong>ALERTA MÁXIMO</strong>
          </footer>
        </aside>
      </div>
    </main>
  )
}

export default Traumas
