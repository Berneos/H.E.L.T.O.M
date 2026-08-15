import { apiRequest } from './client'
import { USE_MEMORIAS_MOCK } from './config'
import { MEMORIAS_MOCK } from './memorias.mock'
import { normalizeMemoriasPayload } from './memorias.normalize'

/** GET /memory/ */
export async function fetchMemorias() {
  if (USE_MEMORIAS_MOCK) {
    return normalizeMemoriasPayload(MEMORIAS_MOCK)
  }

  const data = await apiRequest('/memory/')
  return normalizeMemoriasPayload(data)
}

/** POST /memory/ */
export async function createMemoria(payload) {
  return apiRequest('/memory/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/** PATCH /memory/ */
export async function updateMemoria(id, updates) {
  return apiRequest('/memory/', {
    method: 'PATCH',
    body: JSON.stringify({ id, ...updates }),
  })
}

/** DELETE /memory/ */
export async function deleteMemoria(id) {
  return apiRequest('/memory/', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })
}

/** GET /memory/:keyword */
export async function fetchMemoriasByKeyword(keyword) {
  const data = await apiRequest(`/memory/${encodeURIComponent(keyword)}`)
  return normalizeMemoriasPayload(data)
}
