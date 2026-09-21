import { NavLink } from 'react-router-dom';
import { BookOpen, ChefHat, Refrigerator, Calendar, ListTodo } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/config/routes';
import './TabBar.css';

const TABS = [
  { to: ROUTES.RECIPES, icon: BookOpen, labelKey: 'tabBar.recipes' },
  { to: ROUTES.MY_RECIPES, icon: ChefHat, labelKey: 'tabBar.myRecipes' },
  { to: ROUTES.PLANNER, icon: Calendar, labelKey: 'tabBar.planner' },
  { to: ROUTES.KITCHEN, icon: Refrigerator, labelKey: 'tabBar.Kitchen' },
  { to: ROUTES.SHOPPING_LIST, icon: ListTodo, labelKey: 'tabBar.ShoppingList' },
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
          className={({ isActive }) =>
            `tab-bar-item${isActive ? ' tab-bar-item-active' : ''}${to === ROUTES.PLANNER ? ' tab-bar-item-fab' : ''}`
          }
        >
          {to === ROUTES.PLANNER ? (
            <>
              <span className="tab-bar-fab-circle">
                <Icon size={28} strokeWidth={2} />
              </span>
              <span className="tab-bar-label">{t(labelKey)}</span>
            </>
          ) : (
            <>
              <Icon size={22} strokeWidth={2} />
              <span className="tab-bar-label">{t(labelKey)}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
