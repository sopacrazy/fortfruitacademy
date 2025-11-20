// /components/AdminPanel.tsx - COMPLETO E ATUALIZADO

import React, { useState, useMemo } from "react";
import { LearningModule, ModuleId, Video } from "../types";
import {
  Upload,
  Film,
  FileText,
  CheckCircle,
  AlertCircle,
  FolderPlus,
  Users,
  List, // NOVO ÍCONE
} from "lucide-react";
// Importação dos novos componentes
import UserManagementPanel from "./UserManagementPanel";
import ContentManagementPanel from "./ContentManagementPanel"; // NOVO: Componente de listagem/exclusão

interface AdminPanelProps {
  modules: LearningModule[];
  onAddContent: (
    moduleId: ModuleId,
    type: "video" | "document",
    data: any
  ) => void;
  // NOVO PROP: Para atualizar o estado de módulos no App.tsx após exclusão
  onModulesUpdated: (updatedModules: LearningModule[]) => void;
  onClose: () => void;
}

// Tipo de estado principal do painel: Content Management ou User Management
type AdminPanelMode = "content" | "users";
// Tipo de sub-estado para Content Management
type ContentMode = "add" | "manage";

const AdminPanel: React.FC<AdminPanelProps> = ({
  modules,
  onAddContent,
  onModulesUpdated, // Usado para atualizar o App.tsx após exclusão
  onClose,
}) => {
  const [mode, setMode] = useState<AdminPanelMode>("content");
  // NOVO ESTADO: Sub-menu para Conteúdo (Adicionar ou Gerenciar)
  const [contentMode, setContentMode] = useState<ContentMode>("add");

  // Estados existentes para a aba de Conteúdo
  const [activeTab, setActiveTab] = useState<"video" | "document">("video");
  const [selectedModule, setSelectedModule] = useState<string>(
    modules.length > 0 ? modules[0].id : ""
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [docType, setDocType] = useState<"PDF" | "DOC" | "XLS" | "LINK">("PDF");

  const existingCategories = useMemo(() => {
    const mod = modules.find((m) => m.id === selectedModule);
    if (!mod) return [];
    return Array.from(
      new Set(mod.videos.map((v: Video) => v.category || "Geral"))
    );
  }, [selectedModule, modules]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const brandedThumbnailUrl = `https://placehold.co/400x225/000000/000000.png`;

    if (activeTab === "video") {
      onAddContent(selectedModule as ModuleId, "video", {
        title,
        description,
        duration: duration || "00:00",
        category: category || "Geral",
        thumbnailUrl: brandedThumbnailUrl,
        videoUrl: url,
      });
      setSuccessMessage("Vídeo adicionado com sucesso!");
    } else {
      onAddContent(selectedModule as ModuleId, "document", {
        title,
        type: docType,
        url: url || "#",
      });
      setSuccessMessage("Arquivo adicionado com sucesso!");
    }

    // Reset form
    setTitle("");
    setDescription("");
    setUrl("");
    setDuration("");
    setCategory("");

    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Função para atualizar o estado dos módulos no App.tsx, passada para o ContentManagementPanel
  const handleModulesUpdated = (updatedModules: LearningModule[]) => {
    onModulesUpdated(updatedModules);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          {/* TÍTULO DINÂMICO */}
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            {mode === "content" ? (
              <Upload className="text-fort-500" />
            ) : (
              <Users className="text-fort-500" />
            )}
            {mode === "content" ? "Gestão de Conteúdo" : "Gestão de Usuários"}
          </h2>
          <p className="text-gray-500 mt-1">
            {mode === "content"
              ? contentMode === "add"
                ? "Adicione novos materiais de treinamento."
                : "Visualize e exclua o conteúdo existente."
              : "Crie e gerencie as contas de acesso dos colaboradores."}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-gray-800 underline"
        >
          Voltar ao Portal
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* TABS PRINCIPAIS */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setMode("content")}
            className={`flex-1 py-4 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              mode === "content"
                ? "bg-fort-50 text-fort-600 border-b-2 border-fort-500"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Film size={18} /> Conteúdo (Vídeos/Docs)
          </button>
          <button
            onClick={() => setMode("users")}
            className={`flex-1 py-4 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              mode === "users"
                ? "bg-fort-50 text-fort-600 border-b-2 border-fort-500"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Users size={18} /> Usuários
          </button>
        </div>
        {/* FIM TABS PRINCIPAIS */}

        <div className="p-8">
          {/* CONTEÚDO: MODO DE GESTÃO DE CONTEÚDO */}
          {mode === "content" && (
            <>
              {/* NOVO: TABS SECUNDÁRIAS (Adicionar/Gerenciar) */}
              <div className="flex border-b border-gray-100 mb-6">
                <button
                  onClick={() => setContentMode("add")}
                  className={`py-2 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    contentMode === "add"
                      ? "text-fort-600 border-b-2 border-fort-500"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Upload size={14} /> Adicionar Novo
                </button>
                <button
                  onClick={() => setContentMode("manage")}
                  className={`py-2 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    contentMode === "manage"
                      ? "text-fort-600 border-b-2 border-fort-500"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <List size={14} /> Gerenciar Existente
                </button>
              </div>
              {/* FIM TABS SECUNDÁRIAS */}

              {/* EXIBIÇÃO: Gerenciar Conteúdo */}
              {contentMode === "manage" && (
                <ContentManagementPanel
                  modules={modules}
                  onModulesUpdated={handleModulesUpdated} // Passa a função de atualização
                />
              )}

              {/* EXIBIÇÃO: Adicionar Conteúdo */}
              {contentMode === "add" && (
                <>
                  {/* TABS Terciárias (Video/Documento) */}
                  <div className="flex border-b border-gray-100 mb-6">
                    <button
                      onClick={() => setActiveTab("video")}
                      className={`py-2 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                        activeTab === "video"
                          ? "text-fort-600 border-b-2 border-fort-500"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <Film size={14} /> Novo Vídeo
                    </button>
                    <button
                      onClick={() => setActiveTab("document")}
                      className={`py-2 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                        activeTab === "document"
                          ? "text-fort-600 border-b-2 border-fort-500"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <FileText size={14} /> Novo Arquivo
                    </button>
                  </div>

                  {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2 animate-fade-in">
                      <CheckCircle size={20} /> {successMessage}
                    </div>
                  )}

                  {/* FORMULÁRIO DE CONTEÚDO */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Module Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Departamento de Destino
                      </label>
                      <select
                        value={selectedModule}
                        onChange={(e) => {
                          setSelectedModule(e.target.value);
                          setCategory("");
                        }}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fort-500 focus:border-fort-500 outline-none transition-all"
                      >
                        {modules.map((mod) => (
                          <option key={mod.id} value={mod.id}>
                            {mod.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Common Fields (Título) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título do Conteúdo
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={
                          activeTab === "video"
                            ? "Ex: Treinamento de Segurança"
                            : "Ex: Manual de Conduta.pdf"
                        }
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fort-500 outline-none transition-all"
                      />
                    </div>

                    {/* Video Specific */}
                    {activeTab === "video" && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Duração (MM:SS)
                            </label>
                            <input
                              type="text"
                              placeholder="10:00"
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fort-500 outline-none"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                              <FolderPlus size={16} className="text-fort-500" />{" "}
                              Categoria
                            </label>
                            <input
                              type="text"
                              list="category-suggestions"
                              placeholder="Selecione ou crie uma nova..."
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fort-500 outline-none"
                              required
                            />
                            <datalist id="category-suggestions">
                              {existingCategories.map((cat) => (
                                <option key={cat} value={cat} />
                              ))}
                            </datalist>
                            <p className="text-xs text-gray-400 mt-1">
                              Sugestões baseadas no departamento:{" "}
                              {selectedModule}
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Link do Vídeo (URL)
                          </label>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fort-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descrição
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Breve resumo do conteúdo abordado no vídeo..."
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fort-500 outline-none"
                          />
                        </div>
                      </>
                    )}

                    {/* Document Specific */}
                    {activeTab === "document" && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tipo de Arquivo
                            </label>
                            <select
                              value={docType}
                              onChange={(e) =>
                                setDocType(e.target.value as any)
                              }
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fort-500 outline-none"
                            >
                              <option value="PDF">
                                PDF (Documento Portátil)
                              </option>
                              <option value="DOC">DOC/DOCX (Word)</option>
                              <option value="XLS">XLS/XLSX (Excel)</option>
                              <option value="LINK">
                                LINK/URL (Imagem, Drive, etc.)
                              </option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Link ou Caminho do Arquivo
                            </label>
                            <input
                              type="text"
                              placeholder="Ex: Link de compartilhamento do Google Drive (Acesso Público)"
                              value={url}
                              onChange={(e) => setUrl(e.target.value)}
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fort-500 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descrição (Opcional)
                          </label>
                          <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Breve resumo do conteúdo do arquivo..."
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fort-500 outline-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-fort-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-fort-600 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        {activeTab === "video" ? (
                          <Film size={20} />
                        ) : (
                          <Upload size={20} />
                        )}
                        {activeTab === "video"
                          ? "Publicar Vídeo"
                          : "Carregar Arquivo"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </>
          )}

          {/* CONTEÚDO: MODO DE GESTÃO DE USUÁRIOS */}
          {mode === "users" && <UserManagementPanel />}
        </div>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <AlertCircle size={14} />
            Todas as alterações são salvas no banco de dados da Fort Fruit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
