/**
 * Normaliza payloads do backend GET /memory/
 * Campos: _id, titulo, data, descricao, palavraChave, imagem, imagemMimeType, integrity, nodeColor
 */

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

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('pt-BR')
}

function yearFromDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return new Date().getFullYear()
  return date.getFullYear()
}

export function buildImageSrc(imagem, mimeType) {
  if (!imagem) return null
  if (String(imagem).startsWith('data:')) return imagem
  const mime =
    mimeType && String(mimeType).includes('/') ? mimeType : 'image/jpeg'
  return `data:${mime};base64,${imagem}`
}

export function normalizeMemory(raw, index = 0) {
  const integrity = Math.min(100, Math.max(0, toNumber(raw?.integrity, 100)))
  const status = deriveStatus(integrity)
  const data = raw?.data ?? raw?.date
  const palavraChave = raw?.palavraChave ?? raw?.keyword ?? ''
  const tags = palavraChave
    ? [`#${String(palavraChave).replace(/^#/, '')}`]
    : Array.isArray(raw?.tags)
      ? raw.tags
      : []

  return {
    id: String(raw?._id ?? raw?.id ?? `MEM-${index + 1}`),
    title: String(raw?.titulo ?? raw?.title ?? 'SEM TÍTULO'),
    year: yearFromDate(data),
    date: formatDate(data),
    rawDate: data ?? null,
    integrity,
    tags,
    fragment: String(raw?.descricao ?? raw?.fragment ?? ''),
    keyword: palavraChave ? String(palavraChave) : '',
    status,
    statusLabel: STATUS_LABEL[status],
    nodeColor: raw?.nodeColor || deriveNodeColor(integrity, status),
    imageSrc: buildImageSrc(raw?.imagem, raw?.imagemMimeType),
  }
}

function buildStats(memories) {
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
    {
      label: 'INTERVALO',
      value:
        count === 0
          ? '—'
          : `${Math.min(...memories.map((m) => m.year))}–${Math.max(...memories.map((m) => m.year))}`,
      tone: 'blue',
    },
  ]
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
        : []

  const memories = list
    .map((item, index) => normalizeMemory(item, index))
    .sort((a, b) => a.year - b.year || String(a.rawDate).localeCompare(String(b.rawDate)))

  return {
    memories,
    stats: buildStats(memories),
    logs: buildLogs(memories),
    range: getYearRange(memories),
  }
}

function buildLogs(memories) {
  const now = new Date()
  const stamp = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const critical = memories.filter((m) => m.status === 'critico')
  const logs = [
    {
      id: 'sync',
      t: stamp,
      level: 'ok',
      msg: `VAULT: ${memories.length} memórias sincronizadas do backend`,
    },
  ]

  critical.slice(0, 3).forEach((m) => {
    logs.push({
      id: `crit-${m.id}`,
      t: stamp,
      level: 'warn',
      msg: `AVISO: ${m.title} abaixo do limiar (${m.integrity}%)`,
    })
  })

  return logs
}
