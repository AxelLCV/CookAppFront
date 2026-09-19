import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/Button';
import './LoginForm.css';

const loginSchema = z.object({
  email: z.string().min(1, 'L\'email est requis').email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [error, setError] = useState('');
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError('');
    try {
      await login(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
      <h2>Connexion</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          disabled={isSubmitting}
          {...register('email')}
        />
        {errors.email && <span className="field-error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          disabled={isSubmitting}
          {...register('password')}
        />
        {errors.password && <span className="field-error">{errors.password.message}</span>}
      </div>

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? 'Connexion...' : 'Se connecter'}
      </Button>
    </form>
  );
}
