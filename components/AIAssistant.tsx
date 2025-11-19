import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, X } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Chat, GenerateContentResponse } from '@google/genai';
import { ChatMessage } from '../types';

interface AIAssistantProps {
  contextInfo: string;
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ contextInfo, isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Olá! Sou o assistente virtual da Fort Fruit. Ficou com alguma dúvida sobre este vídeo?',
      timestamp: Date.now(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat when context changes
  useEffect(() => {
    if (isOpen) {
      chatSessionRef.current = geminiService.createChatSession(contextInfo);
      // Reset messages if context drastically changed? Keeping history for now usually better UX 
      // unless switching completely unrelated topics. Let's keep history per session for simplicity here
      // but re-inject system instruction via new chat session creation.
    }
  }, [contextInfo, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const streamResult = await geminiService.sendMessageStream(chatSessionRef.current, userMsg.text);
      
      const botMsgId = (Date.now() + 1).toString();
      // Create placeholder for bot message
      setMessages((prev) => [
        ...prev,
        { id: botMsgId, role: 'model', text: '', timestamp: Date.now() },
      ]);

      let fullText = '';

      for await (const chunk of streamResult) {
        const chunkText = (chunk as GenerateContentResponse).text;
        if (chunkText) {
            fullText += chunkText;
            setMessages((prev) =>
            prev.map((msg) =>
                msg.id === botMsgId ? { ...msg, text: fullText } : msg
            )
            );
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'model', text: 'Desculpe, tive um problema ao processar sua dúvida.', timestamp: Date.now() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200 shadow-xl w-96 fixed right-0 top-0 z-50 transform transition-transform duration-300">
      {/* Header */}
      <div className="p-4 bg-fort-900 text-white flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/10 rounded-lg">
             <Bot size={20} className="text-fort-300" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Fort Fruit AI</h3>
            <p className="text-xs text-fort-300 flex items-center gap-1">
              <Sparkles size={10} /> Tutor Inteligente
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-fort-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2 items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-200 focus-within:border-fort-500 focus-within:ring-1 focus-within:ring-fort-500 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte sobre o vídeo..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="text-fort-600 disabled:text-gray-400 hover:text-fort-700 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-2 text-center">
            <p className="text-[10px] text-gray-400">IA pode cometer erros. Verifique informações importantes.</p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
