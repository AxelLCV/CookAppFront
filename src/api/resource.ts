import { apiFetch } from './client'

export type Recipe = {
  id: string
  slug: string
  name: string
}

export function getResource(identifier: string) {
  return apiFetch<Recipe[]>(`/${identifier}`)
}
