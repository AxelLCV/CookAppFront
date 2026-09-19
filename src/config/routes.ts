export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  RECIPES: '/recipes',
  RECIPE_DETAIL: (slug: string) => `/recipes/${slug}`,
  RECIPE_NEW: '/recipes/new',
  RECIPE_EDIT: (slug: string) => `/recipes/${slug}/edit`,
  FAVORITES: '/favorites',
  PROFILE: '/profile',
} as const;