import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './features/auth/context'
import App from './App'

import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('Nouvelle version disponible')
    updateSW(true)
  },
  onOfflineReady() {
    console.log('App prête hors ligne')
  },
})


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
