import { useEffect, useId, useRef, useState } from 'react'
import { createSkill, deleteSkill, fetchSkills, updateSkill } from '../../api/skills'
import {
  buildSkillStats,
  skillToForm,
  toSkillPayload,
} from '../../api/skills.normalize'
import './Habilidades.css'

const CATEGORIES = ['habilidade', 'experiencia', 'conhecimento', 'social']
const TONES = ['maroon', 'teal', 'purple', 'green', 'cyan', 'red', 'orange']

const INITIAL_FORM = {
  nome: '',
  data: new Date().toISOString().slice(0, 10),
  nivel: 'intermediario',
  categoria: 'habilidade',
  active: true,
  tone: 'purple',
}

export function Habilidades() {
  const titleId = useId()
  const firstFieldRef = useRef(null)
  const [skills, setSkills] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const categoryOptions = Array.from(
    new Set([...CATEGORIES, form.categoria].filter(Boolean)),
  )
  const toneOptions = Array.from(new Set([...TONES, form.tone].filter(Boolean)))
  const isEditing = Boolean(editingId)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const payload = await fetchSkills()
        if (!active) return
        setSkills(payload.skills)
        setStats(payload.stats)
      } catch (err) {
        if (!active) return
        setError(err?.message || 'Falha ao carregar habilidades')
        setSkills([])
        setStats([])
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [reloadKey])

  useEffect(() => {
    if (!modalOpen && !pendingDelete) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (modalOpen) firstFieldRef.current?.focus()

    function onKeyDown(event) {
      if (event.key !== 'Escape' || saving || deleting) return
      if (modalOpen) setModalOpen(false)
      if (pendingDelete) setPendingDelete(null)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [modalOpen, pendingDelete, saving, deleting])

  function applySkills(next) {
    setSkills(next)
    setStats(buildSkillStats(next))
  }

  function openCreateModal() {
    setEditingId(null)
    setForm({
      ...INITIAL_FORM,
      data: new Date().toISOString().slice(0, 10),
    })
    setStatus({ type: 'idle', message: '' })
    setModalOpen(true)
  }

  function openEditModal(skill) {
    setEditingId(skill.id)
    setForm(skillToForm(skill))
    setStatus({ type: 'idle', message: '' })
    setModalOpen(true)
  }

  function closeModal() {
    if (saving) return
    setModalOpen(false)
    setEditingId(null)
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.nome.trim() || !form.data) {
      setStatus({ type: 'error', message: 'Preencha nome e data.' })
      return
    }

    setSaving(true)
    setStatus({ type: 'idle', message: '' })

    try {
      const payload = toSkillPayload(form)

      if (isEditing) {
        const updated = await updateSkill(editingId, payload)
        applySkills(skills.map((skill) => (skill.id === editingId ? updated : skill)))
        setStatus({ type: 'success', message: `Módulo ${updated.title} atualizado.` })
      } else {
        const created = await createSkill(payload)
        applySkills([created, ...skills])
        setStatus({ type: 'success', message: `Módulo ${created.title} cadastrado.` })
      }

      setModalOpen(false)
      setEditingId(null)
    } catch (err) {
      setStatus({
        type: 'error',
        message: err?.message || (isEditing ? 'Falha ao atualizar.' : 'Falha ao cadastrar.'),
      })
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)

    try {
      await deleteSkill(pendingDelete.id)
      applySkills(skills.filter((skill) => skill.id !== pendingDelete.id))
      setStatus({
        type: 'success',
        message: `Módulo ${pendingDelete.title} removido.`,
      })
      setPendingDelete(null)
    } catch (err) {
      setStatus({
        type: 'error',
        message: err?.message || 'Falha ao excluir habilidade.',
      })
      setPendingDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <main className="habilidades habilidades-state" id="habilidades">
        <p className="habilidades-state-label">CARREGANDO MÓDULOS…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="habilidades habilidades-state" id="habilidades">
        <p className="habilidades-state-label is-error">FALHA NO LINK · {error}</p>
        <button
          type="button"
          className="habilidades-upload-btn"
          onClick={() => setReloadKey((n) => n + 1)}
        >
          TENTAR NOVAMENTE
        </button>
      </main>
    )
  }

  return (
    <main className="habilidades" id="habilidades">
      <section className="habilidades-stats" aria-label="Métricas de habilidades">
        {stats.map((stat) => (
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
            {status.type === 'error' && !modalOpen && !pendingDelete && status.message}
            {status.type === 'idle' &&
              `${Math.max(0, 8 - skills.length)} slots livres para novos módulos`}
          </p>
        </div>

        <button type="button" className="habilidades-upload-btn" onClick={openCreateModal}>
          + NOVA HABILIDADE
        </button>
      </div>

      <section className="habilidades-grid" aria-label="Módulos de habilidade">
        {skills.length === 0 && (
          <p className="habilidades-empty">Nenhum módulo cadastrado no vault.</p>
        )}
        {skills.map((skill) => (
          <article
            key={skill.id}
            className={`habilidades-card${skill.active ? ' is-active' : ''}`}
            style={{ '--skill-accent': skill.toneColor }}
          >
            <header className="habilidades-card-top">
              <span className="habilidades-card-id">{skill.date}</span>
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
                <span>NÍVEL</span>
                <span>{skill.levelLabel}</span>
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

            {skill.description ? (
              <p className="habilidades-card-desc">{skill.description}</p>
            ) : (
              <p className="habilidades-card-desc">
                Categoria {skill.category.toLowerCase()} · tom {skill.tone}
              </p>
            )}

            <div className="habilidades-card-actions">
              <button
                type="button"
                className="habilidades-card-btn"
                onClick={() => openEditModal(skill)}
              >
                EDITAR
              </button>
              <button
                type="button"
                className="habilidades-card-btn is-danger"
                onClick={() => setPendingDelete(skill)}
              >
                DELETAR
              </button>
            </div>
          </article>
        ))}
      </section>

      <footer className="habilidades-footer">
        <span>HELTOM // VAULT — Human Experience, Learning & Temporal Organization Memory v4.7.2</span>
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
                <p className="habilidades-modal-kicker">
                  {isEditing ? 'PATCH /skill/' : 'POST /skill/'}
                </p>
                <h2 id={titleId}>
                  {isEditing ? 'EDITAR HABILIDADE' : 'CADASTRAR HABILIDADE'}
                </h2>
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
                  name="nome"
                  maxLength={80}
                  placeholder="Ex: Paixão por artes marciais"
                  value={form.nome}
                  onChange={(e) => updateField('nome', e.target.value)}
                  required
                />
              </label>

              <div className="habilidades-field-row">
                <label className="habilidades-field">
                  <span>DATA</span>
                  <input
                    type="date"
                    name="data"
                    value={form.data}
                    onChange={(e) => updateField('data', e.target.value)}
                    required
                  />
                </label>

                <label className="habilidades-field">
                  <span>NÍVEL</span>
                  <input
                    type="text"
                    name="nivel"
                    placeholder="avancado, experiencia…"
                    value={form.nivel}
                    onChange={(e) => updateField('nivel', e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="habilidades-field-row">
                <label className="habilidades-field">
                  <span>CATEGORIA</span>
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={(e) => updateField('categoria', e.target.value)}
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="habilidades-field">
                  <span>TOM</span>
                  <select
                    name="tone"
                    value={form.tone}
                    onChange={(e) => updateField('tone', e.target.value)}
                  >
                    {toneOptions.map((tone) => (
                      <option key={tone} value={tone}>
                        {tone}
                      </option>
                    ))}
                  </select>
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
                  {saving ? 'GRAVANDO…' : isEditing ? 'SALVAR' : 'CADASTRAR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div
          className="habilidades-modal-backdrop"
          role="presentation"
          onClick={() => !deleting && setPendingDelete(null)}
        >
          <div
            className="habilidades-modal habilidades-modal-confirm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="habilidades-delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="habilidades-modal-head">
              <div>
                <p className="habilidades-modal-kicker">DELETE /skill/</p>
                <h2 id="habilidades-delete-title">EXCLUIR MÓDULO</h2>
              </div>
            </header>
            <div className="habilidades-modal-form">
              <p className="habilidades-confirm-text">
                Remover <strong>{pendingDelete.title}</strong> do vault? Esta ação não pode
                ser desfeita.
              </p>
              <div className="habilidades-modal-actions">
                <button
                  type="button"
                  className="habilidades-modal-cancel"
                  onClick={() => setPendingDelete(null)}
                  disabled={deleting}
                >
                  CANCELAR
                </button>
                <button
                  type="button"
                  className="habilidades-upload-btn is-danger"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? 'EXCLUINDO…' : 'CONFIRMAR'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Habilidades
