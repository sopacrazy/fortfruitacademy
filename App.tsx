import React, { useState, useEffect } from "react";
// Assumindo que os componentes Dashboard, ModulePlayer, AdminPanel e Login
// estão em seus respectivos arquivos .jsx ou .tsx.
import Dashboard from "./components/Dashboard";
import ModulePlayer from "./components/ModulePlayer";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";

import { LearningModule, ModuleId } from "./types";
import { storageService } from "./services/storageService";
import { BookText, Settings, LogOut } from "lucide-react";
import WelcomeVideoModal from "./components/WelcomeVideoModal";

type ViewState = "dashboard" | "player" | "admin";

// Constante do ID do vídeo de boas-vindas
const WELCOME_VIDEO_ID = "1k9mSVak35XTNuizRmr6yBiqzYpkquwng";
const WELCOME_VIDEO_EMBED_URL = `https://drive.google.com/file/d/${WELCOME_VIDEO_ID}/preview`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [currentModuleId, setCurrentModuleId] = useState<ModuleId | null>(null);
  const [view, setView] = useState<ViewState>("dashboard");
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const isAdmin = userRole === "admin";
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(true);

  // NOVO: Função para atualizar o estado de módulos após operações de CRUD
  const handleModulesUpdated = (updatedModules: LearningModule[]) => {
    setModules(updatedModules);
  };

  // =========================================================================
  // FUNÇÕES AUXILIARES MOVIDAS PARA DENTRO DO COMPONENTE
  // =========================================================================

  const handleLogin = async (user: string, pass: string) => {
    const success = await storageService.login(user, pass);
    if (success) {
      const role = storageService.getUserRole();
      setIsAuthenticated(true);
      setCurrentUser(user);
      setUserRole(role);

      setShowWelcomeVideo(true);
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    storageService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserRole(null);
    setView("dashboard");
    setCurrentModuleId(null);
  };

  const handleModuleSelect = (module: LearningModule) => {
    setCurrentModuleId(module.id);
    setView("player");
  };

  const handleBackToDashboard = () => {
    if (view === "admin") {
      setView("dashboard");
    }
    setCurrentModuleId(null);
  };

  const handleAddContent = async (
    moduleId: ModuleId,
    type: "video" | "document",
    data: any
  ) => {
    if (!isAdmin) {
      alert("Acesso negado. Apenas administradores podem adicionar conteúdo.");
      return;
    }

    setIsLoading(true);
    try {
      const updatedModules = await storageService.addContentToModule(
        moduleId,
        type,
        data
      );
      setModules(updatedModules);
    } catch (error) {
      console.error("Erro ao adicionar conteúdo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseWelcomeVideo = () => {
    setShowWelcomeVideo(false);
  };

  const getCurrentModule = () => modules.find((m) => m.id === currentModuleId);

  // =========================================================================

  // Carregamento Inicial (UseEffect)
  useEffect(() => {
    const loadData = async () => {
      storageService.init();

      const hasSession = storageService.checkSession();
      if (hasSession) {
        const user = storageService.getUser();
        const role = storageService.getUserRole();

        setIsAuthenticated(true);
        setCurrentUser(user);
        setUserRole(role);
      }

      const savedModules = await storageService.getModules();
      setModules(savedModules);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fort-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (view === "admin" && !isAdmin) {
    setView("dashboard");
  }

  return (
    <div className="h-full bg-gray-50 font-sans text-gray-900">
      {view === "player" && getCurrentModule() ? (
        <ModulePlayer
          module={getCurrentModule()!}
          onBack={handleBackToDashboard}
        />
      ) : (
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Global Header */}
          <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-30 shrink-0">
            <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={handleBackToDashboard}
              >
                <div className="bg-fort-500 p-2 rounded-lg text-white shadow-lg shadow-fort-200">
                  <BookText size={24} />
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-800">
                  Fort Fruit{" "}
                  <span className="text-fort-600 font-normal">Aprendizado</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                {isAdmin && view !== "admin" && (
                  <button
                    onClick={() => setView("admin")}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-fort-600 bg-gray-100 hover:bg-fort-50 px-3 py-2 rounded-full transition-colors"
                  >
                    <Settings size={14} /> Gestão
                  </button>
                )}
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800 uppercase">
                    {currentUser || "Usuário"}
                  </p>
                  <p className="text-xs text-fort-600 flex items-center justify-end gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>{" "}
                    {userRole || "Padrão"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fort-400 to-fort-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white uppercase">
                  {(currentUser || "US").substring(0, 2)}
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1">
            {view === "admin" ? (
              <AdminPanel
                modules={modules}
                onAddContent={handleAddContent}
                onModulesUpdated={handleModulesUpdated}
                onClose={() => setView("dashboard")}
              />
            ) : (
              <Dashboard
                modules={modules}
                onModuleSelect={handleModuleSelect}
              />
            )}
          </main>

          <footer className="bg-white border-t border-gray-200 mt-auto py-8 text-center text-gray-400 text-sm shrink-0">
            <p>
              &copy; {new Date().getFullYear()} Fort Fruit. Todos os direitos
              reservados.
            </p>
            <p className="mt-1">Desenvolvido para treinamento interno.</p>
          </footer>
        </div>
      )}

      {/* Componente do Modal de Boas-Vindas */}
      {isAuthenticated && (
        <WelcomeVideoModal
          isOpen={showWelcomeVideo}
          onClose={handleCloseWelcomeVideo}
          embedUrl={WELCOME_VIDEO_EMBED_URL}
        />
      )}
    </div>
  );
}

export default App;
