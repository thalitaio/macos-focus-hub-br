
import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Square } from 'lucide-react';

interface AppWindowProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  children: React.ReactNode;
  width?: string;
  height?: string;
  x?: number;
  y?: number;
  id: string;
  bringToFront: (id: string) => void;
  zIndex: number;
}

const AppWindow: React.FC<AppWindowProps> = ({
  title,
  isOpen,
  onClose,
  onMinimize,
  children,
  width = '600px',
  height = '400px',
  x = 100,
  y = 100,
  id,
  bringToFront,
  zIndex,
}) => {
  const [position, setPosition] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Handle window close animation
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      bringToFront(id);
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  return (
    <div
      ref={windowRef}
      className={`app-window absolute transition-all duration-200 ${
        closing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}
      style={{
        width,
        height,
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex,
      }}
      onClick={() => bringToFront(id)}
    >
      <div
        className="window-titlebar cursor-move flex justify-between"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <span 
            className="window-control bg-macos-close"
            onClick={handleClose}
          />
          <span 
            className="window-control bg-macos-minimize"
            onClick={onMinimize}
          />
          <span 
            className="window-control bg-macos-maximize"
          />
        </div>
        <div className="text-sm font-medium">{title}</div>
        <div className="w-20"></div> {/* Placeholder for balance */}
      </div>
      <div className="p-4 overflow-auto" style={{ height: 'calc(100% - 40px)' }}>
        {children}
      </div>
    </div>
  );
};

export default AppWindow;
