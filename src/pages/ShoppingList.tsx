import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useHousehold, createHousehold } from '@/features/household';
import {
  getShoppingList,
  addShoppingListItem,
  updateShoppingListItem,
  deleteShoppingListItem,
} from '@/features/household';
import type { ShoppingListItem } from '@/features/household';
import { searchIngredients, type IngredientOption } from '@/features/recipe/api/ingredients';
import './ShoppingList.css';

type LoadState = 'loading' | 'error' | 'ready';

function itemLabel(item: ShoppingListItem, fallback: string): string {
  if (item.customLabel) return item.customLabel;
  return item.ingredient?.translations[0]?.name ?? fallback;
}

export function ShoppingList() {
  const { t } = useTranslation('common');
  const { currentHousehold, isLoading: isHouseholdLoading, refresh, setCurrentHousehold } = useHousehold();

  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<IngredientOption[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [isCreatingHousehold, setIsCreatingHousehold] = useState(false);

  const fetchItems = (householdId: string) => {
    setState('loading');
    getShoppingList(householdId)
      .then((data) => {
        setItems(data);
        setState('ready');
      })
      .catch(() => setState('error'));
  };

  useEffect(() => {
    if (!currentHousehold) return;
    const run = async () => {
      fetchItems(currentHousehold.id);
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHousehold?.id]);

  useEffect(() => {
    const trimmed = query.trim();
    const timeoutId = setTimeout(() => {
      if (trimmed.length < 2) {
        setSuggestions([]);
        return;
      }
      searchIngredients(trimmed)
        .then(setSuggestions)
        .catch(() => setSuggestions([]));
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleAddIngredient = async (ingredient: IngredientOption) => {
    if (!currentHousehold) return;
    setQuery('');
    setSuggestions([]);
    setIsAdding(true);
    try {
      const item = await addShoppingListItem(currentHousehold.id, { ingredientId: ingredient.id });
      setItems((current) => [item, ...current]);
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddCustom = async () => {
    const label = query.trim();
    if (!currentHousehold || !label) return;
    setQuery('');
    setSuggestions([]);
    setIsAdding(true);
    try {
      const item = await addShoppingListItem(currentHousehold.id, { customLabel: label });
      setItems((current) => [item, ...current]);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggle = async (item: ShoppingListItem) => {
    if (!currentHousehold) return;
    const nextChecked = !item.isChecked;
    setItems((current) => current.map((i) => (i.id === item.id ? { ...i, isChecked: nextChecked } : i)));
    try {
      await updateShoppingListItem(currentHousehold.id, item.id, { isChecked: nextChecked });
    } catch {
      setItems((current) => current.map((i) => (i.id === item.id ? { ...i, isChecked: !nextChecked } : i)));
    }
  };

  const handleRemove = async (item: ShoppingListItem) => {
    if (!currentHousehold) return;
    setItems((current) => current.filter((i) => i.id !== item.id));
    await deleteShoppingListItem(currentHousehold.id, item.id).catch(() => fetchItems(currentHousehold.id));
  };

  const handleCreateHousehold = async () => {
    const name = newHouseholdName.trim();
    if (!name) return;
    setIsCreatingHousehold(true);
    try {
      const household = await createHousehold({ name });
      await refresh();
      setCurrentHousehold(household.id);
      setNewHouseholdName('');
    } finally {
      setIsCreatingHousehold(false);
    }
  };

  if (isHouseholdLoading) {
    return <p className="shopping-list-status">{t('shoppingList.loading')}</p>;
  }

  if (!currentHousehold) {
    return (
      <div className="shopping-list-page">
        <h1 className="shopping-list-title">{t('shoppingList.title')}</h1>
        <div className="shopping-list-empty">
          <ShoppingCart size={48} strokeWidth={1.5} />
          <p>{t('shoppingList.noHousehold')}</p>
          <div className="shopping-list-create-household">
            <input
              type="text"
              value={newHouseholdName}
              onChange={(e) => setNewHouseholdName(e.target.value)}
              placeholder={t('shoppingList.householdNamePlaceholder')}
              disabled={isCreatingHousehold}
            />
            <Button variant="primary" onClick={handleCreateHousehold} disabled={isCreatingHousehold || !newHouseholdName.trim()}>
              {t('shoppingList.createHousehold')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const uncheckedItems = items.filter((item) => !item.isChecked);
  const checkedItems = items.filter((item) => item.isChecked);

  return (
    <div className="shopping-list-page">
      <h1 className="shopping-list-title">{t('shoppingList.title')}</h1>

      <div className="ingredient-search shopping-list-search">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddCustom();
            }
          }}
          placeholder={t('shoppingList.addPlaceholder')}
          disabled={isAdding}
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul className="ingredient-suggestions">
            {suggestions.map((ingredient) => (
              <li key={ingredient.id}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleAddIngredient(ingredient);
                  }}
                >
                  {ingredient.translations[0]?.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {state === 'loading' && <p className="shopping-list-status">{t('shoppingList.loading')}</p>}

      {state === 'error' && (
        <div className="shopping-list-status">
          <p>{t('shoppingList.error')}</p>
          <Button variant="secondary" onClick={() => fetchItems(currentHousehold.id)}>
            {t('recipes.retry')}
          </Button>
        </div>
      )}

      {state === 'ready' && items.length === 0 && (
        <div className="shopping-list-empty">
          <ShoppingCart size={48} strokeWidth={1.5} />
          <p>{t('shoppingList.empty')}</p>
        </div>
      )}

      {state === 'ready' && uncheckedItems.length > 0 && (
        <ul className="shopping-list-items">
          {uncheckedItems.map((item) => (
            <li key={item.id} className="shopping-list-item">
              <label className="shopping-list-item-label">
                <input type="checkbox" checked={false} onChange={() => handleToggle(item)} />
                <span>
                  {itemLabel(item, t('shoppingList.unnamedItem'))}
                  {item.quantity ? ` — ${item.quantity} ${item.unit?.translations[0]?.name ?? ''}` : ''}
                </span>
              </label>
              <button
                type="button"
                className="shopping-list-remove-btn"
                onClick={() => handleRemove(item)}
                aria-label={t('shoppingList.removeItem')}
                title={t('shoppingList.removeItem')}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {state === 'ready' && checkedItems.length > 0 && (
        <>
          <h2 className="shopping-list-checked-title">{t('shoppingList.checkedTitle')}</h2>
          <ul className="shopping-list-items shopping-list-items-checked">
            {checkedItems.map((item) => (
              <li key={item.id} className="shopping-list-item">
                <label className="shopping-list-item-label">
                  <input type="checkbox" checked onChange={() => handleToggle(item)} />
                  <span>{itemLabel(item, t('shoppingList.unnamedItem'))}</span>
                </label>
                <button
                  type="button"
                  className="shopping-list-remove-btn"
                  onClick={() => handleRemove(item)}
                  aria-label={t('shoppingList.removeItem')}
                  title={t('shoppingList.removeItem')}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
