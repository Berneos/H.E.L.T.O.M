import { apiRequest } from './client'
import { USE_SKILLS_MOCK } from './config'
import { SKILLS_MOCK } from './skills.mock'
import { normalizeSkill, normalizeSkillsPayload } from './skills.normalize'

let mockStore = null

function getMockStore() {
  if (!mockStore) mockStore = structuredClone(SKILLS_MOCK)
  return mockStore
}

/** GET /skill/ */
export async function fetchSkills() {
  if (USE_SKILLS_MOCK) {
    return normalizeSkillsPayload(getMockStore())
  }

  const data = await apiRequest('/skill/')
  return normalizeSkillsPayload(data)
}

/** POST /skill/ */
export async function createSkill(payload) {
  if (USE_SKILLS_MOCK) {
    const created = {
      _id: `mock-${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    getMockStore().unshift(created)
    return normalizeSkill(created)
  }

  const created = await apiRequest('/skill/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return normalizeSkill(created)
}

/** PATCH /skill/ */
export async function updateSkill(id, updates) {
  if (USE_SKILLS_MOCK) {
    const store = getMockStore()
    const index = store.findIndex((item) => String(item._id) === String(id))
    if (index < 0) throw new Error('Skill not found')
    store[index] = {
      ...store[index],
      ...updates,
      _id: id,
      updatedAt: new Date().toISOString(),
    }
    return normalizeSkill(store[index])
  }

  const updated = await apiRequest('/skill/', {
    method: 'PATCH',
    body: JSON.stringify({ id, ...updates }),
  })
  return normalizeSkill(updated)
}

/** DELETE /skill/ */
export async function deleteSkill(id) {
  if (USE_SKILLS_MOCK) {
    const store = getMockStore()
    const index = store.findIndex((item) => String(item._id) === String(id))
    if (index < 0) throw new Error('Skill not found')
    const [deleted] = store.splice(index, 1)
    return { success: true, deleted }
  }

  return apiRequest('/skill/', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })
}
