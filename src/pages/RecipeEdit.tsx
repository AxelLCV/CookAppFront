import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './RecipeEdit.css';

export function RecipeEdit() {
  const { id } = useParams();
  const { t } = useTranslation('common');

  return (
    <div className="recipe-edit-page">
      <h1>{t('recipes.editTitle')}</h1>
      <p className="recipe-edit-placeholder">{t('recipes.editComingSoon', { id })}</p>
    </div>
  );
}
