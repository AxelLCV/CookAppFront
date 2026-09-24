import { useState } from 'react';
import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, ImageOff, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Recipe } from '../../types/recipes';
import { ROUTES } from '@/config/routes';
import { toggleFavorite } from '../../api/recipes';
import './RecipeCard.css';

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { t } = useTranslation('common');
  const translation = recipe.translations?.[0];
  const totalTime = recipe.preparationTime + recipe.cookingTime + recipe.restTime;
  const imageUrl = recipe.images?.[0];
  const [isFavorited, setIsFavorited] = useState(recipe.isFavorited ?? false);
  const [syncedFavorited, setSyncedFavorited] = useState(recipe.isFavorited ?? false);

  // Keep the local (optimistic) state in sync when the server sends a fresh value,
  // without wiping out an in-flight optimistic toggle. Done during render (not an
  // effect) per React's guidance for resetting state when a prop changes.
  if ((recipe.isFavorited ?? false) !== syncedFavorited) {
    setSyncedFavorited(recipe.isFavorited ?? false);
    setIsFavorited(recipe.isFavorited ?? false);
  }

  const handleToggleFavorite = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsFavorited((current) => !current);
    toggleFavorite(recipe.slug).catch(() => {
      setIsFavorited((current) => !current);
    });
  };

  return (
    <Link to={ROUTES.RECIPE_DETAIL(recipe.slug)} className="recipe-card">
      <div className="recipe-card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={translation?.name || 'Recette'} />
        ) : (
          <div className="recipe-card-image-placeholder">
            <ImageOff size={28} strokeWidth={1.5} />
          </div>
        )}
        <button
          type="button"
          className={`recipe-card-favorite${isFavorited ? ' recipe-card-favorite-active' : ''}`}
          onClick={handleToggleFavorite}
          aria-label={t(isFavorited ? 'recipeDetail.removeFavorite' : 'recipeDetail.addFavorite')}
        >
          <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="recipe-card-content">
        <h3 className="recipe-card-title">{translation?.name || 'Sans nom'}</h3>

        <p className="recipe-card-description">
          {translation?.description || 'Pas de description'}
        </p>

        <div className="recipe-card-meta">
          <span className="meta-item">
            <Clock size={14} /> {totalTime} {t('recipes.minutes')}
          </span>
          <span className="recipe-card-rating" aria-label={`${recipe.note}/5`}>
            <span className="recipe-card-rating-track">
              {[1, 2, 3, 4, 5].map((value) => (
                <Star key={value} size={14} fill="none" />
              ))}
            </span>
            <span
              className="recipe-card-rating-fill"
              style={{ width: `${Math.max(0, Math.min(100, (recipe.note / 5) * 100))}%` }}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <Star key={value} size={14} fill="currentColor" />
              ))}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
