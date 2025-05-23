
import React from 'react';
import { 
  Calendar, Clock, List, Kanban, CheckSquare, FileText, Cloud, 
  DollarSign, Youtube, Key, FileJson, Hash, Link, Plus
} from 'lucide-react';

interface DockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface DockProps {
  openApp: (appId: string) => void;
}

const Dock: React.FC<DockProps> = ({ openApp }) => {
  const dockItems: DockItem[] = [
    {
      id: 'pomodoro',
      icon: <Clock size={24} />,
      label: 'Pomodoro Timer',
      onClick: () => openApp('pomodoro'),
    },
    {
      id: 'todo',
      icon: <List size={24} />,
      label: 'Lista de Tarefas',
      onClick: () => openApp('todo'),
    },
    {
      id: 'kanban',
      icon: <Kanban size={24} />,
      label: 'Kanban Board',
      onClick: () => openApp('kanban'),
    },
    {
      id: 'habit-tracker',
      icon: <CheckSquare size={24} />,
      label: 'Habit Tracker',
      onClick: () => openApp('habit-tracker'),
    },
    {
      id: 'notepad',
      icon: <FileText size={24} />,
      label: 'Bloco de Notas',
      onClick: () => openApp('notepad'),
    },
    {
      id: 'weather',
      icon: <Cloud size={24} />,
      label: 'Clima',
      onClick: () => openApp('weather'),
    },
    {
      id: 'currency',
      icon: <DollarSign size={24} />,
      label: 'Conversor de Moedas',
      onClick: () => openApp('currency'),
    },
    {
      id: 'youtube',
      icon: <Youtube size={24} />,
      label: 'YouTube',
      onClick: () => openApp('youtube'),
    },
    {
      id: 'password-generator',
      icon: <Key size={24} />,
      label: 'Gerador de Senhas',
      onClick: () => openApp('password-generator'),
    },
    {
      id: 'code-formatter',
      icon: <FileText size={24} />,
      label: 'Formatador de Código',
      onClick: () => openApp('code-formatter'),
    },
    {
      id: 'json-yaml-converter',
      icon: <FileJson size={24} />,
      label: 'Conversor JSON/YAML',
      onClick: () => openApp('json-yaml-converter'),
    },
    {
      id: 'json-validator',
      icon: <FileJson size={24} />,
      label: 'Validador JSON',
      onClick: () => openApp('json-validator'),
    },
    {
      id: 'uuid-slug-generator',
      icon: <Hash size={24} />,
      label: 'Gerador UUID/Slug',
      onClick: () => openApp('uuid-slug-generator'),
    },
    {
      id: 'json-creator',
      icon: (
        <>
          <Plus size={20} className="mr-1" />
          <FileJson size={20} />
        </>
      ),
      label: 'Criador de JSON',
      onClick: () => openApp('json-creator'),
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-effect rounded-2xl px-4 py-2 overflow-x-auto max-w-5xl">
      <div className="flex space-x-4">
        {dockItems.map((item) => (
          <div
            key={item.id}
            className="dock-item group relative hover:scale-110 transition-transform"
            onClick={item.onClick}
          >
            <div className="flex items-center justify-center h-12 w-12 bg-white/80 rounded-xl shadow-sm hover:shadow-md text-gray-700">
              {item.icon}
            </div>
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dock;
