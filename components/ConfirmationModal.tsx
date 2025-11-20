// /components/ConfirmationModal.tsx

import React from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText,
}) => {
  if (!isOpen) return null;

  return (
    // Backdrop escuro
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 p-4 transition-opacity duration-300">
      {/* Modal Box */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform scale-100 transition-transform duration-300 border-t-4 border-red-500">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <AlertTriangle size={24} className="text-red-500" /> {title}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo (Mensagem) */}
        <div className="p-4 border-t border-gray-100 text-sm text-gray-600">
          <p>{message}</p>
        </div>

        {/* Rodapé (Ações) */}
        <div className="p-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="text-gray-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} /> {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
