import { LearningModule, ModuleId } from '../types';
import { INITIAL_MODULES } from '../constants';

const STORAGE_KEYS = {
  MODULES: 'fort_fruit_modules_v1',
  USER_SESSION: 'fort_fruit_session_v1'
};

// Mock User Database
const USERS = {
  'admin': '123',
  'rh': 'fortfruit2024',
  'ti': 'sistema'
};

export const storageService = {
  // --- DATA / CONTENT METHODS ---

  // Initialize DB with default data if empty
  init: () => {
    const existing = localStorage.getItem(STORAGE_KEYS.MODULES);
    if (!existing) {
      localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(INITIAL_MODULES));
    }
  },

  getModules: (): LearningModule[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MODULES);
    return data ? JSON.parse(data) : INITIAL_MODULES;
  },

  saveModules: (modules: LearningModule[]) => {
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules));
  },

  addContentToModule: (moduleId: ModuleId, type: 'video' | 'document', content: any) => {
    const modules = storageService.getModules();
    const updatedModules = modules.map(mod => {
      if (mod.id === moduleId) {
        if (type === 'video') {
          return {
            ...mod,
            videos: [...mod.videos, { id: Date.now().toString(), ...content }]
          };
        } else {
          return {
            ...mod,
            documents: [...mod.documents, { id: Date.now().toString(), ...content }]
          };
        }
      }
      return mod;
    });
    storageService.saveModules(updatedModules);
    return updatedModules;
  },

  // --- AUTH METHODS ---

  login: async (username: string, pass: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check "Database"
    const validPassword = USERS[username as keyof typeof USERS];
    if (validPassword && validPassword === pass) {
      const sessionData = { user: username, token: 'mock-jwt-token-' + Date.now() };
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(sessionData));
      return true;
    }
    return false;
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
  }
};