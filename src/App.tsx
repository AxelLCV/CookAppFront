import { useEffect, useState } from 'react'
import { getResource } from './api/resource'
import type { Recipe } from './api/resource'


function App() {
  const [data, setData] = useState<Recipe | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getResource('pates-carbonara')
      .then(setData)
      .catch((err) => setError(err.message))
  }, [])

  if (error) return <p>Erreur : {error}</p>
  if (!data) return <p>Chargement…</p>

  return <h1>{data.name}</h1>
}

export default App
