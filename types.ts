export enum ModuleId {
  RH = 'RH',
  DP = 'DP',
  COMPRAS = 'COMPRAS',
  FATURAMENTO = 'FATURAMENTO',
  CONTABILIDADE = 'CONTABILIDADE',
  TI = 'TI',
  FINANCEIRO = 'FINANCEIRO',
  LOGISTICA = 'LOGISTICA',
  ESTOQUE = 'ESTOQUE'
}

export interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl?: string; // In a real app, this would be the source
}

export interface DocumentResource {
  id: string;
  title: string;
  type: 'PDF' | 'DOC' | 'XLS' | 'LINK';
  url: string;
}

export interface LearningModule {
  id: ModuleId;
  name: string;
  description: string;
  iconName: string;
  videos: Video[];
  documents: DocumentResource[];
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}