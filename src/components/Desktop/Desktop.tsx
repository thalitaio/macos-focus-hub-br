
import React, { useState, useEffect } from 'react';
import Dock from './Dock';
import AppWindow from './AppWindow';
import AmbientSounds from '../Apps/AmbientSounds';
import PomodoroTimer from '../Apps/PomodoroTimer';
import TodoApp from '../Apps/TodoApp';
import KanbanBoard from '../Apps/KanbanBoard';
import HabitTracker from '../Apps/HabitTracker';
import Notepad from '../Apps/Notepad';
import Weather from '../Apps/Weather';
import CurrencyConverter from '../Apps/CurrencyConverter';
import YouTubePlayer from '../Apps/YouTubePlayer';
import PasswordGenerator from '../Apps/PasswordGenerator';
import CodeFormatter from '../Apps/CodeFormatter';
import JsonYamlConverter from '../Apps/JsonYamlConverter';
import JsonValidator from '../Apps/JsonValidator';
import UuidSlugGenerator from '../Apps/UuidSlugGenerator';

interface AppState {
  id: string;
  isOpen: boolean;
  title: string;
  width: string;
  height: string;
  x: number;
  y: number;
  component: React.ReactNode;
  minimized: boolean;
}

const Desktop: React.FC = () => {
  const [apps, setApps] = useState<AppState[]>([
    {
      id: 'ambient-sounds',
      isOpen: true,
      title: 'Sons Ambientes',
      width: '320px',
      height: '400px',
      x: 100,
      y: 100,
      component: <AmbientSounds />,
      minimized: false,
    },
    {
      id: 'pomodoro',
      isOpen: true,
      title: 'Pomodoro Timer',
      width: '350px',
      height: '300px',
      x: 450,
      y: 100,
      component: <PomodoroTimer />,
      minimized: false,
    },
    {
      id: 'todo',
      isOpen: true,
      title: 'Lista de Tarefas',
      width: '400px',
      height: '500px',
      x: 100,
      y: 520,
      component: <TodoApp />,
      minimized: false,
    },
    {
      id: 'kanban',
      isOpen: true,
      title: 'Kanban Board',
      width: '800px',
      height: '600px',
      x: 830,
      y: 100,
      component: <KanbanBoard />,
      minimized: false,
    },
    {
      id: 'habit-tracker',
      isOpen: true,
      title: 'Habit Tracker',
      width: '600px',
      height: '500px',
      x: 530,
      y: 520,
      component: <HabitTracker />,
      minimized: false,
    },
    {
      id: 'notepad',
      isOpen: true,
      title: 'Bloco de Notas',
      width: '500px',
      height: '400px',
      x: 1160,
      y: 720,
      component: <Notepad />,
      minimized: false,
    },
    {
      id: 'weather',
      isOpen: true,
      title: 'Clima',
      width: '400px',
      height: '300px',
      x: 830,
      y: 720,
      component: <Weather />,
      minimized: false,
    },
    {
      id: 'currency',
      isOpen: true,
      title: 'Conversor de Moedas',
      width: '350px',
      height: '250px',
      x: 100,
      y: 1040,
      component: <CurrencyConverter />,
      minimized: false,
    },
    {
      id: 'youtube',
      isOpen: true,
      title: 'YouTube',
      width: '600px',
      height: '400px',
      x: 480,
      y: 1040,
      component: <YouTubePlayer />,
      minimized: false,
    },
    {
      id: 'password-generator',
      isOpen: false,
      title: 'Gerador de Senhas',
      width: '400px',
      height: '450px',
      x: 200,
      y: 200,
      component: <PasswordGenerator />,
      minimized: false,
    },
    {
      id: 'code-formatter',
      isOpen: false,
      title: 'Formatador de Código',
      width: '700px',
      height: '500px',
      x: 300,
      y: 300,
      component: <CodeFormatter />,
      minimized: false,
    },
    {
      id: 'json-yaml-converter',
      isOpen: false,
      title: 'Conversor JSON ↔ YAML',
      width: '700px',
      height: '500px',
      x: 400,
      y: 200,
      component: <JsonYamlConverter />,
      minimized: false,
    },
    {
      id: 'json-validator',
      isOpen: false,
      title: 'Validador JSON',
      width: '700px',
      height: '500px',
      x: 500,
      y: 250,
      component: <JsonValidator />,
      minimized: false,
    },
    {
      id: 'uuid-slug-generator',
      isOpen: false,
      title: 'Gerador UUID/Slug',
      width: '500px',
      height: '500px',
      x: 600,
      y: 300,
      component: <UuidSlugGenerator />,
      minimized: false,
    },
  ]);

  // Track z-index for window stacking
  const [activeAppId, setActiveAppId] = useState<string | null>('pomodoro');
  
  const openApp = (appId: string) => {
    setApps((prevApps) =>
      prevApps.map((app) => {
        if (app.id === appId) {
          return { ...app, isOpen: true, minimized: false };
        }
        return app;
      })
    );
    bringToFront(appId);
  };

  const closeApp = (appId: string) => {
    setApps((prevApps) =>
      prevApps.map((app) => {
        if (app.id === appId) {
          return { ...app, isOpen: false };
        }
        return app;
      })
    );
    
    // Update active app if the closed app was active
    if (activeAppId === appId) {
      const openApps = apps.filter(app => app.isOpen && app.id !== appId);
      if (openApps.length > 0) {
        setActiveAppId(openApps[openApps.length - 1].id);
      } else {
        setActiveAppId(null);
      }
    }
  };

  const minimizeApp = (appId: string) => {
    setApps((prevApps) =>
      prevApps.map((app) => {
        if (app.id === appId) {
          return { ...app, minimized: true };
        }
        return app;
      })
    );

    // Update active app if the minimized app was active
    if (activeAppId === appId) {
      const openApps = apps.filter(app => app.isOpen && !app.minimized && app.id !== appId);
      if (openApps.length > 0) {
        setActiveAppId(openApps[openApps.length - 1].id);
      } else {
        setActiveAppId(null);
      }
    }
  };

  const bringToFront = (appId: string) => {
    setActiveAppId(appId);
  };

  // Get z-index for window
  const getZIndex = (appId: string): number => {
    return appId === activeAppId ? 50 : 10;
  };

  return (
    <div className="h-screen w-screen bg-pink-50 overflow-hidden relative p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-pink-50" />
      
      {/* Date and Time in top-right */}
      <div className="absolute top-4 right-4 text-pink-700">
        <Clock />
      </div>

      {apps.map((app) => (
        <AppWindow
          key={app.id}
          id={app.id}
          title={app.title}
          isOpen={app.isOpen && !app.minimized}
          onClose={() => closeApp(app.id)}
          onMinimize={() => minimizeApp(app.id)}
          width={app.width}
          height={app.height}
          x={app.x}
          y={app.y}
          bringToFront={bringToFront}
          zIndex={getZIndex(app.id)}
        >
          {app.component}
        </AppWindow>
      ))}

      <Dock openApp={openApp} />
    </div>
  );
};

export default Desktop;

const Clock: React.FC = () => {
  const [date, setDate] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 60000); // Update every minute
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return date.toLocaleDateString('pt-BR', options);
  };
  
  return (
    <div className="text-sm font-medium">
      {formatDate(date)}
    </div>
  );
};
