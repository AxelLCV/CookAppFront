import React from 'react'
import ReactDOM from 'react-dom/client'
import { CapacitorUpdater } from '@capgo/capacitor-updater'
import { AuthProvider } from './features/auth/context'
import { checkForUpdate } from './utils/checkForUpdate'
import './i18n'
import App from './App'
import './styles/variables.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)

CapacitorUpdater.notifyAppReady()
checkForUpdate()
