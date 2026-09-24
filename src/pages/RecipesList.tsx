import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getRecipes, RecipeCard, type Recipe } from '@/features/recipe';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/features/auth';
import './RecipesList.css';

const PAGE_SIZE = 10;

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const buildFilters = (targetPage: number) => ({
    authorId: filter === 'mine' ? user?.id : undefined,
    favoritedByMe: filter === 'favorites' ? true : undefined,
    page: targetPage,
    limit: PAGE_SIZE,
  });

  const fetchFirstPage = () => {
    setState('loading');
    getRecipes(buildFilters(1))
      .then(({ data, meta }) => {
        setRecipes(data);
        setPage(1);
        setHasMore(meta.page < meta.totalPages);
        setState('ready');
      })
      .catch(() => {
        setState('error');
      });
  };

  const retry = () => {
    fetchFirstPage();
  };

  useEffect(() => {
    const run = async () => {
      fetchFirstPage();
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, user?.id]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    const nextPage = page + 1;

    setIsLoadingMore(true);
    getRecipes(buildFilters(nextPage))
      .then(({ data, meta }) => {
        setRecipes((current) => [...current, ...data]);
        setPage(nextPage);
        setHasMore(meta.page < meta.totalPages);
      })
      .catch(() => {
        setHasMore(false);
      })
      .finally(() => {
        setIsLoadingMore(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingMore, hasMore, page, filter, user?.id]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

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
        <>
          <div className="recipes-list-grid">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {hasMore && (
            <div ref={sentinelRef} className="recipes-list-sentinel">
              {isLoadingMore && <p className="recipes-list-status">{t('recipes.loadingMore')}</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
