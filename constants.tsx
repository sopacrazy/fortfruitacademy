import { LearningModule, ModuleId } from './types';
import { Users, FileText, ShoppingCart, DollarSign, Calculator, Laptop, PieChart, Truck, Package } from 'lucide-react';
import React from 'react';

export const INITIAL_MODULES: LearningModule[] = [
  {
    id: ModuleId.RH,
    name: 'Recursos Humanos',
    description: 'Treinamentos sobre cultura, benefícios e integração.',
    iconName: 'Users',
    color: 'bg-rose-500',
    videos: [
      {
        id: 'rh-1',
        title: 'Cultura Fort Fruit',
        description: 'Entenda a missão, visão e valores da nossa empresa.',
        duration: '10:25',
        thumbnailUrl: 'https://picsum.photos/id/1060/400/225',
      },
      {
        id: 'rh-2',
        title: 'Processo de Onboarding',
        description: 'Como acolher novos colaboradores na primeira semana.',
        duration: '15:00',
        thumbnailUrl: 'https://picsum.photos/id/338/400/225',
      }
    ],
    documents: [
      { id: 'doc-rh-1', title: 'Manual do Colaborador 2024', type: 'PDF', url: '#' },
      { id: 'doc-rh-2', title: 'Política de Benefícios', type: 'DOC', url: '#' }
    ]
  },
  {
    id: ModuleId.DP,
    name: 'Departamento Pessoal',
    description: 'Processos de folha, férias e admissão.',
    iconName: 'FileText',
    color: 'bg-blue-500',
    videos: [
      {
        id: 'dp-1',
        title: 'Lançamento de Ponto',
        description: 'Guia passo a passo para fechar o espelho de ponto.',
        duration: '08:45',
        thumbnailUrl: 'https://picsum.photos/id/1073/400/225',
      },
      {
        id: 'dp-2',
        title: 'Solicitação de Férias',
        description: 'Fluxo sistêmico para aprovação de férias.',
        duration: '05:30',
        thumbnailUrl: 'https://picsum.photos/id/445/400/225',
      }
    ],
    documents: [
      { id: 'doc-dp-1', title: 'Calendário de Feriados', type: 'XLS', url: '#' }
    ]
  },
  {
    id: ModuleId.COMPRAS,
    name: 'Compras',
    description: 'Gestão de fornecedores e aquisição de insumos.',
    iconName: 'ShoppingCart',
    color: 'bg-fort-500',
    videos: [
      {
        id: 'com-1',
        title: 'Cadastro de Fornecedor',
        description: 'Requisitos e telas para homologar novos parceiros.',
        duration: '12:10',
        thumbnailUrl: 'https://picsum.photos/id/201/400/225',
      },
      {
        id: 'com-2',
        title: 'Cotação no Sistema',
        description: 'Como lançar e comparar cotações de frutas.',
        duration: '20:15',
        thumbnailUrl: 'https://picsum.photos/id/1080/400/225',
      }
    ],
    documents: []
  },
  {
    id: ModuleId.FATURAMENTO,
    name: 'Faturamento',
    description: 'Emissão de notas e controle de saídas.',
    iconName: 'DollarSign',
    color: 'bg-amber-500',
    videos: [
      {
        id: 'fat-1',
        title: 'Emissão de NF-e',
        description: 'Rotina diária de emissão de notas fiscais de saída.',
        duration: '14:20',
        thumbnailUrl: 'https://picsum.photos/id/453/400/225',
      },
      {
        id: 'fat-2',
        title: 'Correção de Impostos',
        description: 'Como ajustar alíquotas antes de transmitir a nota.',
        duration: '09:00',
        thumbnailUrl: 'https://picsum.photos/id/534/400/225',
      }
    ],
    documents: []
  },
  {
    id: ModuleId.CONTABILIDADE,
    name: 'Contabilidade',
    description: 'Balancetes, conciliação e relatórios fiscais.',
    iconName: 'Calculator',
    color: 'bg-purple-500',
    videos: [
      {
        id: 'con-1',
        title: 'Conciliação Bancária',
        description: 'Batendo o extrato com o razão contábil.',
        duration: '30:00',
        thumbnailUrl: 'https://picsum.photos/id/443/400/225',
      },
      {
        id: 'con-2',
        title: 'Fechamento Mensal',
        description: 'Checklist de encerramento do mês.',
        duration: '45:00',
        thumbnailUrl: 'https://picsum.photos/id/590/400/225',
      }
    ],
    documents: []
  },
  {
    id: ModuleId.FINANCEIRO,
    name: 'Financeiro',
    description: 'Gestão de fluxo de caixa e planejamento.',
    iconName: 'PieChart',
    color: 'bg-teal-600',
    videos: [
      {
        id: 'fin-1',
        title: 'Fluxo de Caixa Diário',
        description: 'Como analisar entradas e saídas no painel financeiro.',
        duration: '11:30',
        thumbnailUrl: 'https://picsum.photos/id/454/400/225',
      },
      {
        id: 'fin-2',
        title: 'Contas a Pagar',
        description: 'Processo de agendamento e aprovação de pagamentos.',
        duration: '16:45',
        thumbnailUrl: 'https://picsum.photos/id/455/400/225',
      }
    ],
    documents: [
      { id: 'doc-fin-1', title: 'Planilha de Budget Anual', type: 'XLS', url: '#' }
    ]
  },
  {
    id: ModuleId.LOGISTICA,
    name: 'Logística',
    description: 'Gestão de frota, rotas e entregas.',
    iconName: 'Truck',
    color: 'bg-indigo-600',
    videos: [
      {
        id: 'log-1',
        title: 'Roteirização Inteligente',
        description: 'Otimizando entregas para redução de custos.',
        duration: '22:15',
        thumbnailUrl: 'https://picsum.photos/id/630/400/225',
      },
      {
        id: 'log-2',
        title: 'Checklist da Frota',
        description: 'Procedimentos de manutenção preventiva dos caminhões.',
        duration: '08:50',
        thumbnailUrl: 'https://picsum.photos/id/656/400/225',
      }
    ],
    documents: [
       { id: 'doc-log-1', title: 'Mapa de Áreas de Atuação', type: 'PDF', url: '#' }
    ]
  },
  {
    id: ModuleId.ESTOQUE,
    name: 'Estoque',
    description: 'Controle de entrada, saída e inventário.',
    iconName: 'Package',
    color: 'bg-orange-600',
    videos: [
      {
        id: 'est-1',
        title: 'Recebimento de Mercadoria',
        description: 'Conferência física e lançamento de notas.',
        duration: '13:00',
        thumbnailUrl: 'https://picsum.photos/id/674/400/225',
      },
      {
        id: 'est-2',
        title: 'Inventário Rotativo',
        description: 'Técnicas para contagem cíclica de produtos.',
        duration: '19:20',
        thumbnailUrl: 'https://picsum.photos/id/660/400/225',
      }
    ],
    documents: [
       { id: 'doc-est-1', title: 'Manual do Coletor de Dados', type: 'PDF', url: '#' },
       { id: 'doc-est-2', title: 'Layout do Armazém', type: 'PDF', url: '#' }
    ]
  },
  {
    id: ModuleId.TI,
    name: 'T.I.',
    description: 'Suporte, segurança e uso dos sistemas.',
    iconName: 'Laptop',
    color: 'bg-slate-600',
    videos: [
      {
        id: 'ti-1',
        title: 'Abertura de Chamados',
        description: 'Como usar o GLPI para reportar problemas.',
        duration: '04:00',
        thumbnailUrl: 'https://picsum.photos/id/0/400/225',
      },
      {
        id: 'ti-2',
        title: 'Segurança da Informação',
        description: 'Boas práticas para evitar phishing e vírus.',
        duration: '18:30',
        thumbnailUrl: 'https://picsum.photos/id/60/400/225',
      }
    ],
    documents: [
       { id: 'doc-ti-1', title: 'Política de Segurança', type: 'PDF', url: '#' },
       { id: 'doc-ti-2', title: 'Manual do Sistema ERP', type: 'PDF', url: '#' }
    ]
  }
];

// Helper component to map string icon names to Lucide components
export const IconMapper: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  switch (name) {
    case 'Users': return <Users className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'ShoppingCart': return <ShoppingCart className={className} />;
    case 'DollarSign': return <DollarSign className={className} />;
    case 'Calculator': return <Calculator className={className} />;
    case 'Laptop': return <Laptop className={className} />;
    case 'PieChart': return <PieChart className={className} />;
    case 'Truck': return <Truck className={className} />;
    case 'Package': return <Package className={className} />;
    default: return <Users className={className} />;
  }
};