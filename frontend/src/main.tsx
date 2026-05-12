import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { AppProvider } from './context/AppContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  </StrictMode>
)
