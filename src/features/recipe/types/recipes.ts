export type RecipeStepInput =
  | { type: 'text'; text: string }
  | { type: 'recipe'; recipeId: number };

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
  stage: RecipeStepInput[];
  isPublished?: boolean;
  ingredients?: { ingredientId: number; unitId: number; quantity: number }[];
};

export type Recipe = {
  id: number;
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
  isFavorited?: boolean;
  translations: RecipeTranslation[];
}

export type RecipeTranslation = {
  id: number;
  name: string;
  description: string;
  languageId: number;
  recipeId: number;
}

export type NamedEntity = {
  id: number;
  translations: { name: string }[];
};

export type RecipeIngredientDetail = {
  quantity: number;
  ingredient: NamedEntity;
  unit: NamedEntity & { type: string };
};

export type RecipeStepTextTranslation = {
  id: number;
  text: string;
  languageId: number;
  stepId: number;
};

export type ResolvedRecipeStep =
  | { type: 'text'; translations: RecipeStepTextTranslation[] }
  | {
      type: 'recipe';
      recipe: {
        id: number;
        slug: string;
        translations: { name: string; languageId: number }[];
      };
      scale: number;
      ingredients: RecipeIngredientDetail[];
      steps: ResolvedRecipeStep[];
    };

export type RecipeDetail = Recipe & {
  steps: ResolvedRecipeStep[];
  ingredients: RecipeIngredientDetail[];
  ustensils: { ustensil: NamedEntity }[];
  tags: { tag: NamedEntity }[];
  wines: { wine: NamedEntity }[];
};
