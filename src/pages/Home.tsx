import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/config/routes';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth';

export function Home() {
  const { t } = useTranslation('common');
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.RECIPES} replace />
  }

  return (
    <div>
      <h1>{t('home.welcome')}</h1>
      <Link to={ROUTES.LOGIN}>
        <Button variant="primary">{t('home.login')}</Button>
      </Link>
      <Link to={ROUTES.REGISTER}>
        <Button variant="secondary">{t('home.register')}</Button>
      </Link>
    </div>
  )
}