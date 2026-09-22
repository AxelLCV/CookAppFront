import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, ChefHat, Refrigerator, Calendar, ShoppingCart, Plus, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/config/routes';
import './TabBar.css';

const TABS = [
  { to: ROUTES.RECIPES, icon: BookOpen, labelKey: 'tabBar.recipes' },
  { to: ROUTES.MY_RECIPES, icon: ChefHat, labelKey: 'tabBar.myRecipes' },
  { to: ROUTES.PLANNER, icon: Calendar, labelKey: 'tabBar.planner' },
  { to: ROUTES.KITCHEN, icon: Refrigerator, labelKey: 'tabBar.Kitchen' },
  { to: ROUTES.SHOPPING_LIST, icon: ShoppingCart, labelKey: 'tabBar.ShoppingList' },
] as const;

// Le bouton flottant change de destination selon la page en cours.
// Ajoute une entrée ici à chaque fois qu'une nouvelle page a besoin de sa propre action rapide.
const EXTRA_BUTTON_BY_PAGE = [
  { whenOn: ROUTES.RECIPES, icon: Heart, to: ROUTES.FAVORITES, labelKey: 'tabBar.favorites' },
  { whenOn: ROUTES.MY_RECIPES, icon: Plus, to: ROUTES.RECIPE_NEW, labelKey: 'tabBar.recipeNew' },
  { whenOn: ROUTES.PLANNER, icon: Plus, to: ROUTES.NEW_PROMPT, labelKey: 'tabBar.newPrompt' },
  { whenOn: ROUTES.KITCHEN, icon: Plus, to: ROUTES.ADD_INGREDIENTS, labelKey: 'tabBar.addIngredients' },
  { whenOn: ROUTES.SHOPPING_LIST, icon: Plus, to: ROUTES.ADD_ELEMENTS, labelKey: 'tabBar.addElements' },
] as const;
const DEFAULT_EXTRA_BUTTON = EXTRA_BUTTON_BY_PAGE[0];

export function TabBar() {
  const { t } = useTranslation('common');
  const { pathname } = useLocation();

  const extraButton =
    EXTRA_BUTTON_BY_PAGE.find((entry) => pathname.startsWith(entry.whenOn)) ?? DEFAULT_EXTRA_BUTTON;
  const ExtraIcon = extraButton.icon;

  return (
    <>
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
                <span className="tab-bar-fab-spacer" aria-hidden="true" />
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
      <NavLink to={extraButton.to} className="tab-bar-extra-button">
        <ExtraIcon size={28} strokeWidth={2} />
      </NavLink>
    </>
    );
}
