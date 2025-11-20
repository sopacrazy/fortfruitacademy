import React, { useState, useEffect, useMemo } from "react";
import { LearningModule, Video } from "../types";
import {
  Play,
  Clock,
  ChevronLeft,
  Sparkles,
  MessageSquare,
  FileText,
  Download,
  Video as VideoIcon,
  ChevronDown,
  ChevronRight,
  Folder,
} from "lucide-react";
import AIAssistant from "./AIAssistant";

interface ModulePlayerProps {
  module: LearningModule;
  onBack: () => void;
}

// 1. FUNÇÃO UTILITÁRIA ROBUSTA PARA EXTRAIR O ID DO VÍDEO DO YOUTUBE
const getYouTubeId = (url: string | undefined): string | null => {
  if (!url) return null;

  let match = url.match(/(?:[?&]v=)([^&]+)/);
  if (match) return match[1];

  match = url.match(/(?:youtu\.be\/)([^&?]+)/);
  if (match) return match[1];

  match = url.match(/(?:youtube\.com\/embed\/)([^&?]+)/);
  if (match) return match[1];

  return null;
};

// 2. COMPONENTE PARA RENDERIZAR O PLAYER DO YOUTUBE
const YouTubePlayer: React.FC<{ videoUrl: string; title: string }> = ({
  videoUrl,
  title,
}) => {
  const videoId = getYouTubeId(videoUrl);

  if (!videoId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-2xl">
        <div className="text-center p-6 bg-red-900/50 text-white rounded-lg border border-red-700">
          <VideoIcon size={32} className="mb-2 mx-auto" />
          <p className="font-semibold">URL de Vídeo Inválida</p>
          <p className="text-sm text-gray-300">
            A URL do vídeo não é suportada ou está incompleta.
          </p>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&autoplay=0`;

  return (
    <iframe
      className="w-full h-full"
      src={embedUrl}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      frameBorder="0"
    />
  );
};

const ModulePlayer: React.FC<ModulePlayerProps> = ({ module, onBack }) => {
  const [activeVideo, setActiveVideo] = useState<Video | null>(
    module.videos.length > 0 ? module.videos[0] : null
  );
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"playlist" | "files">(
    "playlist"
  );

  // Agrupa vídeos por categoria
  const groupedVideos = useMemo(() => {
    const groups: Record<string, Video[]> = {};
    module.videos.forEach((video) => {
      const cat = video.category || "Geral";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(video);
    });
    return groups;
  }, [module.videos]);

  // Estado para categorias expandidas
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };
  // Garante que o primeiro vídeo seja ativo e que todas as categorias estejam expandidas ao carregar
  useEffect(() => {
    if (module.videos.length > 0 && activeVideo === null) {
      setActiveVideo(module.videos[0]);
    }
  }, [module.videos, activeVideo]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{module.name}</h2>
            <p className="text-xs text-gray-500">
              Portal de Treinamento Fort Fruit
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAIOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
            isAIOpen
              ? "bg-fort-100 text-fort-700 ring-2 ring-fort-500"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-fort-300"
          }`}
        >
          <Sparkles
            size={16}
            className={isAIOpen ? "text-fort-600" : "text-purple-500"}
          />
          AI Tutor
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto lg:flex-row">
          {/* Video Player Section */}
          <div className="flex-1 p-6 lg:p-8">
            {activeVideo ? (
              <>
                <div className="bg-black rounded-2xl shadow-2xl overflow-hidden aspect-video relative group mb-6">
                  {/* PLAYER REAL DO YOUTUBE */}
                  <YouTubePlayer
                    videoUrl={activeVideo.videoUrl || ""}
                    title={activeVideo.title}
                  />
                  {/* FIM DO PLAYER */}
                </div>

                <div className="max-w-4xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      {/* Badge da Categoria */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-fort-100 text-fort-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                          {activeVideo.category || "Geral"}
                        </span>
                      </div>
                      {/* FIM Badge da Categoria */}
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {activeVideo.title}
                      </h1>
                      <p className="text-gray-600 leading-relaxed">
                        {activeVideo.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setIsAIOpen(true)}
                      className="flex items-center gap-2 text-sm text-fort-600 font-medium hover:bg-fort-50 px-4 py-2 rounded-lg transition-colors"
                    >
                      <MessageSquare size={18} />
                      Tirar dúvida com IA
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 flex-col">
                <VideoIcon size={48} className="mb-2" />
                <p>Nenhum vídeo disponível neste módulo.</p>
              </div>
            )}
          </div>

          {/* Right Sidebar (Tabs) */}
          <aside className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
            <div className="flex border-b border-gray-200 shrink-0">
              <button
                onClick={() => setSidebarTab("playlist")}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${
                  sidebarTab === "playlist"
                    ? "text-fort-600 border-b-2 border-fort-500 bg-fort-50/50"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Aulas ({module.videos.length})
              </button>
              <button
                onClick={() => setSidebarTab("files")}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${
                  sidebarTab === "files"
                    ? "text-fort-600 border-b-2 border-fort-500 bg-fort-50/50"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Arquivos ({module.documents.length})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50">
              {sidebarTab === "playlist" ? (
                <div className="pb-4">
                  {Object.keys(groupedVideos).length > 0 ? (
                    Object.entries(groupedVideos).map(([category, videos]) => (
                      <div
                        key={category}
                        className="border-b border-gray-100 last:border-0"
                      >
                        {/* Category Header (Botão Colapsável) */}
                        <button
                          onClick={() => toggleCategory(category)}
                          className="w-full flex items-center justify-between p-3 bg-gray-100/50 hover:bg-gray-100 text-xs font-bold text-gray-700 uppercase tracking-wide transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Folder size={14} className="text-fort-500" />
                            {category}
                          </div>
                          {expandedCategories.has(category) ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                        </button>

                        {/* Videos List */}
                        {expandedCategories.has(category) && (
                          <div className="divide-y divide-gray-100 bg-white">
                            {(videos as Video[]).map((video) => (
                              <button
                                key={video.id}
                                onClick={() => setActiveVideo(video)}
                                className={`w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors text-left ${
                                  activeVideo?.id === video.id
                                    ? "bg-fort-50/30 border-l-4 border-fort-500"
                                    : "border-l-4 border-transparent"
                                }`}
                              >
                                {/* BLOCO DO THUMBNAIL (Preto com ícone de vídeo) */}
                                <div className="relative min-w-[90px] w-20 h-14 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center shrink-0">
                                  <img
                                    src={video.thumbnailUrl}
                                    alt=""
                                    className="w-full h-full object-cover absolute inset-0"
                                  />
                                  <VideoIcon
                                    size={30}
                                    className="text-white relative z-10 opacity-70"
                                  />
                                </div>
                                {/* FIM BLOCO THUMBNAIL */}
                                <div className="flex-1 min-w-0">
                                  <h4
                                    className={`text-sm font-semibold mb-1 line-clamp-2 leading-snug ${
                                      activeVideo?.id === video.id
                                        ? "text-fort-700"
                                        : "text-gray-800"
                                    }`}
                                  >
                                    {video.title}
                                  </h4>
                                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                    <Clock size={10} /> {video.duration}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      Nenhum vídeo cadastrado.
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {module.documents.length > 0 ? (
                    module.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-start gap-3 group hover:border-fort-300 transition-colors"
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            doc.type === "PDF"
                              ? "bg-red-100 text-red-600"
                              : doc.type === "XLS"
                              ? "bg-green-100 text-green-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <FileText size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-800 mb-1">
                            {doc.title}
                          </h4>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                              {doc.type}
                            </span>
                            {/* CORREÇÃO APLICADA AQUI: Troca de <button> por <a> para visualização em nova aba */}
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Visualizar Documento em Nova Aba"
                              className="text-fort-600 hover:text-fort-700 transition-colors"
                            >
                              <FileText size={16} />{" "}
                              {/* Usando FileText para indicar "Abrir Arquivo" */}
                            </a>
                            {/* FIM DA CORREÇÃO */}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                        <FileText size={24} />
                      </div>
                      <p className="text-sm text-gray-500">
                        Nenhum arquivo disponível para este módulo.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        </main>

        {/* AI Assistant Side Panel */}
        {activeVideo && (
          <AIAssistant
            contextInfo={`Módulo: ${module.name}. Vídeo Atual: ${
              activeVideo.title
            }. Categoria: ${
              activeVideo.category || "Geral"
            }. Descrição do Vídeo: ${activeVideo.description}.`}
            isOpen={isAIOpen}
            onClose={() => setIsAIOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ModulePlayer;
