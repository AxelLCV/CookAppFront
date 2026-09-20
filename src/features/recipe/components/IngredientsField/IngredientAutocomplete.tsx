import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { searchIngredients, type IngredientOption } from '../../api/ingredients';

type IngredientAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onSelect: (ingredient: IngredientOption) => void;
  disabled?: boolean;
};

export function IngredientAutocomplete({ value, onChange, onSelect, disabled }: IngredientAutocompleteProps) {
  const { t } = useTranslation('common');
  const [results, setResults] = useState<IngredientOption[]>([]);

  useEffect(() => {
    const query = value.trim();
    const timeoutId = setTimeout(() => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      searchIngredients(query)
        .then(setResults)
        .catch(() => setResults([]));
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleSelect = (ingredient: IngredientOption) => {
    onSelect(ingredient);
    setResults([]);
  };

  return (
    <div className="ingredient-search">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('recipeForm.ingredientSearchPlaceholder')}
        disabled={disabled}
        autoComplete="off"
      />
      {results.length > 0 && (
        <ul className="ingredient-suggestions">
          {results.map((ingredient) => (
            <li key={ingredient.id}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(ingredient);
                }}
              >
                {ingredient.translations[0]?.name ?? t('recipeForm.unnamedIngredient')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
