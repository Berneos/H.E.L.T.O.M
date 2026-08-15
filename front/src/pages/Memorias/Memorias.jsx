import { useEffect, useState } from 'react'
import { fetchMemorias } from '../../api/memorias'
import './Memorias.css'

export function Memorias() {
  const [data, setData] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const payload = await fetchMemorias()
        if (!active) return

        setData(payload)
        setSelectedId((current) => {
          if (current && payload.memories.some((m) => m.id === current)) return current
          return payload.memories[0]?.id ?? null
        })
      } catch (err) {
        if (!active) return
        setError(err?.message || 'Falha ao carregar memórias')
        setData(null)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [reloadKey])

  const memories = data?.memories ?? []
  const stats = data?.stats ?? []
  const logs = data?.logs ?? []
  const range = data?.range ?? { min: 2009, max: 2024 }
  const selected = memories.find((m) => m.id === selectedId) ?? memories[0] ?? null

  if (loading) {
    return (
      <main className="memorias memorias-state" id="memorias">
        <p className="memorias-state-label">SINCRONIZANDO ÍNDICE…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="memorias memorias-state" id="memorias">
        <p className="memorias-state-label is-error">FALHA NO LINK · {error}</p>
        <button
          type="button"
          className="memorias-retry"
          onClick={() => setReloadKey((n) => n + 1)}
        >
          TENTAR NOVAMENTE
        </button>
      </main>
    )
  }

  if (!memories.length) {
    return (
      <main className="memorias memorias-state" id="memorias">
        <p className="memorias-state-label">NENHUMA MEMÓRIA INDEXADA</p>
      </main>
    )
  }

  return (
    <main className="memorias" id="memorias">
      <section className="memorias-stats" aria-label="Métricas do vault">
        {stats.map((stat) => (
          <article key={stat.label} className={`memorias-stat tone-${stat.tone}`}>
            <p className="memorias-stat-value">{stat.value}</p>
            <p className="memorias-stat-label">{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="memorias-timeline" aria-label="Linha do tempo">
        <div className="memorias-timeline-track">
          <div className="memorias-timeline-line" aria-hidden="true" />

          {selected && (
            <div
              key={selected.id}
              className={`memorias-float-card align-${floatAlign(selected.year, range)}`}
              style={{ '--node-pos': yearToPercent(selected.year, range) }}
            >
              {selected.imageSrc ? (
                <img
                  className="memorias-float-thumb"
                  src={selected.imageSrc}
                  alt=""
                />
              ) : (
                <div className="memorias-float-thumb" aria-hidden="true" />
              )}
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
          )}

          {memories.map((memory) => {
            const active = memory.id === selected?.id
            return (
              <button
                key={memory.id}
                type="button"
                className={`memorias-node node-${memory.nodeColor}${active ? ' is-active' : ''}`}
                style={{ '--node-pos': yearToPercent(memory.year, range) }}
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
            <span>{memories.length} REGISTROS</span>
          </header>
          <ul className="memorias-index-list">
            {memories.map((memory) => {
              const active = memory.id === selected?.id
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
                        {memory.date} · {memory.keyword || memory.id}
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

        {selected && (
          <article className="memorias-panel memorias-detail">
            <header className="memorias-panel-head">
              <h2>REGISTRO</h2>
              <span>{selected.keyword || selected.id}</span>
            </header>

            <div className="memorias-detail-grid">
              <div className="memorias-detail-meta">
                <h3>{selected.title}</h3>
                <dl>
                  <div>
                    <dt>DATA</dt>
                    <dd>{selected.date}</dd>
                  </div>
                  <div>
                    <dt>ANO</dt>
                    <dd>{selected.year}</dd>
                  </div>
                  {selected.keyword && (
                    <div>
                      <dt>CHAVE</dt>
                      <dd>{selected.keyword}</dd>
                    </div>
                  )}
                </dl>
                {selected.tags.length > 0 && (
                  <div className="memorias-tags">
                    {selected.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
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

            {selected.imageSrc && (
              <div className="memorias-detail-image">
                <img src={selected.imageSrc} alt={selected.title} />
              </div>
            )}

            {selected.fragment && (
              <div className="memorias-fragment">
                <h4>DESCRIÇÃO</h4>
                <p>{selected.fragment}</p>
              </div>
            )}
          </article>
        )}

        <aside className="memorias-panel memorias-log">
          <header className="memorias-panel-head">
            <h2>LOG DO SISTEMA</h2>
            <span>AO VIVO</span>
          </header>
          <ul className="memorias-log-list">
            {logs.map((entry) => (
              <li key={entry.id} className={`level-${entry.level}`}>
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

function yearToPercent(year, range) {
  const span = Math.max(range.max - range.min, 1)
  return `${((year - range.min) / span) * 100}%`
}

function floatAlign(year, range) {
  const span = Math.max(range.max - range.min, 1)
  const pct = ((year - range.min) / span) * 100
  if (pct <= 20) return 'start'
  if (pct >= 80) return 'end'
  return 'center'
}

export default Memorias
