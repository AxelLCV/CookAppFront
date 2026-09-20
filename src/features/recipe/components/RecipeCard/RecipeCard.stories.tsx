import type { Meta, StoryObj } from '@storybook/react-vite';
import { RecipeCard } from './RecipeCard';
import type { Recipe } from '../../types/recipes';

const baseRecipe: Recipe = {
  id: '1',
  slug: 'tarte-aux-pommes',
  images: [],
  part: 4,
  note: 8,
  preparationTime: 15,
  cookingTime: 30,
  restTime: 0,
  isPublished: true,
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
  authorId: '1',
  translations: [
    {
      id: '1',
      name: 'Tarte aux pommes',
      description: 'Une tarte aux pommes classique et gourmande.',
      stage: [],
      languageId: 1,
      recipeId: '1',
    },
  ],
};

const meta: Meta<typeof RecipeCard> = {
  title: 'Recipe/RecipeCard',
  component: RecipeCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RecipeCard>;

export const Default: Story = {
  args: {
    recipe: baseRecipe,
  },
};

export const WithImage: Story = {
  args: {
    recipe: { ...baseRecipe, images: ['https://images.pexels.com/photos/1998636/pexels-photo-1998636.jpeg'] },
  },
};

export const SinglePortion: Story = {
  args: {
    recipe: { ...baseRecipe, part: 1 },
  },
};
