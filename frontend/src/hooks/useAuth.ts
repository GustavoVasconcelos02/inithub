import { createContext, useContext } from 'react';
import type { User } from '../types/user'; // Ajuste o caminho se necessário

// 1. Definindo o "contrato": O que o nosso contexto de autenticação vai oferecer?
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// 2. Criando o Contexto com um valor padrão
// O valor padrão é 'undefined' para nos ajudar a garantir que o hook 
// só seja usado dentro do Provedor.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Criando o Hook personalizado
// Este é o hook que os componentes irão usar para acessar a autenticação.
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Se um componente tentar usar o hook fora do Provedor, receberemos um erro claro.
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};