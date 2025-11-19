import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

class GeminiService {
  private client: GoogleGenAI | null = null;
  private modelId: string = 'gemini-2.5-flash';

  constructor() {
    if (process.env.API_KEY) {
      this.client = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } else {
      console.warn("API_KEY is not set in the environment.");
    }
  }

  public createChatSession(context: string): Chat | null {
    if (!this.client) return null;

    return this.client.chats.create({
      model: this.modelId,
      config: {
        systemInstruction: `Você é o Tutor Virtual Inteligente da empresa Fort Fruit. 
        O usuário está assistindo a um vídeo de treinamento.
        Contexto atual do vídeo/módulo: ${context}.
        
        Sua função é responder dúvidas sobre os processos da Fort Fruit com base nesse contexto.
        Seja profissional, direto e encorajador. Use formatação Markdown simples.
        Se perguntarem algo fora do contexto empresarial, guie-os de volta ao tema suavemente.`,
      },
    });
  }

  public async sendMessageStream(chat: Chat, message: string): Promise<AsyncIterable<GenerateContentResponse>> {
    try {
      return await chat.sendMessageStream({ message });
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
