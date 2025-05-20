import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface Sound {
  id: string;
  name: string;
  icon: string;
  audioUrl: string;
}

const AmbientSounds: React.FC = () => {
  const [sounds, setSounds] = useState<Sound[]>([
    {
      id: 'rain',
      name: 'Chuva',
      icon: '🌧️',
      audioUrl: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-looping-1249.mp3',
    },
    {
      id: 'fire',
      name: 'Fogueira',
      icon: '🔥',
      audioUrl: 'https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3',
    },
    {
      id: 'ocean',
      name: 'Oceano',
      icon: '🌊',
      audioUrl: 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-ambience-1185.mp3',
    },
    {
      id: 'wind',
      name: 'Vento',
      icon: '🍃',
      audioUrl: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-wind-ambient-1232.mp3',
    },
  ]);
  
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
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
        
        // Add event listener for canplaythrough to ensure the audio is ready
        const handleCanPlay = () => {
          if (audioRef.current) {
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
              playPromise.then(() => {
                setIsPlaying(true);
                toast({
                  title: "Som ativado",
                  description: `${sound.name} está sendo reproduzido`,
                  duration: 2000,
                });
              }).catch(error => {
                console.error("Audio playback failed:", error);
                toast({
                  title: "Erro ao reproduzir",
                  description: "Não foi possível reproduzir o som. Tente novamente.",
                  variant: "destructive",
                });
              });
            }
          }
          
          // Remove the event listener after it's been triggered once
          audioRef.current?.removeEventListener('canplaythrough', handleCanPlay);
        };
        
        audioRef.current.addEventListener('canplaythrough', handleCanPlay);
        audioRef.current.addEventListener('error', (e) => {
          console.error('Audio loading error:', e);
          toast({
            title: "Erro ao carregar áudio",
            description: "Não foi possível carregar o arquivo de áudio.",
            variant: "destructive",
          });
        });
        
        // Preload the audio
        audioRef.current.load();
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplaythrough', () => {});
        audioRef.current.removeEventListener('error', () => {});
      }
    };
  }, [activeSound, sounds, toast, volume, muted]);
  
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
    if (audioRef.current && activeSound) {
      if (!muted) {
        toast({
          title: "Som silenciado",
          description: "O som foi silenciado",
          duration: 2000,
        });
      } else {
        toast({
          title: "Som ativado",
          description: "O som foi restaurado",
          duration: 2000,
        });
      }
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (muted && value[0] > 0) {
      setMuted(false);
    }
  };
  
  // Test direct audio playback with HTML audio element
  const testPlaySound = (url: string) => {
    const audioElement = document.getElementById('audio-test') as HTMLAudioElement;
    if (audioElement) {
      audioElement.src = url;
      audioElement.volume = volume;
      audioElement.loop = true;
      audioElement.play().then(() => {
        toast({
          title: "Teste de áudio",
          description: "Reproduzindo áudio de teste",
          duration: 2000,
        });
      }).catch(error => {
        console.error("Test audio playback failed:", error);
        toast({
          title: "Erro no teste",
          description: "Não foi possível testar o áudio",
          variant: "destructive",
        });
      });
    }
  };
  
  return (
    <div className="h-full">
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Sons Ambientes</h2>
        <p className="text-sm text-gray-500">Selecione um som para melhorar seu foco</p>
      </div>
      
      <div className="grid grid-cols-4 gap-2 mb-6">
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
            {activeSound === sound.id && (
              <span className="w-2 h-2 rounded-full bg-primary mt-1 animate-pulse"></span>
            )}
          </button>
        ))}
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleMute} 
          className="text-gray-600 hover:text-gray-900"
          aria-label={muted ? "Ativar som" : "Silenciar"}
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <Slider
          value={[volume]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          aria-label="Controle de volume"
          className="flex-1"
        />
        <div className="text-xs text-gray-500 w-10">
          {Math.round(volume * 100)}%
        </div>
      </div>
      
      {activeSound && (
        <div className="mt-4 p-3 bg-pink-50/50 border border-pink-100 rounded-lg animate-fade-in">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">{sounds.find(s => s.id === activeSound)?.icon}</span>
              <div className="text-sm font-medium">
                {sounds.find(s => s.id === activeSound)?.name}
              </div>
            </div>
            <button
              onClick={() => setActiveSound(null)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 bg-white/80 px-2 py-1 rounded-md"
            >
              <Pause size={16} />
              <span className="text-xs">Pausar</span>
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="relative w-full h-1 bg-pink-100 rounded-full overflow-hidden">
              <div className="absolute inset-0 flex space-x-1">
                <div className="w-1 h-full bg-pink-300/70 animate-[pulse_1s_ease-in-out_infinite]"></div>
                <div className="w-1 h-full bg-pink-300/70 animate-[pulse_1.3s_ease-in-out_infinite]"></div>
                <div className="w-1 h-full bg-pink-300/70 animate-[pulse_0.7s_ease-in-out_infinite]"></div>
                <div className="w-1 h-full bg-pink-300/70 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                <div className="w-1 h-full bg-pink-300/70 animate-[pulse_0.8s_ease-in-out_infinite]"></div>
              </div>
            </div>
            <div className="text-xs text-pink-600">
              {isPlaying ? "Reproduzindo" : "Pausado"}
            </div>
          </div>
        </div>
      )}
      
      {/* Audio test element for debugging */}
      <audio id="audio-test" controls style={{ display: 'none' }}></audio>
      
      {/* Added debug button for testing */}
      <div className="mt-4">
        <button 
          className="text-xs bg-pink-100 hover:bg-pink-200 text-pink-700 py-1 px-2 rounded"
          onClick={() => {
            if (activeSound) {
              const sound = sounds.find(s => s.id === activeSound);
              if (sound) testPlaySound(sound.audioUrl);
            }
          }}
        >
          Testar áudio atual
        </button>
      </div>
    </div>
  );
};

export default AmbientSounds;
