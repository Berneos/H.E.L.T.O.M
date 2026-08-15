/** Base URL do backend. Ex.: http://localhost:3000/api */
export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')

/** Se true (ou se a API falhar em dev), usa dados locais de fallback. */
export const USE_MEMORIAS_MOCK =
  import.meta.env.VITE_USE_MEMORIAS_MOCK === 'true' ||
  import.meta.env.VITE_USE_MEMORIAS_MOCK === '1'
