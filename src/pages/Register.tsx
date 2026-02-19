import { RegisterForm } from '@/features/auth';
import { Link } from 'react-router-dom';

export function Register() {
  return (
    <div>
      <RegisterForm />
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}