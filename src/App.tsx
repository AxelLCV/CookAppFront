import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  Home,
  RecipesList,
  RecipeDetail,
  RecipeForm,
  RecipeEdit,
  Favorites,
  Profile,
  Login,
  Register
} from './pages';
import { ROUTES } from '@/config/routes';
import { ProtectedRoute } from '@/features/auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAndroidBackButton } from '@/hooks/useAndroidBackButton';

function App() {
  useAndroidBackButton();

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques, sans tab bar */}
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        {/* Routes protégées, avec shell applicatif (tab bar) */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.RECIPES} element={<RecipesList />} />
          <Route path="/recipes/:slug" element={<RecipeDetail />} />
          <Route path={ROUTES.RECIPE_NEW} element={<RecipeForm />} />
          <Route path="/recipes/:slug/edit" element={<RecipeEdit />} />
          <Route path={ROUTES.FAVORITES} element={<Favorites />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
        </Route>

        {/* Route 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
