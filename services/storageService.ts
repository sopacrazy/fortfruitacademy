import { LearningModule, ModuleId } from "../types";
import { INITIAL_MODULES } from "../constants";

const STORAGE_KEYS = {
  MODULES: "fort_fruit_modules_v1",
  USER_SESSION: "fort_fruit_session_v1",
};

// URL do seu Backend (Node.js)
const API_URL = "http://localhost:3001";

export const storageService = {
  // --- DATA / CONTENT METHODS (Mantemos igual por enquanto) ---

  init: () => {
    const existing = localStorage.getItem(STORAGE_KEYS.MODULES);
    if (!existing) {
      localStorage.setItem(
        STORAGE_KEYS.MODULES,
        JSON.stringify(INITIAL_MODULES)
      );
    }
  },

  getModules: (): LearningModule[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MODULES);
    return data ? JSON.parse(data) : INITIAL_MODULES;
  },

  saveModules: (modules: LearningModule[]) => {
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules));
  },

  addContentToModule: (
    moduleId: ModuleId,
    type: "video" | "document",
    content: any
  ) => {
    const modules = storageService.getModules();
    const updatedModules = modules.map((mod) => {
      if (mod.id === moduleId) {
        if (type === "video") {
          return {
            ...mod,
            videos: [...mod.videos, { id: Date.now().toString(), ...content }],
          };
        } else {
          return {
            ...mod,
            documents: [
              ...mod.documents,
              { id: Date.now().toString(), ...content },
            ],
          };
        }
      }
      return mod;
    });
    storageService.saveModules(updatedModules);
    return updatedModules;
  },

  // --- AUTH METHODS (AQUI ESTÁ A MÁGICA ✨) ---

  login: async (username: string, pass: string): Promise<boolean> => {
    try {
      // Chama o servidor backend real
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
        // Salvamos a sessão no navegador para ele não deslogar no F5
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
        // Login recusado (senha errada ou usuário não existe)
        console.warn("Login falhou:", data.message);
        return false;
      }
    } catch (error) {
      console.error("Erro de conexão com o servidor:", error);
      // Se o servidor estiver desligado, vai cair aqui
      return false;
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
};
