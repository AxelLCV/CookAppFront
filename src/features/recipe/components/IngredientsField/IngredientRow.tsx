import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';
import type { UnitOption } from '../../api/units';
import { CreateUnitPanel } from './CreateUnitPanel';

export type SelectedIngredient = {
  key: string;
  ingredientId: number;
  name: string;
  quantity: number;
  unitId: number;
};

type IngredientRowProps = {
  row: SelectedIngredient;
  units: UnitOption[];
  isAdmin: boolean;
  disabled?: boolean;
  onUpdate: (patch: Partial<SelectedIngredient>) => void;
  onRemove: () => void;
  onUnitCreated: (unit: UnitOption) => void;
};

export function IngredientRow({ row, units, isAdmin, disabled, onUpdate, onRemove, onUnitCreated }: IngredientRowProps) {
  const { t } = useTranslation('common');
  const [isCreatingUnit, setIsCreatingUnit] = useState(false);

  const handleUnitCreated = (unit: UnitOption) => {
    onUnitCreated(unit);
    onUpdate({ unitId: unit.id });
    setIsCreatingUnit(false);
  };

  return (
    <div className="ingredient-row-wrapper">
      <div className="ingredient-row">
        <span className="ingredient-row-name">{row.name}</span>
        <input
          type="number"
          min="0"
          step="any"
          value={row.quantity}
          onChange={(e) => onUpdate({ quantity: Number(e.target.value) })}
          disabled={disabled}
          className="ingredient-row-quantity"
          aria-label={t('recipeForm.quantityLabel')}
        />
        <select
          value={row.unitId}
          onChange={(e) => onUpdate({ unitId: Number(e.target.value) })}
          disabled={disabled}
          className="ingredient-row-unit"
          aria-label={t('recipeForm.unitLabel')}
        >
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.translations[0]?.name ?? unit.type}
            </option>
          ))}
        </select>
        {isAdmin && (
          <button
            type="button"
            className="add-ingredient-btn"
            onClick={() => setIsCreatingUnit(true)}
            disabled={disabled}
            title={t('recipeForm.createUnit')}
            aria-label={t('recipeForm.createUnit')}
          >
            <Plus size={18} />
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="remove-ingredient-btn"
          disabled={disabled}
          title={t('recipeForm.removeIngredient')}
          aria-label={t('recipeForm.removeIngredient')}
        >
          <Trash2 size={18} />
        </button>
      </div>

      {isCreatingUnit && (
        <CreateUnitPanel
          idPrefix={`newUnit-${row.key}`}
          onCreated={handleUnitCreated}
          onCancel={() => setIsCreatingUnit(false)}
        />
      )}
    </div>
  );
}
