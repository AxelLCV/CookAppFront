export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  RECIPES: '/recipes',
  RECIPE_DETAIL: (id: string) => `/recipes/${id}`,
  RECIPE_NEW: '/recipes/new',
  RECIPE_EDIT: (id: string) => `/recipes/${id}/edit`,
  FAVORITES: '/favorites',
  PROFILE: '/profile',
} as const;