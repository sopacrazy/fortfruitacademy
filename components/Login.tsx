import React, { useState } from "react";
// Ícone de estudo importado
import { BookText, Lock, User, ArrowRight, AlertCircle } from "lucide-react";

interface LoginProps {
  onLogin: (user: string, pass: string) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await onLogin(username, password);
    } catch (err) {
      setError("Usuário ou senha incorretos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fort-50 to-gray-100 p-4">
            {/* Background decoration */}     {" "}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
               {" "}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-fort-200 rounded-full opacity-20 blur-3xl"></div>
               {" "}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-fruit-orange/20 rounded-full opacity-20 blur-3xl"></div>
             {" "}
      </div>
           {" "}
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-gray-100">
               {" "}
        <div className="p-8 md:p-10">
                   {" "}
          <div className="text-center mb-10">
               {" "}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-fort-50 text-fort-600 rounded-2xl mb-4 shadow-sm ring-2 ring-fort-600">
               <BookText size={32} />{" "}
            </div>
                                    {/* TÍTULO: Fort Fruit Academy */}         
             {" "}
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              <span className="text-fort-600">Fort Fruit</span> Academy
            </h1>
                       {" "}
            <p className="text-gray-500 text-sm mt-2">
              Entre com suas credenciais corporativas para acessar os
              treinamentos.
            </p>
                     {" "}
          </div>
                   {" "}
          <form onSubmit={handleSubmit} className="space-y-6">
                       {" "}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3 animate-fade-in">
                               {" "}
                <AlertCircle
                  size={20}
                  className="text-red-500 shrink-0 mt-0.5"
                />
                               {" "}
                <p className="text-sm text-red-700 font-medium">{error}</p>     
                       {" "}
              </div>
            )}
                       {" "}
            <div className="space-y-2">
                           {" "}
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Usuário
              </label>
                           {" "}
              <div className="relative group">
                               {" "}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                   {" "}
                  <User
                    size={20}
                    className="text-gray-400 group-focus-within:text-fort-500 transition-colors"
                  />
                                 {" "}
                </div>
                               {" "}
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fort-500 focus:bg-white outline-none transition-all text-gray-800 placeholder-gray-400"
                  placeholder="Seu ID corporativo"
                  required
                />
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <div className="space-y-2">
                           {" "}
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Senha
              </label>
                           {" "}
              <div className="relative group">
                               {" "}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                   {" "}
                  <Lock
                    size={20}
                    className="text-gray-400 group-focus-within:text-fort-500 transition-colors"
                  />
                                 {" "}
                </div>
                               {" "}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fort-500 focus:bg-white outline-none transition-all text-gray-800 placeholder-gray-400"
                  placeholder="••••••••"
                  required
                />
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-fort-600 hover:bg-fort-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-fort-200 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                           {" "}
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                                    Acessar Portal <ArrowRight size={20} />     
                           {" "}
                </>
              )}
                         {" "}
            </button>
                     {" "}
          </form>
                   {" "}
          <div className="mt-8 text-center">
                       {" "}
            <a
              href="#"
              className="text-sm text-gray-400 hover:text-fort-600 transition-colors"
            >
              Esqueceu sua senha?{" "}
            </a>
                     {" "}
          </div>
                 {" "}
        </div>
                       {" "}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                   {" "}
          <p className="text-xs text-gray-400">
                        &copy; {new Date().getFullYear()} Fort Fruit. Acesso
            Restrito.          {" "}
          </p>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default Login;
