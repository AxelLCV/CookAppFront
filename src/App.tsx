import { 
  Home, 
  RecipesList, 
  RecipeDetail, 
  RecipeForm,
  Profile 
} from './pages';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        {/* Navigation */}
        <nav className="navbar">
          <Link to="/">Accueil</Link>
          <Link to="/recipes">Recettes</Link>
          <Link to="/profile">Profil</Link>
        </nav>

        {/* Contenu des pages */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<RecipesList />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/recipes/new" element={<RecipeForm />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;