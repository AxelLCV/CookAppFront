import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  Home, 
  RecipesList, 
  RecipeDetail, 
  RecipeForm,
  Profile,
  Login,
  Register
} from './pages';
import { ProtectedRoute, useAuth } from '@/features/auth';
import { Button } from './components/ui/Button';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        
        <main className="main-content">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
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

// Composant de navigation séparé
function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">Accueil</Link>
        
        {isAuthenticated && (
          <>
            <Link to="/recipes">Recettes</Link>
            <Link to="/favorites">Favoris</Link>
            <Link to="/profile">Profil</Link>
          </>
        )}
      </div>
      
      <div className="nav-right">
        {isAuthenticated ? (
          <>
            <span className="user-name">Bonjour {user?.username}</span>
            <Button variant="secondary" size="small" onClick={logout}>
              Déconnexion
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="primary" size="small">
                Connexion
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" size="small">
                Inscription
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default App;