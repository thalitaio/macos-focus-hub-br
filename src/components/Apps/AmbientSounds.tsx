
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
  
  // Handle sound changes - Simplified: This might pause if activeSound is set to null elsewhere
  useEffect(() => {
    if (!audioRef.current) return;

    if (!activeSound && isPlaying) {
      // If activeSound is null and audio is still marked as playing, pause it.
      // This can happen if activeSound is set to null directly, not via toggleSound.
      console.log("activeSound is null, ensuring audio is paused.");
      audioRef.current.pause();
      setIsPlaying(false);
    }
    // Event listeners for 'canplaythrough' and 'error' are removed as per instructions,
    // as playback is now handled more directly in toggleSound.
    // Cleanup of listeners is also removed for the same reason.
  }, [activeSound, isPlaying]); // Added isPlaying to dependencies

  // Handle volume changes separately to avoid reloading audio
  useEffect(() => {
    if (audioRef.current) {
      console.log("Updating volume:", muted ? 0 : volume);
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);
  
  const toggleSound = (newSoundId: string) => {
    console.log("Toggle sound:", newSoundId, "Current active:", activeSound);

    if (audioRef.current && newSoundId === activeSound) {
      audioRef.current.pause();
      setIsPlaying(false);
      setActiveSound(null);
      console.log("Sound paused:", newSoundId);
      // Optional: Toast for pausing, if desired
      // toast({
      //   title: "Som pausado",
      //   description: `${sounds.find(s => s.id === newSoundId)?.name} foi pausado.`,
      //   duration: 1500,
      // });
      return;
    }

    if (audioRef.current) {
      // Pause previous sound if any is playing or attempting to play
      // This check ensures we don't call pause on an already paused audio unless changing source
      if (isPlaying || activeSound) {
         audioRef.current.pause();
         setIsPlaying(false);
         console.log("Previous sound paused before switching.");
      }
    }

    const sound = sounds.find(s => s.id === newSoundId);

    if (sound && audioRef.current) {
      console.log("Setting new audio source:", sound.audioUrl);
      audioRef.current.src = sound.audioUrl;
      audioRef.current.load(); // Important to load the new source

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("Playback started successfully for:", sound.name);
          setIsPlaying(true);
          setActiveSound(newSoundId); // Set active sound only after successful play
          toast({
            title: "Som ativado",
            description: `${sound.name} está sendo reproduzido`,
            duration: 2000,
          });
        }).catch(error => {
          console.error("Audio playback failed in toggleSound:", error);
          setIsPlaying(false);
          setActiveSound(null); // Clear active sound on error
          toast({
            title: "Erro ao reproduzir",
            description: "Não foi possível reproduzir o som. Verifique as permissões do navegador para autoplay.",
            variant: "destructive",
          });
        });
      }
    } else {
      if (!sound) {
        console.error("Sound not found:", newSoundId);
      }
      if (!audioRef.current) {
        console.error("Audio reference is null. Cannot play sound.");
      }
      // Optionally, provide feedback if the sound couldn't be played
      toast({
        title: "Erro",
        description: "Não foi possível encontrar o som ou o player de áudio não está pronto.",
        variant: "destructive",
      });
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
              onClick={() => {
                if (audioRef.current && activeSound) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                  setActiveSound(null);
                  // Optional: Toast for pausing
                  const soundName = sounds.find(s => s.id === activeSound)?.name;
                  if (soundName) {
                    toast({
                      title: "Som pausado",
                      description: `${soundName} foi pausado.`,
                      duration: 1500,
                    });
                  }
                }
              }}
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
    </div>
  );
};

export default AmbientSounds;
