import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null); // L'utilisateur avec les informations comme le rôle
  const [token, setToken] = useState<string | null>(null);

  // Récupérer les informations depuis le localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setToken(savedToken);
    }
  }, []);

  // Fonction pour se connecter
  const login = (userData: any, accessToken: string) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', accessToken);
  };

  // Fonction pour se déconnecter
  const logout = async () => {
    try {
      if (token) {
        await fetch('http://localhost:8000/api/logout', { // <-- URL backend Laravel
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Important: passer le token
          },
        });
      }
    } catch (error) {
      console.error('Erreur lors du logout:', error);
      // Même si erreur, on continue à vider le localStorage pour forcer la déconnexion
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };
  

  const isAuthenticated = !!user; // L'utilisateur est authentifié s'il existe

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
