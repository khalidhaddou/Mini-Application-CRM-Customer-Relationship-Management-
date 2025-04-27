import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Vous pouvez inclure ici des styles globaux ou spécifiques.
import { AuthProvider } from './context/AuthContext'; 

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
   <AuthProvider> {/* ✅ Ajoutez ceci */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
