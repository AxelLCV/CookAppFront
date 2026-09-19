import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/Button';
import './LoginForm.css';

export function LoginForm() {
  const { t } = useTranslation('auth');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const loginSchema = z.object({
    email: z.string().min(1, t('loginForm.emailRequired')).email(t('loginForm.emailInvalid')),
    password: z.string().min(1, t('loginForm.passwordRequired')),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

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
      setError(err instanceof Error ? err.message : t('loginForm.genericError'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
      <h2>{t('loginForm.title')}</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="email">{t('loginForm.emailLabel')}</label>
        <input
          id="email"
          type="email"
          disabled={isSubmitting}
          {...register('email')}
        />
        {errors.email && <span className="field-error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">{t('loginForm.passwordLabel')}</label>
        <input
          id="password"
          type="password"
          disabled={isSubmitting}
          {...register('password')}
        />
        {errors.password && <span className="field-error">{errors.password.message}</span>}
      </div>

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? t('loginForm.submitting') : t('loginForm.submit')}
      </Button>
    </form>
  );
}
