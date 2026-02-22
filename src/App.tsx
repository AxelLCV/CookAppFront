import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { 
  Home, 
  RecipesList, 
  RecipeDetail, 
  RecipeForm,
  Profile,
  Login,
  Register
} from './pages';
import { ROUTES } from '@/config/routes';
import { ProtectedRoute} from '@/features/auth';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">        
        <main className="main-content">
          <Routes>
            {/* Routes publiques */}
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            
            {/* Routes protégées */}
            <Route 
              path="/recipes" 
              element={
                <ProtectedRoute>
                  <RecipesList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/recipes/:id" 
              element={
                <ProtectedRoute>
                  <RecipeDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/recipes/new" 
              element={
                <ProtectedRoute>
                  <RecipeForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Route 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;