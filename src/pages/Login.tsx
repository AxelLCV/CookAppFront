import { LoginForm } from '@/features/auth';
import { Link, Navigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/features/auth';

export function Login() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.RECIPES} replace />
  }
  return (
    <div>
      <LoginForm />
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Pas encore de compte ? <Link to="/register">S'inscrire</Link>
      </p>
    </div>
  );
}