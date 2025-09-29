import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import { AuthProvider } from './providers/AuthProvider.tsx';

// --- 1. IMPORTE O BrowserRouter AQUI ---
import { BrowserRouter as Router } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* --- 2. "ABRACE" TUDO COM O <Router> --- */}
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>,
);