import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth';
import { Button } from '@/components/ui/Button';
import './Profile.css';

export function Profile() {
  const { t } = useTranslation('common');
  const { user, logout } = useAuth();

  return (
    <div className="profile-page">
      <h1>{t('profile.title')}</h1>
      <p>{t('profile.greeting', { username: user?.username })}</p>
      <Button variant="danger" onClick={logout}>{t('home.logoff')}</Button>
    </div>
  );
}
