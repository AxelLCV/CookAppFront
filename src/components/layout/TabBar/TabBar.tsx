import { NavLink } from 'react-router-dom';
import { BookOpen, Heart, PlusCircle, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/config/routes';
import './TabBar.css';

const TABS = [
  { to: ROUTES.RECIPES, icon: BookOpen, labelKey: 'tabBar.recipes' },
  { to: ROUTES.FAVORITES, icon: Heart, labelKey: 'tabBar.favorites' },
  { to: ROUTES.RECIPE_NEW, icon: PlusCircle, labelKey: 'tabBar.new' },
  { to: ROUTES.PROFILE, icon: User, labelKey: 'tabBar.profile' },
] as const;

export function TabBar() {
  const { t } = useTranslation('common');

  return (
    <nav className="tab-bar" aria-label={t('tabBar.navigation')}>
      {TABS.map(({ to, icon: Icon, labelKey }) => (
        <NavLink
          key={to}
          to={to}
          end={to === ROUTES.RECIPES}
          className={({ isActive }) => `tab-bar-item${isActive ? ' tab-bar-item-active' : ''}`}
        >
          <Icon size={22} strokeWidth={2} />
          <span className="tab-bar-label">{t(labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
