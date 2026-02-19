import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/Button';
import './RegisterForm.css';

export function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [languageId, setLanguageId] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);

    try {
      await register({ username, email, password, languageId});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur d\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Inscription</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">Nom</label>
        <input
          id="name"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          minLength={8}
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Country">Country</label>
        <input
          id="country"
          type="number"
          value={languageId}
          onChange={(e) => setLanguageId(parseInt(e.target.value))}
          required
          disabled={isLoading}
        />
      </div>

      <Button 
        variant="primary"
        disabled={isLoading}
      >
        {isLoading ? 'Inscription...' : 'S\'inscrire'}
      </Button>
    </form>
  );
}