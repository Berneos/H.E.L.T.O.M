/** Base URL do backend. Vazio = mesma origem (proxy Vite). */
export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export const USE_MEMORIAS_MOCK =
  import.meta.env.VITE_USE_MEMORIAS_MOCK === 'true' ||
  import.meta.env.VITE_USE_MEMORIAS_MOCK === '1'

export const USE_SKILLS_MOCK =
  import.meta.env.VITE_USE_SKILLS_MOCK === 'true' ||
  import.meta.env.VITE_USE_SKILLS_MOCK === '1'
