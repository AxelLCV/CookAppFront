import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { getUnits, type UnitOption } from '../../api/units';
import type { IngredientOption } from '../../api/ingredients';
import { IngredientAutocomplete } from './IngredientAutocomplete';
import { CreateIngredientPanel } from './CreateIngredientPanel';
import { IngredientRow, type SelectedIngredient } from './IngredientRow';
import './IngredientsField.css';

export type IngredientEntry = { ingredientId: number; unitId: number; quantity: number };

type IngredientsFieldProps = {
  isAdmin: boolean;
  disabled?: boolean;
  onChange: (ingredients: IngredientEntry[]) => void;
};

function toPayload(rows: SelectedIngredient[]): IngredientEntry[] {
  return rows
    .filter((row) => row.quantity > 0 && row.unitId)
    .map((row) => ({ ingredientId: row.ingredientId, unitId: row.unitId, quantity: row.quantity }));
}

export function IngredientsField({ isAdmin, disabled, onChange }: IngredientsFieldProps) {
  const { t } = useTranslation('common');
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [rows, setRows] = useState<SelectedIngredient[]>([]);
  const [query, setQuery] = useState('');
  const [isCreatingIngredient, setIsCreatingIngredient] = useState(false);

  useEffect(() => {
    getUnits().then(setUnits).catch(() => {});
  }, []);

  const addRow = (ingredient: IngredientOption) => {
    const nextRows = [
      ...rows,
      {
        key: `${ingredient.id}-${Date.now()}`,
        ingredientId: ingredient.id,
        name: ingredient.translations[0]?.name ?? t('recipeForm.unnamedIngredient'),
        quantity: 1,
        unitId: units[0]?.id ?? 0,
      },
    ];
    setRows(nextRows);
    onChange(toPayload(nextRows));
  };

  const updateRow = (key: string, patch: Partial<SelectedIngredient>) => {
    const nextRows = rows.map((row) => (row.key === key ? { ...row, ...patch } : row));
    setRows(nextRows);
    onChange(toPayload(nextRows));
  };

  const removeRow = (key: string) => {
    const nextRows = rows.filter((row) => row.key !== key);
    setRows(nextRows);
    onChange(toPayload(nextRows));
  };

  const handleSelectIngredient = (ingredient: IngredientOption) => {
    addRow(ingredient);
    setQuery('');
  };

  const handleIngredientCreated = (ingredient: IngredientOption) => {
    addRow(ingredient);
    setQuery('');
    setIsCreatingIngredient(false);
  };

  return (
    <div className="form-group">
      <label>
        {t('recipeForm.ingredientsLabel')}
        <span className="hint">{t('recipeForm.ingredientsHint')}</span>
      </label>

      <div className="ingredient-search-row">
        <IngredientAutocomplete
          value={query}
          onChange={setQuery}
          onSelect={handleSelectIngredient}
          disabled={disabled}
        />

        {isAdmin && (
          <button
            type="button"
            className="add-ingredient-btn"
            onClick={() => setIsCreatingIngredient(true)}
            disabled={disabled}
            title={t('recipeForm.createIngredient')}
            aria-label={t('recipeForm.createIngredient')}
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {isCreatingIngredient && (
        <CreateIngredientPanel
          initialName={query}
          onCreated={handleIngredientCreated}
          onCancel={() => setIsCreatingIngredient(false)}
        />
      )}

      {rows.length > 0 && (
        <div className="ingredient-rows">
          {rows.map((row) => (
            <IngredientRow
              key={row.key}
              row={row}
              units={units}
              isAdmin={isAdmin}
              disabled={disabled}
              onUpdate={(patch) => updateRow(row.key, patch)}
              onRemove={() => removeRow(row.key)}
              onUnitCreated={(unit) => setUnits((current) => [...current, unit])}
            />
          ))}
        </div>
      )}
    </div>
  );
}
