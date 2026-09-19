import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/Button';
import './RegisterForm.css';

const registerSchema = z.object({
  username: z.string().min(1, 'Le nom est requis'),
  email: z.string().min(1, 'L\'email est requis').email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string().min(1, 'La confirmation est requise'),
  languageId: z.coerce.number().int().nonnegative(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type RegisterFormInput = z.input<typeof registerSchema>;
type RegisterFormOutput = z.output<typeof registerSchema>;

export function RegisterForm() {
  const [error, setError] = useState('');
  const { register: registerUser } = useAuth();

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
      setError(err instanceof Error ? err.message : 'Erreur d\'inscription');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="register-form" noValidate>
      <h2>Inscription</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="username">Nom</label>
        <input id="username" type="text" disabled={isSubmitting} {...register('username')} />
        {errors.username && <span className="field-error">{errors.username.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" disabled={isSubmitting} {...register('email')} />
        {errors.email && <span className="field-error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Mot de passe</label>
        <input id="password" type="password" disabled={isSubmitting} {...register('password')} />
        {errors.password && <span className="field-error">{errors.password.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
        <input id="confirmPassword" type="password" disabled={isSubmitting} {...register('confirmPassword')} />
        {errors.confirmPassword && <span className="field-error">{errors.confirmPassword.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="languageId">Country</label>
        <input id="languageId" type="number" disabled={isSubmitting} {...register('languageId')} />
        {errors.languageId && <span className="field-error">{errors.languageId.message}</span>}
      </div>

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? 'Inscription...' : 'S\'inscrire'}
      </Button>
    </form>
  );
}
