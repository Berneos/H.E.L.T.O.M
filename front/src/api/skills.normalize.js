/**
 * Normaliza payloads do backend GET /skill/
 * Campos: _id, nome, data, nivel, categoria, active, tone
 */

const LEVEL_RANK = {
  iniciante: 2,
  basico: 3,
  básico: 3,
  intermediario: 5,
  intermediário: 5,
  experiencia: 6,
  experiência: 6,
  avancado: 8,
  avançado: 8,
  expert: 9,
  mestre: 10,
}

const TONE_CSS = {
  red: 'var(--cp-red)',
  maroon: '#9b1b30',
  teal: '#1aa6a6',
  cyan: 'var(--cp-blue)',
  blue: 'var(--cp-blue)',
  green: 'var(--cp-green)',
  purple: 'var(--cp-purple-soft)',
  orange: 'var(--cp-orange)',
  yellow: 'var(--cp-yellow)',
  magenta: 'var(--cp-magenta)',
}

export function resolveToneColor(tone) {
  if (!tone) return TONE_CSS.purple
  const key = String(tone).toLowerCase()
  if (TONE_CSS[key]) return TONE_CSS[key]
  // permite valor CSS direto do backend (ex.: #c00, maroon)
  return String(tone)
}

export function parseNivel(nivel) {
  if (nivel == null || nivel === '') {
    return { label: '—', rank: 0 }
  }

  const asNumber = Number(nivel)
  if (Number.isFinite(asNumber)) {
    const rank = Math.min(10, Math.max(0, Math.round(asNumber)))
    return { label: String(rank), rank }
  }

  const label = String(nivel)
  const rank = LEVEL_RANK[label.toLowerCase()] ?? 5
  return { label, rank }
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('pt-BR')
}

export function normalizeSkill(raw, index = 0) {
  const { label: levelLabel, rank: level } = parseNivel(raw?.nivel)
  const tone = raw?.tone || 'purple'

  return {
    id: String(raw?._id ?? raw?.id ?? `SKL-${index + 1}`),
    title: String(raw?.nome ?? raw?.title ?? 'SEM NOME'),
    category: String(raw?.categoria ?? raw?.category ?? 'geral').toUpperCase(),
    active: raw?.active !== false,
    tone,
    toneColor: resolveToneColor(tone),
    level,
    levelLabel,
    rawNivel: raw?.nivel ?? '',
    date: formatDate(raw?.data),
    rawDate: raw?.data ?? null,
    description: raw?.descricao ? String(raw.descricao) : '',
  }
}

export function buildSkillStats(skills) {
  const active = skills.filter((s) => s.active).length
  const avg =
    skills.length === 0
      ? 0
      : (skills.reduce((sum, s) => sum + s.level, 0) / skills.length).toFixed(1)
  const slots = Math.max(0, 8 - skills.length)

  return [
    {
      value: String(active),
      label: 'HABILIDADES ATIVAS',
      hint: 'em execução',
      tone: 'green',
    },
    {
      value: String(avg),
      label: 'NÍVEL MÉDIO',
      hint: 'escala normalizada',
      tone: 'purple',
    },
    {
      value: String(slots),
      label: 'SLOTS DISPONÍVEIS',
      hint: 'para novos módulos',
      tone: 'orange',
    },
    {
      value: String(skills.length),
      label: 'MÓDULOS INDEXADOS',
      hint: 'no vault',
      tone: 'cyan',
    },
  ]
}

export function normalizeSkillsPayload(payload) {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.skills)
      ? payload.skills
      : Array.isArray(payload?.habilidades)
        ? payload.habilidades
        : []

  const skills = list
    .map((item, index) => normalizeSkill(item, index))
    .sort((a, b) => String(b.rawDate).localeCompare(String(a.rawDate)))

  return {
    skills,
    stats: buildSkillStats(skills),
  }
}

/** Payload para POST/PATCH /skill/ conforme backend */
export function toSkillPayload(form) {
  return {
    nome: form.nome.trim(),
    data: form.data || new Date().toISOString(),
    nivel: String(form.nivel).trim(),
    categoria: form.categoria.trim().toLowerCase(),
    active: Boolean(form.active),
    tone: form.tone,
  }
}

/** @deprecated use toSkillPayload */
export function toCreateSkillPayload(form) {
  return toSkillPayload(form)
}

export function skillToForm(skill) {
  return {
    nome: skill?.title ?? '',
    data: toDateInputValue(skill?.rawDate),
    nivel: skill?.rawNivel || skill?.levelLabel || 'intermediario',
    categoria: String(skill?.category ?? 'habilidade').toLowerCase(),
    active: skill?.active !== false,
    tone: skill?.tone || 'purple',
  }
}

function toDateInputValue(value) {
  if (!value) return new Date().toISOString().slice(0, 10)
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10)
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
