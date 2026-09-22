import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getRecipes, RecipeCard, type Recipe } from '@/features/recipe';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/features/auth';
import './RecipesList.css';

type LoadState = 'loading' | 'error' | 'ready';
type RecipesListFilter = 'all' | 'mine' | 'favorites';

type RecipesListProps = {
  filter?: RecipesListFilter;
};

export function RecipesList({ filter = 'all' }: RecipesListProps) {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [state, setState] = useState<LoadState>('loading');

  const fetchRecipes = () => {
    getRecipes({
      authorId: filter === 'mine' ? user?.id : undefined,
      favoritedByMe: filter === 'favorites' ? true : undefined,
    })
      .then((data) => {
        setRecipes(data);
        setState('ready');
      })
      .catch(() => {
        setState('error');
      });
  };

  const retry = () => {
    setState('loading');
    fetchRecipes();
  };

  useEffect(() => {
    fetchRecipes();
  }, [filter, user?.id]);

  return (
    <div className="recipes-list-page">
      <h1 className="recipes-list-title">{t('recipes.title')}</h1>

      {state === 'loading' && (
        <p className="recipes-list-status">{t('recipes.loading')}</p>
      )}

      {state === 'error' && (
        <div className="recipes-list-status">
          <p>{t('recipes.error')}</p>
          <Button variant="secondary" onClick={retry}>{t('recipes.retry')}</Button>
        </div>
      )}

      {state === 'ready' && recipes.length === 0 && (
        <div className="recipes-list-empty">
          <ChefHat size={48} strokeWidth={1.5} />
          <p>{t('recipes.empty')}</p>
          <Link to={ROUTES.RECIPE_NEW}>
            <Button variant="primary">{t('recipes.emptyCta')}</Button>
          </Link>
        </div>
      )}

      {state === 'ready' && recipes.length > 0 && (
        <div className="recipes-list-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
