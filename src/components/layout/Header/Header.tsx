import { Link } from 'react-router-dom';
import { CircleUserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/config/routes';
import { useHousehold } from '@/features/household';
import './Header.css';

export function Header() {
  const { t } = useTranslation('common');
  const { currentHousehold } = useHousehold();

  return (
    <header className="app-header">
      <img src="/icons/icon-192.png" alt={t('home.welcome')} className="app-header-logo" />

      <span className="app-header-household">
        {currentHousehold?.name ?? t('header.noHousehold')}
      </span>

      <Link to={ROUTES.PROFILE} className="app-header-profile" aria-label={t('header.settings')}>
        <CircleUserRound size={28} strokeWidth={1.5} />
      </Link>
    </header>
  );
}
