// /components/ContentManagementPanel.tsx - ATUALIZADO COM MODAL

import React, { useState } from "react";
import { LearningModule, Video, DocumentResource } from "../types";
import {
  Trash2,
  Edit,
  ChevronDown,
  ChevronRight,
  Folder,
  Film,
  FileText,
  XCircle,
  Play,
} from "lucide-react";
import { storageService } from "../services/storageService";
import ConfirmationModal from "./ConfirmationModal"; // Importa o novo modal

interface ContentManagementPanelProps {
  modules: LearningModule[];
  onModulesUpdated: (updatedModules: LearningModule[]) => void;
}

// Interface para controlar o estado do modal
interface DeletionTarget {
  type: "video" | "document";
  id: string;
  title: string;
}

const ContentManagementPanel: React.FC<ContentManagementPanelProps> = ({
  modules,
  onModulesUpdated,
}) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // NOVO ESTADO: Armazena o item alvo da exclusão para o modal
  const [deletionTarget, setDeletionTarget] = useState<DeletionTarget | null>(
    null
  );

  // ... (toggleModule, toggleCategory, getGroupedVideos permanecem os mesmos) ...
  const toggleModule = (id: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedModules(newExpanded);
    if (!newExpanded.has(id)) {
      setExpandedCategories(new Set());
    }
  };

  const toggleCategory = (moduleId: string, category: string) => {
    const key = `${moduleId}-${category}`;
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedCategories(newExpanded);
  };

  const getGroupedVideos = (module: LearningModule) => {
    const groups: Record<string, Video[]> = {};
    module.videos.forEach((video) => {
      const cat = video.category || "Geral";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(video);
    });
    return groups;
  };
  // ... (getGroupedVideos function ends) ...

  // NOVA FUNÇÃO: Abre o modal de confirmação
  const openDeleteModal = (
    type: "video" | "document",
    id: string,
    title: string
  ) => {
    setDeletionTarget({ type, id, title });
  };

  // FUNÇÃO DE EXCLUSÃO REAL (Chamada pelo modal)
  const executeDelete = async () => {
    if (!deletionTarget) return;

    setIsDeleting(true);
    setDeletionTarget(null); // Fecha o modal imediatamente

    try {
      // Chama a função de exclusão do storageService que recarrega os módulos
      const updatedModules = await storageService.deleteContent(
        deletionTarget.type,
        deletionTarget.id
      );
      onModulesUpdated(updatedModules);
    } catch (error) {
      console.error("Erro ao excluir conteúdo:", error);
      alert(
        `Falha ao excluir o ${deletionTarget.type}. Verifique a conexão e o servidor.`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Botões de Ação
  const ActionButtons = (
    type: "video" | "document",
    id: string,
    title: string
  ) => (
    <div className="flex gap-2 items-center">
      {/* Substituímos a confirmação padrão pela abertura do modal customizado */}
      <button
        onClick={() => openDeleteModal(type, id, title)}
        disabled={isDeleting}
        className="text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
        title="Excluir"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  // RENDERIZAÇÃO PRINCIPAL
  return (
    <>
      <div className="space-y-4">
        {modules.length === 0 && (
          <div className="p-10 text-center bg-gray-50 rounded-lg text-gray-500">
            <XCircle size={32} className="mx-auto mb-2 text-red-400" />
            <p className="font-semibold">
              Nenhum módulo de treinamento encontrado.
            </p>
          </div>
        )}

        {modules.map((module) => {
          const isModuleExpanded = expandedModules.has(module.id);
          const groupedVideos = getGroupedVideos(module);

          return (
            <div
              key={module.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* MÓDULO HEADER */}
              <button
                onClick={() => toggleModule(module.id)}
                className={`w-full flex items-center p-4 text-left font-bold transition-colors ${
                  isModuleExpanded
                    ? "bg-fort-50 text-fort-700"
                    : "hover:bg-gray-50 text-gray-800"
                }`}
              >
                {isModuleExpanded ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
                <span className="ml-2">
                  {module.name} (
                  {module.videos.length + module.documents.length} itens)
                </span>
              </button>

              {/* CONTEÚDO EXPANDIDO */}
              {isModuleExpanded && (
                <div className="p-4 space-y-4">
                  {/* LISTAGEM DE VÍDEOS */}
                  <h4 className="text-sm font-semibold text-gray-600 border-b pb-2 mb-3 flex items-center gap-2">
                    <Film size={16} /> Vídeos por Categoria
                  </h4>
                  {Object.entries(groupedVideos).map(([category, videos]) => {
                    const categoryKey = `${module.id}-${category}`;
                    const isCategoryExpanded =
                      expandedCategories.has(categoryKey);

                    return (
                      <div
                        key={categoryKey}
                        className="border border-gray-100 rounded-lg overflow-hidden"
                      >
                        {/* CATEGORIA HEADER */}
                        <button
                          onClick={() => toggleCategory(module.id, category)}
                          className="w-full flex items-center p-3 text-left bg-gray-50 hover:bg-gray-100 text-sm font-medium transition-colors"
                        >
                          {isCategoryExpanded ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                          <span className="ml-2 flex items-center gap-2 text-gray-700">
                            <Folder size={16} className="text-orange-500" />{" "}
                            {category} ({videos.length})
                          </span>
                        </button>

                        {/* VÍDEOS DA CATEGORIA */}
                        {isCategoryExpanded && (
                          <div className="divide-y divide-gray-100 bg-white">
                            {videos.map((video) => (
                              <div
                                key={video.id}
                                className="flex justify-between items-center p-3 hover:bg-gray-50 text-sm"
                              >
                                <span className="font-medium text-gray-800 flex items-center gap-2">
                                  <Play size={16} className="text-fort-500" />{" "}
                                  {video.title}
                                </span>
                                {ActionButtons("video", video.id, video.title)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* LISTAGEM DE DOCUMENTOS */}
                  <h4 className="text-sm font-semibold text-gray-600 border-b pt-4 pb-2 mb-3 flex items-center gap-2">
                    <FileText size={16} /> Documentos ({module.documents.length}
                    )
                  </h4>
                  <div className="divide-y divide-gray-100 bg-white border border-gray-100 rounded-lg">
                    {module.documents.map((doc: DocumentResource) => (
                      <div
                        key={doc.id}
                        className="flex justify-between items-center p-3 hover:bg-gray-50 text-sm"
                      >
                        <span className="font-medium text-gray-800 flex items-center gap-2">
                          <FileText size={16} className="text-red-500" />{" "}
                          {doc.title} ({doc.type})
                        </span>
                        {ActionButtons("document", doc.id, doc.title)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL CUSTOMIZADO DE CONFIRMAÇÃO */}
      {deletionTarget && (
        <ConfirmationModal
          isOpen={!!deletionTarget}
          onConfirm={executeDelete}
          onCancel={() => setDeletionTarget(null)}
          title={`Confirmar Exclusão de ${
            deletionTarget.type === "video" ? "Vídeo" : "Arquivo"
          }`}
          message={`Você tem certeza que deseja excluir permanentemente o item "${deletionTarget.title}"? Esta ação não pode ser desfeita.`}
          confirmText="Excluir Permanentemente"
        />
      )}
    </>
  );
};

export default ContentManagementPanel;
