import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { createUnit, type UnitOption, type UnitType } from '../../api/units';

type CreateUnitPanelProps = {
  idPrefix: string;
  onCreated: (unit: UnitOption) => void;
  onCancel: () => void;
};

export function CreateUnitPanel({ idPrefix, onCreated, onCancel }: CreateUnitPanelProps) {
  const { t } = useTranslation('common');
  const [name, setName] = useState('');
  const [type, setType] = useState<UnitType>('WEIGHT');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async () => {
    setError('');

    if (!name.trim()) {
      setError(t('recipeForm.unitNameRequired'));
      return;
    }

    setIsSaving(true);
    try {
      const created = await createUnit(name.trim(), type);
      onCreated(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('recipeForm.genericError'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="ingredient-create-panel">
      {error && <div className="field-error">{error}</div>}

      <div className="form-group">
        <label htmlFor={`${idPrefix}-name`}>{t('recipeForm.unitNameLabel')}</label>
        <input
          id={`${idPrefix}-name`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSaving}
        />
      </div>

      <div className="form-group">
        <label htmlFor={`${idPrefix}-type`}>{t('recipeForm.unitTypeLabel')}</label>
        <select
          id={`${idPrefix}-type`}
          value={type}
          onChange={(e) => setType(e.target.value as UnitType)}
          disabled={isSaving}
        >
          <option value="WEIGHT">{t('recipeForm.unitTypeWeight')}</option>
          <option value="VOLUME">{t('recipeForm.unitTypeVolume')}</option>
          <option value="QUANTITY">{t('recipeForm.unitTypeQuantity')}</option>
        </select>
      </div>

      <div className="ingredient-create-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          {t('recipeForm.cancel')}
        </Button>
        <Button type="button" variant="primary" onClick={handleCreate} disabled={isSaving}>
          {isSaving ? t('recipeForm.submitting') : t('recipeForm.createUnitSubmit')}
        </Button>
      </div>
    </div>
  );
}
