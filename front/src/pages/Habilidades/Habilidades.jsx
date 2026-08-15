import { useEffect, useId, useRef, useState } from 'react'
import './Habilidades.css'

const CATEGORIES = [
  { value: 'OFENSIVO', tone: 'red' },
  { value: 'COGNITIVO', tone: 'cyan' },
  { value: 'DEFENSIVO', tone: 'green' },
  { value: 'SOCIAL', tone: 'purple' },
]

const INITIAL_FORM = {
  title: '',
  category: 'COGNITIVO',
  level: 1,
  active: true,
  description: '',
}

const STATS = [
  {
    value: '4',
    label: 'HABILIDADES ATIVAS',
    hint: 'em execução',
    tone: 'green',
  },
  {
    value: '6.0',
    label: 'NÍVEL MÉDIO',
    hint: 'de 10 máximo',
    tone: 'purple',
  },
  {
    value: '2',
    label: 'SLOTS DISPONÍVEIS',
    hint: 'para novos módulos',
    tone: 'orange',
  },
  {
    value: '68%',
    label: 'CARGA COGNITIVA',
    hint: 'dentro do limite',
    tone: 'cyan',
  },
]

const INITIAL_SKILLS = [
  {
    id: 'SKL-01',
    title: 'ARTES MARCIAIS',
    category: 'OFENSIVO',
    active: true,
    tone: 'red',
    level: 10,
    description: 'Canaliza impulsos sinápticos em vetores de ataque. Latência baixa.',
  },
  {
    id: 'SKL-02',
    title: 'BALLET',
    category: 'SOCIAL',
    active: true,
    tone: 'purple',
    level: 7,
    description:
      'Execução de movimentos graciosos e precisos. Requer coordenação motora fina.',
  },
  {
    id: 'SKL-03',
    title: 'SUPRESSÃO EMOCIONAL',
    category: 'DEFENSIVO',
    active: false,
    tone: 'green',
    level: 4,
    description:
      'Atenuação voluntária de picos afetivos. Módulo offline — requer recalibração do limiar de empatia.',
  },
  {
    id: 'SKL-04',
    title: 'ANÁLISE DE PADRÕES',
    category: 'COGNITIVO',
    active: true,
    tone: 'cyan',
    level: 6,
    description:
      'Detecta correlações ocultas em fluxos de dados e comportamento. Precisão cresce com amostras repetidas.',
  },
  {
    id: 'SKL-05',
    title: 'LINK EMPÁTICO',
    category: 'SOCIAL',
    active: false,
    tone: 'purple',
    level: 2,
    description:
      'Estabelece resonância emocional de curto alcance. Slot inativo — protocolo de consentimento pendente.',
  },
  {
    id: 'SKL-06',
    title: 'CRIPTOGRAFIA MNÊMICA',
    category: 'DEFENSIVO',
    active: true,
    tone: 'green',
    level: 8,
    description:
      'Blindagem de clusters de memória com chaves neurais rotativas. Protege contra leitura não autorizada.',
  },
]

/**
 * Ponto de integração com o backend.
 * Substitua o corpo por POST JSON para o endpoint de cadastro.
 */
async function createHabilidade(payload) {
  // TODO: conectar ao backend
  // const res = await fetch('/api/habilidades', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // })
  // if (!res.ok) throw new Error('Falha ao cadastrar habilidade')
  // return res.json()
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { ok: true, ...payload }
}

function toneForCategory(category) {
  return CATEGORIES.find((c) => c.value === category)?.tone ?? 'purple'
}

function nextSkillId(skills) {
  const next = skills.length + 1
  return `SKL-${String(next).padStart(2, '0')}`
}

