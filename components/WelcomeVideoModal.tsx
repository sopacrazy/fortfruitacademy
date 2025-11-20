// /components/WelcomeVideoModal.tsx

import React from "react";
import { X, Play } from "lucide-react";

interface WelcomeVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedUrl: string;
}

const WelcomeVideoModal: React.FC<WelcomeVideoModalProps> = ({
  isOpen,
  onClose,
  embedUrl,
}) => {
  if (!isOpen) return null;

  return (
    // Backdrop escuro que ocupa a tela toda
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90 p-4 transition-opacity duration-300">
      {/* Container Principal do Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform scale-100 transition-transform duration-300">
        {/* Header do Modal */}
        {/* O botão 'X' no header agora é a única forma de fechar e marcar como visto */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-fort-700 flex items-center gap-2">
            <Play size={24} /> Boas-Vindas ao Fort Fruit Academy
          </h3>
          {/* Botão de Fechar (X) */}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors p-1"
            title="Fechar e ir para o Portal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Corpo do Vídeo */}
        <div className="aspect-video bg-black">
          <iframe
            className="w-full h-full"
            src={embedUrl}
            title="Vídeo de Explicação do Portal Fort Fruit"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            frameBorder="0"
          />
        </div>

        {/* O Rodapé/Barra Branca e o Botão "Entendi" foram removidos */}
      </div>
    </div>
  );
};

export default WelcomeVideoModal;
