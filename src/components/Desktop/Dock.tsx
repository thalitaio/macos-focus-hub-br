
import React from 'react';
import { Calendar, Clock, List, Kanban, CheckSquare, FileText, Cloud, DollarSign, Youtube } from 'lucide-react';

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
      id: 'ambient-sounds',
      icon: <span className="text-2xl">🔊</span>,
      label: 'Ambient Sounds',
      onClick: () => openApp('ambient-sounds'),
    },
    {
      id: 'pomodoro',
      icon: <Clock size={24} />,
      label: 'Pomodoro Timer',
      onClick: () => openApp('pomodoro'),
    },
    {
      id: 'todo',
      icon: <List size={24} />,
      label: 'To-do List',
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
      label: 'Notepad',
      onClick: () => openApp('notepad'),
    },
    {
      id: 'weather',
      icon: <Cloud size={24} />,
      label: 'Weather',
      onClick: () => openApp('weather'),
    },
    {
      id: 'currency',
      icon: <DollarSign size={24} />,
      label: 'Currency',
      onClick: () => openApp('currency'),
    },
    {
      id: 'youtube',
      icon: <Youtube size={24} />,
      label: 'YouTube',
      onClick: () => openApp('youtube'),
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-effect rounded-2xl px-2 py-2">
      <div className="flex space-x-2">
        {dockItems.map((item) => (
          <div
            key={item.id}
            className="dock-item group relative"
            onClick={item.onClick}
          >
            <div className="flex items-center justify-center h-full w-full text-gray-700">
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
