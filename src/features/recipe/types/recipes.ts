export type CreateRecipeInput = {
  name: string;
  slug: string;
  description?: string;
  images?: string[],
  part: number,
  note?: number,
  preparationTime?: number;
  cookingTime?: number;
  restTime?: number;
  stage: string[];
  isPublished?: boolean;
};

export type Recipe = {
  id: string;
  slug: string;
  images: string[];
  part: number;
  note: number;
  preparationTime: number;
  cookingTime: number;
  restTime: number;
  isPublished: boolean;
  createdAt: string;
  modifiedAt: string;
  authorId: string;
  translations: RecipeTranslation[];
}

export type RecipeTranslation = {
  id: string;
  name: string;
  description: string;
  stage: string;
  languageId: number;
  recipeId: string;
}