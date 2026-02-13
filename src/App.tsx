import { useEffect, useState } from 'react'
import { Button } from './components/ui/Button'  // ← Ajoutez cette ligne

function App() {
  return (
    <div>
      <h1>Mon App de Recettes</h1>
      
      <Button variant="primary" onClick={() => alert('Favoris !')}>
        ⭐ Ajouter aux favoris
      </Button>
      
      <Button variant="secondary">
        Annuler
      </Button>
      
      <Button variant="danger">
        Supprimer
      </Button>
    </div>
  )
}

export default App