import { useEffect, useState } from 'react'
import { getResource } from './api/resource'
import type { Recipe } from './api/resource'


function App() {
  const [data, setData] = useState<Recipe[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getResource('recipes')
      .then((res) => {
      console.log('Donnée brute reçue :', res);
      setData(res); // si tu veux la garder pour affichage
    })
    .catch((err) => {
      console.error(err);
      setError(err.message);
    });
  }, [])

  if (error) return <p>Erreur : {error}</p>
  if (!data) return <p>Chargement…</p>

  return (
  <div>
    {error && <p>Erreur : {error}</p>}
    {!data && !error && <p>Chargement…</p>}
    {data && (
      <pre>{JSON.stringify(data, null, 2)}</pre>
    )}
  </div>
);
}

export default App
