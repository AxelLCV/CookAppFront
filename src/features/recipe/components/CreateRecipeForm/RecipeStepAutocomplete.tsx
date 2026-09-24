import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getRecipes } from '../../api/recipes';
import type { Recipe } from '../../types/recipes';

type RecipeStepAutocompleteProps = {
  onSelect: (recipe: Recipe) => void;
  disabled?: boolean;
};

export function RecipeStepAutocomplete({ onSelect, disabled }: RecipeStepAutocompleteProps) {
  const { t } = useTranslation('common');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Recipe[]>([]);

  useEffect(() => {
    const trimmed = query.trim();
    const timeoutId = setTimeout(() => {
      if (trimmed.length < 2) {
        setResults([]);
        return;
      }
      getRecipes({ search: trimmed, limit: 5 })
        .then(({ data }) => setResults(data))
        .catch(() => setResults([]));
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (recipe: Recipe) => {
    onSelect(recipe);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="ingredient-search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('recipeForm.recipeStepSearchPlaceholder')}
        disabled={disabled}
        autoComplete="off"
      />
      {results.length > 0 && (
        <ul className="ingredient-suggestions">
          {results.map((recipe) => (
            <li key={recipe.id}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(recipe);
                }}
              >
                {recipe.translations[0]?.name ?? t('recipeForm.unnamedIngredient')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
