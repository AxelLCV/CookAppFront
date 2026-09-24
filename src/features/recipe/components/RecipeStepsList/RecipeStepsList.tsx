import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ResolvedRecipeStep } from '../../types/recipes';
import { ROUTES } from '@/config/routes';
import './RecipeStepsList.css';

type RecipeStepsListProps = {
  steps: ResolvedRecipeStep[];
  depth?: number;
};

export function RecipeStepsList({ steps, depth = 0 }: RecipeStepsListProps) {
  const { t } = useTranslation('common');

  return (
    <ol className={`recipe-steps-list${depth > 0 ? ' recipe-steps-list-nested' : ''}`}>
      {steps.map((step, index) => (
        <li key={index}>
          {step.type === 'text' ? (
            step.translations[0]?.text
          ) : (
            <div className="recipe-step-subrecipe">
              <div className="recipe-step-subrecipe-header">
                <BookOpen size={16} />
                <span>{step.recipe.translations[0]?.name ?? ''}</span>
                <Link to={ROUTES.RECIPE_DETAIL(step.recipe.slug)} className="recipe-step-subrecipe-link">
                  {t('recipeDetail.seeRecipe')}
                </Link>
              </div>

              {step.ingredients.length > 0 && (
                <ul className="recipe-detail-ingredients">
                  {step.ingredients.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <span className="ingredient-quantity">
                        {item.quantity} {item.unit.translations[0]?.name ?? item.unit.type}
                      </span>
                      <span>{item.ingredient.translations[0]?.name ?? t('recipeForm.unnamedIngredient')}</span>
                    </li>
                  ))}
                </ul>
              )}

              <RecipeStepsList steps={step.steps} depth={depth + 1} />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
