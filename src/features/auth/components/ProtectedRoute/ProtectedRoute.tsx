import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '@/config/routes';

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Pendant le chargement, afficher un loader
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <p>Chargement...</p>
      </div>
    );
  }

  // Si pas authentifié, rediriger vers /login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Si authentifié, afficher le contenu
  return <>{children}</>;
}