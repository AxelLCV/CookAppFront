import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './RecipeDetail.css';

export function RecipeDetail() {
  const { slug } = useParams();
  const { t } = useTranslation('common');

  return (
    <div className="recipe-detail-page">
      <h1>{t('recipes.detailTitle')}</h1>
      <p className="recipe-detail-placeholder">{t('recipes.detailComingSoon', { slug })}</p>
    </div>
  );
}
