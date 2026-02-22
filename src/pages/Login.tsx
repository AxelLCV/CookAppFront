import { LoginForm } from '@/features/auth';
import { Link, Navigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/features/auth';
import { useTranslation } from 'react-i18next';

export function Login() {
  const { t } = useTranslation('auth');
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.RECIPES} replace />
  }
  return (
    <div>
      <LoginForm />
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        {t("login.registerQuestion")} <Link to={ROUTES.REGISTER}>{t("login.registerLink")}</Link>
      </p>
    </div>
  );
}