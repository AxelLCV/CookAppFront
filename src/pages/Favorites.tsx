import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Favorites.css';

export function Favorites() {
  const { t } = useTranslation('common');

  return (
    <div className="favorites-page">
      <h1 className="favorites-title">{t('favorites.title')}</h1>
      <div className="favorites-empty">
        <Heart size={48} strokeWidth={1.5} />
        <p>{t('favorites.empty')}</p>
      </div>
    </div>
  );
}
