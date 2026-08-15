import { useState } from 'react'
import './Memorias.css'

const MEMORIES = [
  {
    id: 'MEM-0x7A3F',
    title: 'PRIMEIRA INFÂNCIA',
    year: 2009,
    date: '2009-03-14',
    type: 'EPISÓDICA',
    size: '2.4 GB',
    integrity: 94,
    status: 'estavel',
    statusLabel: 'ESTÁVEL',
    tags: ['#familia', '#afeto'],
    fragment:
      'A luz da manhã atravessava a cortina amarela. Alguém ria no corredor — e por um instante o mundo cabia numa janela.',
    nodeColor: 'green',
  },
  {
    id: 'MEM-0x91B2',
    title: 'PROTOCOLO ESCOLAR',
    year: 2012,
    date: '2012-08-22',
    type: 'PROCEDURAL',
    size: '1.1 GB',
    integrity: 81,
    status: 'estavel',
    statusLabel: 'ESTÁVEL',
    tags: ['#rotina', '#aprendizado'],
    fragment:
      'Corredores longos, cheiro de giz. O sinal ecoava como um checkpoint — reiniciar, avançar, gravar.',
    nodeColor: 'green',
  },
  {
    id: 'MEM-0xB21C',
    title: 'COLAPSO / EVENTO-17',
    year: 2015,
    date: '2015-11-03',
    type: 'TRAUMÁTICA',
    size: '4.8 GB',
    integrity: 42,
    status: 'critico',
    statusLabel: 'CRÍTICO',
    tags: ['#ruptura', '#alerta'],
    fragment:
      'Fragmentos desalinhados. O áudio corta. Há um gap de 00:17 onde o índice se recusa a reconstruir.',
    nodeColor: 'red',
  },
  {
    id: 'MEM-0xC44E',
    title: 'NOITE NA REDE',
    year: 2017,
    date: '2017-06-19',
    type: 'EPISÓDICA',
    size: '3.2 GB',
    integrity: 68,
    status: 'aviso',
    statusLabel: 'AVISO',
    tags: ['#cidade', '#neon'],
    fragment:
      'Telas refletidas na chuva. Um handle desconhecido piscou no chat — e sumiu antes do dump completar.',
    nodeColor: 'yellow',
  },
  {
    id: 'MEM-0xD01A',
    title: 'LINK AFETIVO',
    year: 2019,
    date: '2019-02-14',
    type: 'EMOCIONAL',
    size: '1.7 GB',
    integrity: 88,
    status: 'estavel',
    statusLabel: 'ESTÁVEL',
    tags: ['#vinculo', '#sinal'],
    fragment:
      'Dois pulsos sincronizados. O vault marcou a sessão como âncora — baixa perda, alta saliência.',
    nodeColor: 'green',
  },
  {
    id: 'MEM-0xE77F',
    title: 'FALHA DE BOOT',
    year: 2021,
    date: '2021-09-30',
    type: 'SISTEMA',
    size: '0.9 GB',
    integrity: 55,
    status: 'aviso',
    statusLabel: 'AVISO',
    tags: ['#kernel', '#recovery'],
    fragment:
      'Stack trace incompleto. Memória volátil evaporou antes do snapshot. Resta um checksum e uma data.',
    nodeColor: 'orange',
  },
  {
    id: 'MEM-0xF9A0',
    title: 'ÚLTIMO CHECKPOINT',
    year: 2024,
    date: '2024-01-08',
    type: 'EPISÓDICA',
    size: '2.0 GB',
    integrity: 76,
    status: 'estavel',
    statusLabel: 'ESTÁVEL',
    tags: ['#presente', '#vault'],
    fragment:
      'O monitor acendeu sozinho. Neural link estável. O índice aponta para cá — e espera o próximo write.',
    nodeColor: 'green',
  },
]

const LOGS = [
  { t: '13:47:01', level: 'info', msg: 'INDEXADOR: varredura setorial concluída' },
  { t: '13:47:12', level: 'ok', msg: 'NEURAL LINK: latência 12ms — nominal' },
  { t: '13:47:18', level: 'warn', msg: 'AVISO: MEM-0xB21C abaixo do limiar crítico' },
  { t: '13:47:24', level: 'info', msg: 'CACHE: prefetch de cluster 0x7A3F' },
  { t: '13:47:31', level: 'ok', msg: 'INTEGRIDADE: média recalculada → 65%' },
  { t: '13:47:39', level: 'warn', msg: 'AVISO: 2 arquivos críticos requerem atenção' },
  { t: '13:47:44', level: 'info', msg: 'TIMELINE: nó 2009 selecionado pelo operador' },
  { t: '13:47:48', level: 'ok', msg: 'VAULT: sessão autenticada — MONITOR-01' },
]

const STATS = [
  { label: 'INTEGRIDADE MÉDIA', value: '65%', tone: 'green' },
  { label: 'MEMÓRIAS INDEXADAS', value: '7', tone: 'purple' },
  { label: 'ARQUIVOS CRÍTICOS', value: '2', tone: 'yellow' },
  { label: 'CAPACIDADE USADA', value: '16.1 GB', tone: 'blue' },
]

