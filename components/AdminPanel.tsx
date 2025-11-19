import React, { useState } from 'react';
import { LearningModule, ModuleId } from '../types';
import { Upload, Film, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface AdminPanelProps {
  modules: LearningModule[];
  onAddContent: (moduleId: ModuleId, type: 'video' | 'document', data: any) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ modules, onAddContent, onClose }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'document'>('video');
  const [selectedModule, setSelectedModule] = useState<string>(modules[0].id);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [docType, setDocType] = useState<'PDF' | 'DOC' | 'XLS'>('PDF');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'video') {
      onAddContent(selectedModule as ModuleId, 'video', {
        title,
        description,
        duration: duration || '00:00',
        thumbnailUrl: `https://picsum.photos/seed/${Date.now()}/400/225`, // Random thumb for demo
        videoUrl: url
      });
      setSuccessMessage('Vídeo adicionado com sucesso!');
    } else {
      onAddContent(selectedModule as ModuleId, 'document', {
        title,
        type: docType,
        url: url || '#'
      });
      setSuccessMessage('Arquivo adicionado com sucesso!');
    }

    // Reset form
    setTitle('');
    setDescription('');
    setUrl('');
    setDuration('');
    
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Upload className="text-fort-500" /> Gestão de Conteúdo
            </h2>
            <p className="text-gray-500 mt-1">Adicione vídeos e documentos para os departamentos da Fort Fruit.</p>
        </div>
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-800 underline">
            Voltar ao Portal
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-4 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'video' ? 'bg-fort-50 text-fort-600 border-b-2 border-fort-500' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Film size={18} /> Novo Vídeo
          </button>
          <button
            onClick={() => setActiveTab('document')}
            className={`flex-1 py-4 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'document' ? 'bg-fort-50 text-fort-600 border-b-2 border-fort-500' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <FileText size={18} /> Novo Arquivo
          </button>
        </div>

        <div className="p-8">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2 animate-fade-in">
              <CheckCircle size={20} /> {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Module Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Departamento de Destino</label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fort-500 focus:border-fort-500 outline-none transition-all"
              >
                {modules.map(mod => (
                  <option key={mod.id} value={mod.id}>{mod.name}</option>
                ))}
              </select>
            </div>

            {/* Common Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título do Conteúdo</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={activeTab === 'video' ? "Ex: Treinamento de Segurança" : "Ex: Manual de Conduta.pdf"}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fort-500 outline-none transition-all"
              />
            </div>

            {/* Video Specific */}
            {activeTab === 'video' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duração (MM:SS)</label>
                        <input
                            type="text"
                            placeholder="10:00"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fort-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Link do Vídeo (URL)</label>
                        <input
                            type="url"
                            placeholder="https://..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fort-500 outline-none"
                        />
                    </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
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
            {activeTab === 'document' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Arquivo</label>
                    <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as any)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fort-500 outline-none"
                    >
                        <option value="PDF">PDF (Documento Portátil)</option>
                        <option value="DOC">DOC/DOCX (Word)</option>
                        <option value="XLS">XLS/XLSX (Excel)</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link ou Caminho do Arquivo</label>
                    <input
                        type="text"
                        placeholder="/server/files/..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
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
                    {activeTab === 'video' ? <Film size={20} /> : <Upload size={20} />}
                    {activeTab === 'video' ? 'Publicar Vídeo' : 'Carregar Arquivo'}
                </button>
            </div>
          </form>
        </div>
        
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                <AlertCircle size={14} />
                Todas as alterações são salvas no banco de dados da Fort Fruit (Simulado).
            </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;