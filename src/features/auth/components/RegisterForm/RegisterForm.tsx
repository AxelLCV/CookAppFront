import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/Button';
import './RegisterForm.css';

export function RegisterForm() {
  const { t } = useTranslation('auth');
  const [error, setError] = useState('');
  const { register: registerUser } = useAuth();

  const registerSchema = z.object({
    username: z.string().min(1, t('registerForm.usernameRequired')),
    email: z.string().min(1, t('registerForm.emailRequired')).email(t('registerForm.emailInvalid')),
    password: z.string().min(8, t('registerForm.passwordMin')),
    confirmPassword: z.string().min(1, t('registerForm.confirmPasswordRequired')),
    languageId: z.coerce.number().int().nonnegative(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('registerForm.passwordMismatch'),
    path: ['confirmPassword'],
  });

  type RegisterFormInput = z.input<typeof registerSchema>;
  type RegisterFormOutput = z.output<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput, unknown, RegisterFormOutput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { languageId: 0 },
  });

  const onSubmit = async (data: RegisterFormOutput) => {
    setError('');
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        languageId: data.languageId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('registerForm.genericError'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="register-form" noValidate>
      <h2>{t('registerForm.title')}</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="username">{t('registerForm.usernameLabel')}</label>
        <input id="username" type="text" disabled={isSubmitting} {...register('username')} />
        {errors.username && <span className="field-error">{errors.username.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">{t('registerForm.emailLabel')}</label>
        <input id="email" type="email" disabled={isSubmitting} {...register('email')} />
        {errors.email && <span className="field-error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">{t('registerForm.passwordLabel')}</label>
        <input id="password" type="password" disabled={isSubmitting} {...register('password')} />
        {errors.password && <span className="field-error">{errors.password.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">{t('registerForm.confirmPasswordLabel')}</label>
        <input id="confirmPassword" type="password" disabled={isSubmitting} {...register('confirmPassword')} />
        {errors.confirmPassword && <span className="field-error">{errors.confirmPassword.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="languageId">{t('registerForm.languageLabel')}</label>
        <input id="languageId" type="number" disabled={isSubmitting} {...register('languageId')} />
        {errors.languageId && <span className="field-error">{errors.languageId.message}</span>}
      </div>

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? t('registerForm.submitting') : t('registerForm.submit')}
      </Button>
    </form>
  );
}
