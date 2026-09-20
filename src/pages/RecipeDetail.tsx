import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChefHat, Clock, ImageOff, ListOrdered, Star, Tag, UtensilsCrossed, Users, Wine } from 'lucide-react';
import { getRecipe, type RecipeDetail as RecipeDetailData } from '@/features/recipe';
import { Button } from '@/components/ui/Button';
import './RecipeDetail.css';

type LoadState = 'loading' | 'error' | 'ready';

export function RecipeDetail() {
  const { slug } = useParams();
  const { t } = useTranslation('common');
  const [recipe, setRecipe] = useState<RecipeDetailData | null>(null);
  const [state, setState] = useState<LoadState>('loading');

  const fetchRecipe = (targetSlug: string) => {
    getRecipe(targetSlug)
      .then((data) => {
        setRecipe(data);
        setState('ready');
      })
      .catch(() => {
        setState('error');
      });
  };

  const retry = () => {
    if (!slug) return;
    setState('loading');
    fetchRecipe(slug);
  };

  useEffect(() => {
    if (!slug) return;
    fetchRecipe(slug);
  }, [slug]);

  if (state === 'loading') {
    return <p className="recipe-detail-status">{t('recipeDetail.loading')}</p>;
  }

  if (state === 'error' || !recipe) {
    return (
      <div className="recipe-detail-status">
        <p>{t('recipeDetail.error')}</p>
        <Button variant="secondary" onClick={retry}>{t('recipes.retry')}</Button>
      </div>
    );
  }

  const translation = recipe.translations[0];
  const totalTime = (recipe.preparationTime ?? 0) + (recipe.cookingTime ?? 0) + (recipe.restTime ?? 0);

  return (
    <div className="recipe-detail-page">
      {recipe.images.length > 0 ? (
        <div className="recipe-detail-gallery">
          {recipe.images.map((url) => (
            <img key={url} src={url} alt={translation?.name ?? ''} />
          ))}
        </div>
      ) : (
        <div className="recipe-detail-gallery-placeholder">
          <ImageOff size={40} strokeWidth={1.5} />
        </div>
      )}

      <div className="recipe-detail-content">
        <h1 className="recipe-detail-title">{translation?.name ?? t('recipeForm.unnamedIngredient')}</h1>

        <div className="recipe-detail-meta">
          <span className="meta-item">
            <Clock size={16} /> {totalTime} {t('recipes.minutes')}
          </span>
          <span className="meta-item">
            <Users size={16} /> {recipe.part} {recipe.part > 1 ? t('recipes.people') : t('recipes.person')}
          </span>
          {recipe.note > 0 && (
            <span className="meta-item">
              <Star size={16} fill="currentColor" /> {recipe.note}/10
            </span>
          )}
        </div>

        {(recipe.preparationTime || recipe.cookingTime || recipe.restTime) ? (
          <div className="recipe-detail-times">
            {recipe.preparationTime ? (
              <span>{t('recipeForm.preparationLabel')} {recipe.preparationTime} {t('recipes.minutes')}</span>
            ) : null}
            {recipe.cookingTime ? (
              <span>{t('recipeForm.cookingLabel')} {recipe.cookingTime} {t('recipes.minutes')}</span>
            ) : null}
            {recipe.restTime ? (
              <span>{t('recipeForm.restLabel')} {recipe.restTime} {t('recipes.minutes')}</span>
            ) : null}
          </div>
        ) : null}

        {translation?.description && (
          <p className="recipe-detail-description">{translation.description}</p>
        )}

        {recipe.ingredients.length > 0 && (
          <section className="recipe-detail-section">
            <h2><ChefHat size={18} /> {t('recipeDetail.ingredientsTitle')}</h2>
            <ul className="recipe-detail-ingredients">
              {recipe.ingredients.map((item, index) => (
                <li key={index}>
                  <span className="ingredient-quantity">
                    {item.quantity} {item.unit.translations[0]?.name ?? item.unit.type}
                  </span>
                  <span>{item.ingredient.translations[0]?.name ?? t('recipeForm.unnamedIngredient')}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {translation?.stage && translation.stage.length > 0 && (
          <section className="recipe-detail-section">
            <h2><ListOrdered size={18} /> {t('recipeDetail.stepsTitle')}</h2>
            <ol className="recipe-detail-steps">
              {translation.stage.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </section>
        )}

        {recipe.ustensils.length > 0 && (
          <section className="recipe-detail-section">
            <h2><UtensilsCrossed size={18} /> {t('recipeDetail.ustensilsTitle')}</h2>
            <ul className="recipe-detail-chips">
              {recipe.ustensils.map((item) => (
                <li key={item.ustensil.id}>{item.ustensil.translations[0]?.name}</li>
              ))}
            </ul>
          </section>
        )}

        {recipe.tags.length > 0 && (
          <section className="recipe-detail-section">
            <h2><Tag size={18} /> {t('recipeDetail.tagsTitle')}</h2>
            <ul className="recipe-detail-chips">
              {recipe.tags.map((item) => (
                <li key={item.tag.id}>{item.tag.translations[0]?.name}</li>
              ))}
            </ul>
          </section>
        )}

        {recipe.wines.length > 0 && (
          <section className="recipe-detail-section">
            <h2><Wine size={18} /> {t('recipeDetail.winesTitle')}</h2>
            <ul className="recipe-detail-chips">
              {recipe.wines.map((item) => (
                <li key={item.wine.id}>{item.wine.translations[0]?.name}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
