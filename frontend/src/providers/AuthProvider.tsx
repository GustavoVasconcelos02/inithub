// Imports permanecem os mesmos...
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../hooks/useAuth';
import type { AuthContextType } from '../hooks/useAuth';
import type { User } from '../types/user';
import api from '../services/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // useEffect permanece o mesmo...
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api
        .get('/auth/profile')
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('accessToken');
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // --- CORREÇÃO AQUI ---
  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', data.access_token);
      
      const userResponse = await api.get('/auth/profile');
      // A linha abaixo vai agendar a atualização do estado.
      // A mudança será refletida na próxima renderização.
      setUser(userResponse.data);

      // O redirecionamento será tratado pelo componente LoginRoute
      // que detectará a mudança no estado 'isAuthenticated'.
      // navigate('/home'); // <-- REMOVEMOS A NAVEGAÇÃO DAQUI

    } catch (error) {
      console.error('Falha no login', error);
      throw error;
    }
  };
  // --- FIM DA CORREÇÃO ---

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const authContextValue: AuthContextType = {
    isAuthenticated: !!user,
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};