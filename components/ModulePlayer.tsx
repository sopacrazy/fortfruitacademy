import React, { useState } from 'react';
import { LearningModule, Video } from '../types';
import { Play, Clock, ChevronLeft, Sparkles, MessageSquare, FileText, Download, Video as VideoIcon } from 'lucide-react';
import AIAssistant from './AIAssistant';

interface ModulePlayerProps {
  module: LearningModule;
  onBack: () => void;
}

const ModulePlayer: React.FC<ModulePlayerProps> = ({ module, onBack }) => {
  const [activeVideo, setActiveVideo] = useState<Video>(module.videos[0]);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'playlist' | 'files'>('playlist');

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
            <p className="text-xs text-gray-500">Portal de Treinamento Fort Fruit</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsAIOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
            isAIOpen 
              ? 'bg-fort-100 text-fort-700 ring-2 ring-fort-500' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-fort-300'
          }`}
        >
          <Sparkles size={16} className={isAIOpen ? 'text-fort-600' : 'text-purple-500'} />
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
                  {/* Mock Video Player UI */}
                  <img 
                    src={activeVideo.thumbnailUrl} 
                    alt={activeVideo.title} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-fort-500 text-white p-6 rounded-full shadow-lg transform hover:scale-110 transition-all hover:bg-fort-400">
                      <Play size={48} fill="currentColor" className="ml-2" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="h-1 bg-gray-600 rounded-full overflow-hidden mb-2">
                      <div className="w-1/3 h-full bg-fort-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-white text-xs font-medium">
                      <span>03:45</span>
                      <span>{activeVideo.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="max-w-4xl">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{activeVideo.title}</h1>
                            <p className="text-gray-600 leading-relaxed">{activeVideo.description}</p>
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
          <aside className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="flex border-b border-gray-200">
                <button 
                  onClick={() => setSidebarTab('playlist')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${sidebarTab === 'playlist' ? 'text-fort-600 border-b-2 border-fort-500 bg-fort-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                   Aulas ({module.videos.length})
                </button>
                <button 
                  onClick={() => setSidebarTab('files')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${sidebarTab === 'files' ? 'text-fort-600 border-b-2 border-fort-500 bg-fort-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                   Arquivos ({module.documents.length})
                </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50">
               {sidebarTab === 'playlist' ? (
                   <div className="divide-y divide-gray-100">
                    {module.videos.length > 0 ? (
                       module.videos.map((video, index) => (
                         <button
                           key={video.id}
                           onClick={() => setActiveVideo(video)}
                           className={`w-full flex items-start gap-3 p-4 hover:bg-white transition-colors text-left ${
                             activeVideo?.id === video.id ? 'bg-white border-l-4 border-fort-500 shadow-sm' : 'border-l-4 border-transparent'
                           }`}
                         >
                           <div className="relative min-w-[100px] w-24 h-16 rounded-lg overflow-hidden bg-gray-200">
                              <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1">
                             <span className="text-[10px] font-bold text-gray-400 mb-0.5 block uppercase">Aula {index + 1}</span>
                             <h4 className={`text-sm font-semibold mb-1 line-clamp-2 leading-snug ${activeVideo?.id === video.id ? 'text-fort-700' : 'text-gray-800'}`}>
                               {video.title}
                             </h4>
                             <span className="text-[10px] text-gray-500 flex items-center gap-1">
                               <Clock size={10} /> {video.duration}
                             </span>
                           </div>
                         </button>
                       ))
                    ) : (
                      <div className="p-8 text-center text-gray-500 text-sm">Nenhum vídeo cadastrado.</div>
                    )}
                   </div>
               ) : (
                   <div className="p-4 space-y-3">
                      {module.documents.length > 0 ? (
                        module.documents.map((doc) => (
                            <div key={doc.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-start gap-3 group hover:border-fort-300 transition-colors">
                                <div className={`p-2 rounded-lg ${doc.type === 'PDF' ? 'bg-red-100 text-red-600' : doc.type === 'XLS' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-1">{doc.title}</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{doc.type}</span>
                                        <button className="text-fort-600 hover:text-fort-700 transition-colors">
                                            <Download size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                      ) : (
                          <div className="text-center py-8">
                              <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                                  <FileText size={24} />
                              </div>
                              <p className="text-sm text-gray-500">Nenhum arquivo disponível para este módulo.</p>
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
              contextInfo={`Módulo: ${module.name}. Vídeo Atual: ${activeVideo.title}. Descrição do Vídeo: ${activeVideo.description}.`} 
              isOpen={isAIOpen} 
              onClose={() => setIsAIOpen(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default ModulePlayer;