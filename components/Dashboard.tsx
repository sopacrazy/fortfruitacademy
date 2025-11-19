import React from 'react';
import { IconMapper } from '../constants';
import { LearningModule } from '../types';
import { PlayCircle, FileText } from 'lucide-react';

interface DashboardProps {
  modules: LearningModule[];
  onModuleSelect: (module: LearningModule) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ modules, onModuleSelect }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          <span className="text-fort-600">Fort Fruit</span> Academy
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Bem-vindo ao portal de conhecimento. Selecione seu departamento para acessar os treinamentos e procedimentos operacionais.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div
            key={module.id}
            onClick={() => onModuleSelect(module)}
            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 hover:border-fort-200 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Decorative background circle */}
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity ${module.color}`} />
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className={`p-3 rounded-xl text-white shadow-md ${module.color}`}>
                <IconMapper name={module.iconName} className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-fort-700 transition-colors">
                {module.name}
              </h3>
            </div>

            <p className="text-gray-500 text-sm mb-6 relative z-10 h-10 line-clamp-2">
              {module.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50 relative z-10">
              <div className="flex gap-3">
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
                  <PlayCircle size={12} /> {module.videos.length}
                </span>
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
                   <FileText size={12} /> {module.documents.length}
                </span>
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold text-fort-600 group-hover:translate-x-1 transition-transform">
                Acessar
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;