export function Memorias() {
  const [selectedId, setSelectedId] = useState(MEMORIES[0].id)
  const selected = MEMORIES.find((m) => m.id === selectedId) ?? MEMORIES[0]

  return (
    <main className="memorias" id="memorias">
      <section className="memorias-stats" aria-label="Métricas do vault">
        {STATS.map((stat) => (
          <article key={stat.label} className={`memorias-stat tone-${stat.tone}`}>
            <p className="memorias-stat-value">{stat.value}</p>
            <p className="memorias-stat-label">{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="memorias-timeline" aria-label="Linha do tempo">
        <div className="memorias-timeline-track">
          <div className="memorias-timeline-line" aria-hidden="true" />

          <div
            key={selected.id}
            className={`memorias-float-card align-${floatAlign(selected.year)}`}
            style={{ '--node-pos': yearToPercent(selected.year) }}
          >
            <div className="memorias-float-thumb" aria-hidden="true" />
            <div className="memorias-float-body">
              <span className={`memorias-badge status-${selected.status}`}>
                {selected.statusLabel}
              </span>
              <p className="memorias-float-id">{selected.id}</p>
              <p className="memorias-float-title">{selected.title}</p>
              <div className="memorias-mini-bar">
                <span style={{ width: `${selected.integrity}%` }} />
              </div>
            </div>
          </div>

          {MEMORIES.map((memory) => {
            const active = memory.id === selected.id
            return (
              <button
                key={memory.id}
                type="button"
                className={`memorias-node node-${memory.nodeColor}${active ? ' is-active' : ''}`}
                style={{ '--node-pos': yearToPercent(memory.year) }}
                onClick={() => setSelectedId(memory.id)}
                aria-pressed={active}
                aria-label={`${memory.title}, ${memory.year}`}
              >
                <span className="memorias-node-dot" />
                <span className="memorias-node-year">{memory.year}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="memorias-panels" aria-label="Painéis de memória">
        <aside className="memorias-panel memorias-index">
          <header className="memorias-panel-head">
            <h2>ÍNDICE</h2>
            <span>{MEMORIES.length} REGISTROS</span>
          </header>
          <ul className="memorias-index-list">
            {MEMORIES.map((memory) => {
              const active = memory.id === selected.id
              return (
                <li key={memory.id}>
                  <button
                    type="button"
                    className={`memorias-index-item${active ? ' is-active' : ''}`}
                    onClick={() => setSelectedId(memory.id)}
                  >
                    <div className="memorias-index-main">
                      <span className="memorias-index-title">{memory.title}</span>
                      <span className="memorias-index-meta">
                        {memory.date} · {memory.id}
                      </span>
                    </div>
                    <div className="memorias-index-bar-wrap">
                      <span className="memorias-index-pct">{memory.integrity}%</span>
                      <div className="memorias-mini-bar">
                        <span
                          className={`fill-${memory.status}`}
                          style={{ width: `${memory.integrity}%` }}
                        />
                      </div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        <article className="memorias-panel memorias-detail">
          <header className="memorias-panel-head">
            <h2>REGISTRO</h2>
            <span>{selected.id}</span>
          </header>

          <div className="memorias-detail-grid">
            <div className="memorias-detail-meta">
              <h3>{selected.title}</h3>
              <dl>
                <div>
                  <dt>TIPO</dt>
                  <dd>{selected.type}</dd>
                </div>
                <div>
                  <dt>DATA</dt>
                  <dd>{selected.date}</dd>
                </div>
                <div>
                  <dt>TAMANHO</dt>
                  <dd>{selected.size}</dd>
                </div>
              </dl>
              <div className="memorias-tags">
                {selected.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className="memorias-ring" aria-label={`Integridade ${selected.integrity}%`}>
              <svg viewBox="0 0 120 120" role="img">
                <circle className="memorias-ring-track" cx="60" cy="60" r="48" />
                <circle
                  className="memorias-ring-value"
                  cx="60"
                  cy="60"
                  r="48"
                  style={{
                    strokeDasharray: `${(selected.integrity / 100) * 301.6} 301.6`,
                  }}
                />
              </svg>
              <div className="memorias-ring-label">
                <strong>{selected.integrity}%</strong>
                <span>INTEGRIDADE</span>
              </div>
            </div>
          </div>

          <div className="memorias-fragment">
            <h4>FRAGMENTO DE MEMÓRIA</h4>
            <p>“{selected.fragment}”</p>
          </div>
        </article>

        <aside className="memorias-panel memorias-log">
          <header className="memorias-panel-head">
            <h2>LOG DO SISTEMA</h2>
            <span>AO VIVO</span>
          </header>
          <ul className="memorias-log-list">
            {LOGS.map((entry) => (
              <li key={`${entry.t}-${entry.msg}`} className={`level-${entry.level}`}>
                <span className="memorias-log-time">[{entry.t}]</span>
                <span className="memorias-log-msg">{entry.msg}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  )
}

function yearToPercent(year) {
  const min = 2009
  const max = 2024
  return `${((year - min) / (max - min)) * 100}%`
}

function floatAlign(year) {
  const min = 2009
  const max = 2024
  const pct = ((year - min) / (max - min)) * 100
  if (pct <= 20) return 'start'
  if (pct >= 80) return 'end'
  return 'center'
}

export default Memorias
