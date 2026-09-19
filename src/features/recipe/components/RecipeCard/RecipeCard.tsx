import { Link } from 'react-router-dom';
import { Clock, ImageOff, Star, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Recipe } from '../../types/recipes';
import './RecipeCard.css';

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { t } = useTranslation('common');
  const translation = recipe.translations?.[0];
  const totalTime = recipe.preparationTime + recipe.cookingTime + recipe.restTime;
  const imageUrl = recipe.images?.[0];

  return (
    <Link to={`/recipes/${recipe.slug}`} className="recipe-card">
      <div className="recipe-card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={translation?.name || 'Recette'} />
        ) : (
          <div className="recipe-card-image-placeholder">
            <ImageOff size={28} strokeWidth={1.5} />
          </div>
        )}
        {recipe.note > 0 && (
          <div className="recipe-difficulty">
            <Star size={14} fill="currentColor" /> {recipe.note}/10
          </div>
        )}
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
          <span className="meta-item">
            <Users size={14} /> {recipe.part} {recipe.part > 1 ? t('recipes.people') : t('recipes.person')}
          </span>
        </div>
      </div>
    </Link>
  );
}
