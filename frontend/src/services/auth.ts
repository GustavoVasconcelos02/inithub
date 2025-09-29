import api from './api';
// É uma boa prática mover estes tipos para a pasta `src/types` no futuro
import type { User } from '../types/user';

// Interface para os dados enviados ao criar um usuário
// Deve corresponder ao CreateUserDto do seu back-end
export type CreateUserDto = Omit<User, 'id'> & {
  password: string;
};

// Interface para o que o back-end REALMENTE retorna no login
interface BackendLoginResponse {
  access_token: string;
}

class AuthService {
  /**
   * Envia as credenciais de email e senha para o endpoint de login.
   * Apenas repassa a resposta do back-end.
   * @returns A promessa com o objeto { access_token: "..." }
   */
  async login(email: string, password: string): Promise<BackendLoginResponse> {
    const response = await api.post<BackendLoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  /**
   * Envia os dados de um novo usuário para o endpoint de registro.
   * @returns A promessa com o objeto do usuário criado (sem a senha).
   */
  async register(userData: CreateUserDto): Promise<User> {
    const response = await api.post<User>('/auth/register', userData);
    return response.data;
  }
}

// Exporta uma instância única do serviço para ser usada em toda a aplicação
export const authService = new AuthService();