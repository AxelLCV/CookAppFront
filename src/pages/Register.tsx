import { RegisterForm } from '@/features/auth';
import { Link, Navigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/features/auth';

export function Register() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.RECIPES} replace />
  }

  return (
    <div>
      <RegisterForm />
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}