export function Habilidades() {
  const titleId = useId()
  const firstFieldRef = useRef(null)
  const [skills, setSkills] = useState(INITIAL_SKILLS)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!modalOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstFieldRef.current?.focus()

    function onKeyDown(event) {
      if (event.key === 'Escape' && !saving) setModalOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [modalOpen, saving])

  function openModal() {
    setForm(INITIAL_FORM)
    setStatus({ type: 'idle', message: '' })
    setModalOpen(true)
  }

  function closeModal() {
    if (saving) return
    setModalOpen(false)
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const title = form.title.trim()
    const description = form.description.trim()
    if (!title || !description) {
      setStatus({ type: 'error', message: 'Preencha nome e descrição.' })
      return
    }

    const payload = {
      id: nextSkillId(skills),
      title: title.toUpperCase(),
      category: form.category,
      tone: toneForCategory(form.category),
      level: Number(form.level),
      active: form.active,
      description,
    }

    setSaving(true)
    setStatus({ type: 'idle', message: '' })

    try {
      const created = await createHabilidade(payload)
      setSkills((prev) => [...prev, { ...payload, ...created }])
      setStatus({ type: 'success', message: `Módulo ${payload.title} cadastrado.` })
      setModalOpen(false)
      setForm(INITIAL_FORM)
    } catch {
      setStatus({ type: 'error', message: 'Falha ao cadastrar no vault.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="habilidades" id="habilidades">
      <section className="habilidades-stats" aria-label="Métricas de habilidades">
        {STATS.map((stat) => (
          <article key={stat.label} className={`habilidades-stat tone-${stat.tone}`}>
            <p className="habilidades-stat-value">{stat.value}</p>
            <p className="habilidades-stat-label">{stat.label}</p>
            <p className="habilidades-stat-hint">{stat.hint}</p>
          </article>
        ))}
      </section>

      <div className="habilidades-toolbar">
        <div className="habilidades-toolbar-copy">
          <p className="habilidades-toolbar-label">MÓDULOS</p>
          <p className="habilidades-toolbar-hint">
            {status.type === 'success' && status.message}
            {status.type === 'error' && !modalOpen && status.message}
            {status.type === 'idle' && '2 slots livres para novos módulos'}
          </p>
        </div>

        <button type="button" className="habilidades-upload-btn" onClick={openModal}>
          + NOVA HABILIDADE
        </button>
      </div>

      <section className="habilidades-grid" aria-label="Módulos de habilidade">
        {skills.map((skill) => (
          <article
            key={skill.id}
            className={`habilidades-card tone-${skill.tone}${skill.active ? ' is-active' : ''}`}
          >
            <header className="habilidades-card-top">
              <span className="habilidades-card-id">{skill.id}</span>
              <div className="habilidades-card-flags">
                <span className="habilidades-card-cat">{skill.category}</span>
                <span className={`habilidades-card-status${skill.active ? ' is-on' : ''}`}>
                  <span className="habilidades-card-status-dot" aria-hidden="true" />
                  {skill.active ? 'ATIVO' : 'INATIVO'}
                </span>
              </div>
            </header>

            <h2 className="habilidades-card-title">{skill.title}</h2>

            <div className="habilidades-nvl">
              <div className="habilidades-nvl-label">
                <span>NVL</span>
                <span>
                  {skill.level}
                  <em>/10</em>
                </span>
              </div>
              <div className="habilidades-nvl-bars" aria-hidden="true">
                {Array.from({ length: 10 }, (_, i) => (
                  <span
                    key={i}
                    className={`habilidades-nvl-seg${i < skill.level ? ' is-filled' : ''}`}
                  />
                ))}
              </div>
            </div>

            <p className="habilidades-card-desc">{skill.description}</p>
          </article>
        ))}
      </section>

      <footer className="habilidades-footer">
        <span>MNEMO // VAULT — NEURAL MEMORY MANAGEMENT SYSTEM v4.7.2</span>
        <span>
          TAG#: #600788 · ENCRIPTAÇÃO: AES-512{' '}
          <span className="habilidades-secure">
            <span className="habilidades-secure-dot" aria-hidden="true" />
            SEGURO
          </span>
        </span>
      </footer>

      {modalOpen && (
        <div
          className="habilidades-modal-backdrop"
          role="presentation"
          onClick={closeModal}
        >
          <div
            className="habilidades-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="habilidades-modal-head">
              <div>
                <p className="habilidades-modal-kicker">PROTOCOLO DE INSERÇÃO</p>
                <h2 id={titleId}>CADASTRAR HABILIDADE</h2>
              </div>
              <button
                type="button"
                className="habilidades-modal-close"
                onClick={closeModal}
                disabled={saving}
                aria-label="Fechar"
              >
                ✕
              </button>
            </header>

            <form className="habilidades-modal-form" onSubmit={handleSubmit}>
              <label className="habilidades-field">
                <span>NOME</span>
                <input
                  ref={firstFieldRef}
                  type="text"
                  name="title"
                  maxLength={48}
                  placeholder="Ex: VISÃO TÁTICA"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                />
              </label>

              <div className="habilidades-field-row">
                <label className="habilidades-field">
                  <span>CATEGORIA</span>
                  <select
                    name="category"
                    value={form.category}
                    onChange={(e) => updateField('category', e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.value}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="habilidades-field">
                  <span>NÍVEL (1–10)</span>
                  <input
                    type="number"
                    name="level"
                    min={1}
                    max={10}
                    value={form.level}
                    onChange={(e) =>
                      updateField('level', Math.min(10, Math.max(1, Number(e.target.value) || 1)))
                    }
                  />
                </label>
              </div>

              <fieldset className="habilidades-field habilidades-toggle">
                <legend>STATUS</legend>
                <label>
                  <input
                    type="radio"
                    name="active"
                    checked={form.active}
                    onChange={() => updateField('active', true)}
                  />
                  ATIVO
                </label>
                <label>
                  <input
                    type="radio"
                    name="active"
                    checked={!form.active}
                    onChange={() => updateField('active', false)}
                  />
                  INATIVO
                </label>
              </fieldset>

              <label className="habilidades-field">
                <span>DESCRIÇÃO</span>
                <textarea
                  name="description"
                  rows={4}
                  maxLength={280}
                  placeholder="Descreva o módulo neural…"
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  required
                />
              </label>

              {status.type === 'error' && modalOpen && (
                <p className="habilidades-modal-error" role="alert">
                  {status.message}
                </p>
              )}

              <div className="habilidades-modal-actions">
                <button
                  type="button"
                  className="habilidades-modal-cancel"
                  onClick={closeModal}
                  disabled={saving}
                >
                  CANCELAR
                </button>
                <button type="submit" className="habilidades-upload-btn" disabled={saving}>
                  {saving ? 'GRAVANDO…' : 'CADASTRAR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default Habilidades
