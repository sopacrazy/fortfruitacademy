import { LearningModule, ModuleId } from "../types";
// Removida a importação de INITIAL_MODULES, pois os dados virão do MySQL

const STORAGE_KEYS = {
  // Apenas a sessão permanece no LocalStorage
  USER_SESSION: "fort_fruit_session_v1",
};

// --------------------------------------------------------------------------
// CORREÇÃO FINAL: Define API_URL de uma vez com o fallback local.
// A constante é definida como a variável de ambiente OU o localhost,
// eliminando o erro 'Assignment to constant variable'.
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3005";
// --------------------------------------------------------------------------

// Adiciona um aviso mais limpo para fins de desenvolvimento
if (
  API_URL === "http://localhost:3005" &&
  process.env.NODE_ENV !== "production"
) {
  console.warn(
    "ALERTA DE DESENVOLVIMENTO: REACT_APP_API_URL não encontrada. Usando URL de fallback: http://localhost:3005"
  );
}

export const storageService = {
  // --- DATA / CONTENT METHODS ---

  // O init não é mais responsabilidade do frontend, mas mantemos como função vazia (NO-OP)
  init: () => {
    // Inicialização de dados movida para o backend/scripts SQL
  },

  // 1. OBTEM MÓDULOS (CHAMANDO O BACKEND)
  getModules: async (): Promise<LearningModule[]> => {
    try {
      // Usa a API_URL dinâmica
      const response = await fetch(`${API_URL}/modules`);
      if (!response.ok) {
        // Lança erro se a resposta não for 200-299
        throw new Error(`Erro ao buscar módulos: ${response.statusText}`);
      }
      // Retorna a lista completa de módulos aninhados que o server.js montou
      const data = await response.json();
      return data as LearningModule[];
    } catch (error) {
      console.error("Erro de conexão ou ao carregar módulos:", error);
      // Em caso de falha de comunicação, retorna um array vazio para não quebrar a aplicação.
      return [];
    }
  },

  // 2. ADICIONA CONTEÚDO (CHAMANDO O BACKEND)
  addContentToModule: async (
    moduleId: ModuleId,
    type: "video" | "document",
    content: any
  ): Promise<LearningModule[]> => {
    try {
      // Usa a API_URL dinâmica
      const response = await fetch(`${API_URL}/content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ moduleId, type, data: content }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar conteúdo: ${response.statusText}`);
      }

      // A API de back-end (server.js) retorna sucesso, mas não a lista completa.
      // Recarregamos a lista de módulos (incluindo o novo conteúdo) e retornamos:
      return storageService.getModules();
    } catch (error) {
      console.error("Erro ao adicionar conteúdo no servidor:", error);
      throw error; // Propaga para o App.tsx tratar o 'finally' de isLoading
    }
  },

  // NOVO: Adiciona a função para excluir conteúdo
  deleteContent: async (
    type: "video" | "document",
    id: string
  ): Promise<LearningModule[]> => {
    try {
      // Usa a API_URL dinâmica
      const response = await fetch(`${API_URL}/content/${type}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        // Inclui mensagens de erro do backend (404, 400, etc.)
        throw new Error(
          data.message || "Erro desconhecido ao excluir conteúdo."
        );
      }

      // Se deu certo, recarrega a lista completa de módulos e retorna
      return storageService.getModules();
    } catch (error) {
      console.error("Erro de conexão ao excluir conteúdo:", error);
      throw error;
    }
  },

  // --- AUTH METHODS (Mantidos) ---

  login: async (username: string, pass: string): Promise<boolean> => {
    try {
      // Usa a API_URL dinâmica
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password: pass }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Login aprovado pelo MySQL!
        const sessionData = {
          user: data.user,
          role: data.role,
          token: "token-fake-por-enquanto",
        };
        localStorage.setItem(
          STORAGE_KEYS.USER_SESSION,
          JSON.stringify(sessionData)
        );
        return true;
      } else {
        console.warn("Login falhou:", data.message);
        return false;
      }
    } catch (error) {
      console.error("Erro de conexão com o servidor:", error);
      return false;
    }
  },

  // NOVO: Adiciona a função para criar um novo usuário
  addUser: async (
    username: string,
    pass: string,
    role: string
  ): Promise<boolean> => {
    try {
      // Usa a API_URL dinâmica
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password: pass, role }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return true;
      } else {
        // Se o servidor retornar 409 (usuário existe) ou 400, lança o erro para o componente
        throw new Error(
          data.message || "Erro desconhecido ao adicionar usuário."
        );
      }
    } catch (error) {
      // Erro de rede/conexão
      console.error("Erro de conexão ao adicionar usuário:", error);
      throw new Error(
        "Não foi possível conectar ao servidor para adicionar usuário."
      );
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
  },

  checkSession: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.USER_SESSION);
  },

  getUser: () => {
    const session = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return session ? JSON.parse(session).user : null;
  },

  // NOVO: Adiciona a função para obter o role
  getUserRole: () => {
    const session = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    // Retorna o role, se existir. Caso contrário, retorna 'Padrão' ou null.
    return session ? JSON.parse(session).role : null;
  },
};
