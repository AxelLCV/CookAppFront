import { useAuth } from '@/features/auth';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export function RecipesList() {
  const { t } = useTranslation('common');
  const { logout } = useAuth();
  return (
    <div>
      <h1>Liste des Recettes</h1>
      <p>Toutes les recettes seront affichées ici</p>
      <Button variant="primary" onClick={logout}>{t('home.logoff')}</Button>
    </div>
  );
}