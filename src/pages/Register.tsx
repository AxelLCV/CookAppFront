import { RegisterForm } from '@/features/auth';
import { Link, Navigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/features/auth';
import { useTranslation } from 'react-i18next';

export function Register() {
  const { t } = useTranslation('auth');
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.RECIPES} replace />
  }
  return (
    <div>
      <RegisterForm />
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        {t("register.loginQuestion")} <Link to={ROUTES.LOGIN}>{t("regisyer.loginLink")}</Link>
      </p>
    </div>
  );
}