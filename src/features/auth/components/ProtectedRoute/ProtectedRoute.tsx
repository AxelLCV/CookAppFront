import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '@/config/routes';
import { useTranslation } from 'react-i18next';
import './ProtectedRoute.css';

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation('auth');

  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <p>{t("loading")}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}