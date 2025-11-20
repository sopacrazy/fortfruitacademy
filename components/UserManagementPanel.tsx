// /components/UserManagementPanel.tsx

import React, { useState } from "react";
import { UserPlus, CheckCircle, AlertCircle, Key, Users } from "lucide-react";
import { storageService } from "../services/storageService";

const ROLES = [
  { value: "admin", label: "Admin (Nível 2 - Gestão)" },
  { value: "ti", label: "T.I. (Nível 1 - Padrão)" },
  { value: "rh", label: "R.H. (Nível 1 - Padrão)" },
  { value: "logistica", label: "Logística (Nível 1 - Padrão)" },
];

const UserManagementPanel: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES[0].value);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      // Chama a nova função do storageService que se comunica com o backend
      await storageService.addUser(username, password, role);

      setMessage({
        type: "success",
        text: `Usuário '${username}' criado com sucesso com a função ${role.toUpperCase()}!`,
      });
      // Limpa o formulário
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao criar usuário.",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="p-8 border border-gray-100 rounded-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <UserPlus className="text-fort-500" size={24} /> Criar Novo Colaborador
      </h3>
      <p className="text-gray-500 mb-6">
        Defina o nome de usuário, senha e nível de acesso do novo colaborador.
      </p>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-50 border border-green-300 text-green-700"
              : "bg-red-50 border border-red-300 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Usuário e Senha (lado a lado) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuário (ID Corporativo)
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: joao.silva"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fort-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fort-500 outline-none"
            />
          </div>
        </div>

        {/* Nível de Acesso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Users size={16} className="text-fort-500" /> Nível de Acesso
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fort-500 focus:border-fort-500 outline-none transition-all"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Apenas o nível 'Admin' tem acesso a este painel.
          </p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-fort-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-fort-700 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Key size={20} />
                Criar Usuário e Senha
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserManagementPanel;
