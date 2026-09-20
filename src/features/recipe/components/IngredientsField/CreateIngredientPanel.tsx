import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createIngredient, type IngredientOption } from '../../api/ingredients';
import { getDepartments, type DepartmentOption } from '../../api/departments';
import { CreateDepartmentPanel } from './CreateDepartmentPanel';

type CreateIngredientPanelProps = {
  initialName: string;
  onCreated: (ingredient: IngredientOption) => void;
  onCancel: () => void;
};

export function CreateIngredientPanel({ initialName, onCreated, onCancel }: CreateIngredientPanelProps) {
  const { t } = useTranslation('common');
  const [name, setName] = useState(initialName);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [isCreatingDepartment, setIsCreatingDepartment] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getDepartments()
      .then((results) => {
        setDepartments(results);
        setDepartmentId((current) => current ?? results[0]?.id ?? null);
      })
      .catch(() => setError(t('recipeForm.departmentsLoadError')));
  }, [t]);

  const handleDepartmentCreated = (department: DepartmentOption) => {
    setDepartments((current) => [...current, department]);
    setDepartmentId(department.id);
    setIsCreatingDepartment(false);
  };

  const handleCreate = async () => {
    setError('');

    if (!name.trim()) {
      setError(t('recipeForm.ingredientNameRequired'));
      return;
    }
    if (!departmentId) {
      setError(t('recipeForm.departmentRequired'));
      return;
    }

    setIsSaving(true);
    try {
      const created = await createIngredient({ name: name.trim(), departmentId });
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
        <label htmlFor="newIngredientName">{t('recipeForm.ingredientNameLabel')}</label>
        <input
          id="newIngredientName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSaving}
        />
      </div>

      <div className="form-group">
        <label htmlFor="newIngredientDepartment">{t('recipeForm.departmentLabel')}</label>
        <div className="inline-select-row">
          <select
            id="newIngredientDepartment"
            value={departmentId ?? ''}
            onChange={(e) => setDepartmentId(Number(e.target.value))}
            disabled={isSaving || departments.length === 0}
          >
            {departments.length === 0 && <option value="">{t('recipeForm.departmentsLoading')}</option>}
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.translations[0]?.name ?? department.id}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="add-ingredient-btn"
            onClick={() => setIsCreatingDepartment(true)}
            disabled={isSaving}
            title={t('recipeForm.createDepartment')}
            aria-label={t('recipeForm.createDepartment')}
          >
            <Plus size={18} />
          </button>
        </div>

        {isCreatingDepartment && (
          <CreateDepartmentPanel
            onCreated={handleDepartmentCreated}
            onCancel={() => setIsCreatingDepartment(false)}
          />
        )}
      </div>

      <div className="ingredient-create-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          {t('recipeForm.cancel')}
        </Button>
        <Button type="button" variant="primary" onClick={handleCreate} disabled={isSaving}>
          {isSaving ? t('recipeForm.submitting') : t('recipeForm.createIngredientSubmit')}
        </Button>
      </div>
    </div>
  );
}
