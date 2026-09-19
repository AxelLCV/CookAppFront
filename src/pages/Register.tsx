import { RegisterForm } from '@/features/auth';
import { Link, Navigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/features/auth';
import { useTranslation } from 'react-i18next';
import './Register.css';

export function Register() {
  const { t } = useTranslation('auth');
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.RECIPES} replace />
  }
  return (
    <div>
      <RegisterForm />
      <p className="register-page-footer">
        {t("register.loginQuestion")} <Link to={ROUTES.LOGIN}>{t("register.loginLink")}</Link>
      </p>
    </div>
  );
}