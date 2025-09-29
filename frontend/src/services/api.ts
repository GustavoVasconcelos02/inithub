import axios from 'axios';

const baseURL = `${import.meta.env.VITE_API_URL}/api` || "http://localhost:3000/api";

const api = axios.create({
  baseURL,
});

// --- ADIÇÃO INICIA AQUI ---

// Interceptor 1: Anexa o token em TODAS as requisições
api.interceptors.request.use(
  (config) => {
    // Pega o token do armazenamento local do navegador
    const token = localStorage.getItem('accessToken');

    // Se o token existir, o adiciona no cabeçalho de Autorização
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Se houver um erro na configuração da requisição, ele é rejeitado
    return Promise.reject(error);
  },
);

// Interceptor 2: Lida com erros de autenticação (ex: token expirado)
api.interceptors.response.use(
  // Se a resposta for um sucesso (status 2xx), apenas a retorna
  (response) => response,
  // Se a resposta for um erro...
  (error) => {
    // Verificamos se o erro é de "Não Autorizado" (401)
    if (error.response?.status === 401) {
      // Limpa o token inválido/expirado do armazenamento
      localStorage.removeItem('accessToken');
      // Redireciona o usuário para a página de login para autenticar novamente
      // Evita que o usuário fique em uma tela "quebrada" sem acesso
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    // Rejeita a promise para que o erro possa ser tratado em outro lugar (ex: no catch de uma chamada)
    return Promise.reject(error);
  },
);

// --- ADIÇÃO TERMINA AQUI ---

export default api;