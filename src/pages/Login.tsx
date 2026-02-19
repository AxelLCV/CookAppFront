import { LoginForm } from '@/features/auth';
import { Link } from 'react-router-dom';

export function Login() {
  return (
    <div>
      <LoginForm />
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Pas encore de compte ? <Link to="/register">S'inscrire</Link>
      </p>
    </div>
  );
}