const STATUS_LABEL = {
  estavel: 'ESTÁVEL',
  aviso: 'AVISO',
  critico: 'CRÍTICO',
}

function toNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function deriveStatus(integrity) {
  if (integrity >= 80) return 'estavel'
  if (integrity >= 50) return 'aviso'
  return 'critico'
}

function deriveNodeColor(integrity, status) {
  if (status === 'critico' || integrity < 45) return 'red'
  if (status === 'aviso' || integrity < 70) return integrity < 60 ? 'orange' : 'yellow'
  return 'green'
}

function yearFromDate(date, year) {
  if (Number.isFinite(Number(year))) return Number(year)
  if (typeof date === 'string' && date.length >= 4) {
    const parsed = Number(date.slice(0, 4))
    if (Number.isFinite(parsed)) return parsed
  }
  return new Date().getFullYear()
}

export function normalizeMemory(raw, index = 0) {
  const integrity = Math.min(100, Math.max(0, toNumber(raw?.integrity, 0)))
  const status = raw?.status || deriveStatus(integrity)
  const date = raw?.date ?? raw?.registro ?? '—'
  const year = yearFromDate(date, raw?.year)
  const tags = Array.isArray(raw?.tags) ? raw.tags : []

  return {
    id: String(raw?.id ?? `MEM-${String(index + 1).padStart(2, '0')}`),
    title: String(raw?.title ?? raw?.nome ?? 'SEM TÍTULO').toUpperCase(),
    year,
    date,
    integrity,
    tags,
    fragment: String(raw?.fragment ?? raw?.relato ?? ''),
    status,
    statusLabel: raw?.statusLabel ?? STATUS_LABEL[status] ?? status.toUpperCase(),
    nodeColor: raw?.nodeColor ?? deriveNodeColor(integrity, status),
    type: raw?.type ?? raw?.tipo ?? null,
    size: raw?.size ?? raw?.tamanho ?? null,
  }
}

function buildStats(memories, statsFromApi) {
  if (Array.isArray(statsFromApi) && statsFromApi.length > 0) {
    return statsFromApi.map((stat) => ({
      label: String(stat.label ?? ''),
      value: String(stat.value ?? '—'),
      tone: stat.tone ?? 'purple',
    }))
  }

  const count = memories.length
  const avg =
    count === 0
      ? 0
      : Math.round(memories.reduce((sum, m) => sum + m.integrity, 0) / count)
  const critical = memories.filter((m) => m.status === 'critico').length

  return [
    { label: 'INTEGRIDADE MÉDIA', value: `${avg}%`, tone: 'green' },
    { label: 'MEMÓRIAS INDEXADAS', value: String(count), tone: 'purple' },
    { label: 'ARQUIVOS CRÍTICOS', value: String(critical), tone: 'yellow' },
    { label: 'CAPACIDADE USADA', value: '—', tone: 'blue' },
  ]
}

function normalizeLogs(logs) {
  if (!Array.isArray(logs)) return []
  return logs.map((entry, index) => ({
    id: entry.id ?? `${entry.t ?? index}-${entry.msg ?? index}`,
    t: String(entry.t ?? entry.time ?? '--:--:--'),
    level: String(entry.level ?? 'info').toLowerCase(),
    msg: String(entry.msg ?? entry.message ?? ''),
  }))
}

export function getYearRange(memories) {
  if (!memories.length) {
    const year = new Date().getFullYear()
    return { min: year, max: year }
  }
  const years = memories.map((m) => m.year)
  return { min: Math.min(...years), max: Math.max(...years) }
}

export function normalizeMemoriasPayload(payload) {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.memories)
      ? payload.memories
      : Array.isArray(payload?.memorias)
        ? payload.memorias
        : Array.isArray(payload?.data)
          ? payload.data
          : []

  const memories = list
    .map((item, index) => normalizeMemory(item, index))
    .sort((a, b) => a.year - b.year || String(a.date).localeCompare(String(b.date)))

  return {
    memories,
    stats: buildStats(memories, payload?.stats),
    logs: normalizeLogs(payload?.logs ?? payload?.log),
    range: getYearRange(memories),
  }
}
