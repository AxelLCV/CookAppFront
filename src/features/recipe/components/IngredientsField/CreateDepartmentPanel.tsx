import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { createDepartment, type DepartmentOption } from '../../api/departments';

type CreateDepartmentPanelProps = {
  onCreated: (department: DepartmentOption) => void;
  onCancel: () => void;
};

export function CreateDepartmentPanel({ onCreated, onCancel }: CreateDepartmentPanelProps) {
  const { t } = useTranslation('common');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async () => {
    setError('');

    if (!name.trim()) {
      setError(t('recipeForm.departmentNameRequired'));
      return;
    }

    setIsSaving(true);
    try {
      const created = await createDepartment(name.trim());
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
        <label htmlFor="newDepartmentName">{t('recipeForm.departmentNameLabel')}</label>
        <input
          id="newDepartmentName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSaving}
        />
      </div>

      <div className="ingredient-create-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          {t('recipeForm.cancel')}
        </Button>
        <Button type="button" variant="primary" onClick={handleCreate} disabled={isSaving}>
          {isSaving ? t('recipeForm.submitting') : t('recipeForm.createDepartmentSubmit')}
        </Button>
      </div>
    </div>
  );
}
