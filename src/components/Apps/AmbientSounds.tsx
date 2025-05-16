
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

interface Sound {
  id: string;
  name: string;
  icon: string;
  audioUrl: string;
}

const AmbientSounds: React.FC = () => {
  const [sounds, setSounds] = useState<Sound[]>([
    {
      id: 'cafe',
      name: 'Café',
      icon: '☕',
      audioUrl: 'https://freesound.org/data/previews/386/386464_4921277-lq.mp3',
    },
    {
      id: 'rain',
      name: 'Chuva',
      icon: '🌧️',
      audioUrl: 'https://freesound.org/data/previews/497/497053_7329610-lq.mp3',
    },
    {
      id: 'keyboard',
      name: 'Teclado',
      icon: '⌨️',
      audioUrl: 'https://freesound.org/data/previews/352/352503_5121236-lq.mp3',
    },
    {
      id: 'nature',
      name: 'Natureza',
      icon: '🌳',
      audioUrl: 'https://freesound.org/data/previews/619/619108_1648170-lq.mp3',
    },
    {
      id: 'fire',
      name: 'Fogueira',
      icon: '🔥',
      audioUrl: 'https://freesound.org/data/previews/349/349826_5121236-lq.mp3',
    },
  ]);
  
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Handle sound changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (activeSound) {
      const sound = sounds.find(s => s.id === activeSound);
      if (sound) {
        audioRef.current.src = sound.audioUrl;
        audioRef.current.volume = muted ? 0 : volume;
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
        });
      }
    } else {
      audioRef.current.pause();
    }
    
  }, [activeSound, sounds]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);
  
  const toggleSound = (soundId: string) => {
    if (activeSound === soundId) {
      setActiveSound(null);
    } else {
      setActiveSound(soundId);
    }
  };
  
  const toggleMute = () => {
    setMuted(!muted);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (muted && value[0] > 0) {
      setMuted(false);
    }
  };
  
  return (
    <div className="h-full">
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Sons Ambientes</h2>
        <p className="text-sm text-gray-500">Selecione um som para melhorar seu foco</p>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        {sounds.map((sound) => (
          <button
            key={sound.id}
            className={`p-3 rounded-lg flex flex-col items-center transition-all ${
              activeSound === sound.id 
                ? 'bg-primary/10 text-primary shadow-sm' 
                : 'hover:bg-gray-100'
            }`}
            onClick={() => toggleSound(sound.id)}
          >
            <span className="text-2xl mb-1">{sound.icon}</span>
            <span className="text-xs">{sound.name}</span>
          </button>
        ))}
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleMute} 
          className="text-gray-600 hover:text-gray-900"
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <Slider
          value={[volume]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
        />
      </div>
      
      {activeSound && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              {sounds.find(s => s.id === activeSound)?.name}
            </div>
            <button
              onClick={() => setActiveSound(null)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
            >
              <Pause size={16} />
              <span className="text-xs">Pausar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbientSounds;
