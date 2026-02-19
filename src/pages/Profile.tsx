import { useAuth } from '@/features/auth';

export function Profile() {
  const { user } = useAuth();
  return (
    <div>
      <h1>Mon Profil</h1>
      <p>Informations du profil</p>
      <p>Bonjour {user?.username}</p>
    </div>
  );
}