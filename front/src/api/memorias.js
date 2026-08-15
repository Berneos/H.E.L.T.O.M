/**
 * Contrato esperado do backend — GET /memorias
 *
 * {
 *   "stats": [
 *     { "label": "INTEGRIDADE MÉDIA", "value": "65%", "tone": "green" }
 *   ],
 *   "memories": [
 *     {
 *       "id": "MEM-0x7A3F",
 *       "title": "PRIMEIRA INFÂNCIA",
 *       "year": 2009,
 *       "date": "2009-03-14",
 *       "integrity": 94,
 *       "tags": ["#familia", "#afeto"],
 *       "fragment": "...",
 *       "status": "estavel",      // opcional: estavel | aviso | critico
 *       "nodeColor": "green"     // opcional: green | yellow | orange | red
 *     }
 *   ],
 *   "logs": [
 *     { "t": "13:47:01", "level": "info", "msg": "..." }
 *   ]
 * }
 *
 * Também aceita um array puro de memórias: [ {...}, ... ]
 */

import { apiRequest } from './client'
import { USE_MEMORIAS_MOCK } from './config'
import { MEMORIAS_MOCK } from './memorias.mock'
import { normalizeMemoriasPayload } from './memorias.normalize'

export async function fetchMemorias() {
  if (USE_MEMORIAS_MOCK) {
    return normalizeMemoriasPayload(MEMORIAS_MOCK)
  }

  try {
    const data = await apiRequest('/memorias')
    return normalizeMemoriasPayload(data)
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[memorias] API indisponível — usando mock local.', error)
      return normalizeMemoriasPayload(MEMORIAS_MOCK)
    }
    throw error
  }
}
