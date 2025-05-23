
import React, { useState } from 'react';
import { Search, Play, Volume2, VolumeX, Maximize2, Minimize2, X, Youtube } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from "@/hooks/use-toast";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
}

const YouTubePlayer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentVideo, setCurrentVideo] = useLocalStorage<Video | null>('youtube-current-video', null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [recentVideos, setRecentVideos] = useLocalStorage<Video[]>('youtube-recent', []);
  const { toast } = useToast();

  // Vídeos lofi pré-configurados
  const lofiVideos: Video[] = [
    {
      id: '5qap5aO4i9A',
      title: 'lofi hip hop radio 📚 - beats to relax/study to',
      thumbnail: `https://img.youtube.com/vi/5qap5aO4i9A/mqdefault.jpg`,
      channel: 'Lofi Girl'
    },
    {
      id: 'jfKfPfyJRdk',
      title: 'lofi hip hop radio 😴 - beats to sleep/chill to',
      thumbnail: `https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg`,
      channel: 'Lofi Girl'
    },
    {
      id: 'lTRiuFIWV54',
      title: 'Study Music Alpha Waves: Relaxing Studying Music',
      thumbnail: `https://img.youtube.com/vi/lTRiuFIWV54/mqdefault.jpg`,
      channel: 'YellowBrickCinema'
    },
    {
      id: 'n61ULEU7CO0',
      title: 'Ambient Study Music To Concentrate',
      thumbnail: `https://img.youtube.com/vi/n61ULEU7CO0/mqdefault.jpg`,
      channel: 'The Relaxed Movement'
    },
    {
      id: 'DWcJFNfaw9c',
      title: 'Chillhop Radio - jazzy & lofi hip hop beats',
      thumbnail: `https://img.youtube.com/vi/DWcJFNfaw9c/mqdefault.jpg`,
      channel: 'Chillhop Music'
    },
    {
      id: 'XULUBg_ZcAU',
      title: 'lofi beats - focus music for work and study',
      thumbnail: `https://img.youtube.com/vi/XULUBg_ZcAU/mqdefault.jpg`,
      channel: 'Chilled Cow'
    }
  ];

  const [availableVideos, setAvailableVideos] = useState<Video[]>(lofiVideos);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Simular busca filtrando vídeos lofi por título
    const filtered = lofiVideos.filter(video => 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setAvailableVideos(filtered);
    
    if (filtered.length === 0) {
      toast({
        title: "Nenhum resultado encontrado",
        description: `Não encontramos vídeos para "${searchQuery}"`,
        duration: 3000,
      });
    }
  };

  const playVideo = (video: Video) => {
    setCurrentVideo(video);
    setIsPlaying(true);
    
    // Adicionar aos recentes se não estiver lá
    const newRecents = [video, ...recentVideos.filter(v => v.id !== video.id)].slice(0, 5);
    setRecentVideos(newRecents);
    
    toast({
      title: "Reproduzindo",
      description: video.title,
      duration: 2000,
    });
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const closePlayer = () => {
    setCurrentVideo(null);
    setIsPlaying(false);
    setIsFullscreen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setAvailableVideos(lofiVideos);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Barra de busca */}
      <div className="p-4 bg-white border-b">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar vídeos lofi..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Search size={18} />
          </Button>
          {searchQuery && (
            <Button type="button" variant="outline" onClick={clearSearch}>
              Limpar
            </Button>
          )}
        </form>
      </div>

      {/* Player de vídeo - só aparece quando um vídeo é selecionado */}
      {currentVideo && (
        <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'relative'}`}>
          <div className={`${isFullscreen ? 'w-full h-full' : 'aspect-video'} relative`}>
            <iframe
              src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1`}
              title={currentVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
            
            {/* Controles do player */}
            <div className={`absolute ${isFullscreen ? 'top-4 right-4' : 'top-2 right-2'} flex gap-2`}>
              <Button 
                size="icon" 
                variant="secondary"
                onClick={toggleMute}
                className="bg-black/70 hover:bg-black/90 text-white"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </Button>
              <Button 
                size="icon" 
                variant="secondary"
                onClick={toggleFullscreen}
                className="bg-black/70 hover:bg-black/90 text-white"
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </Button>
              <Button 
                size="icon" 
                variant="secondary"
                onClick={closePlayer}
                className="bg-black/70 hover:bg-black/90 text-white"
              >
                <X size={16} />
              </Button>
            </div>
          </div>
          
          {/* Info do vídeo atual */}
          {!isFullscreen && (
            <div className="p-3 bg-white border-b">
              <h3 className="font-medium text-sm">{currentVideo.title}</h3>
              <p className="text-xs text-gray-600">{currentVideo.channel}</p>
            </div>
          )}
        </div>
      )}

      {/* Área de exibição vazia quando nenhum vídeo está selecionado */}
      {!currentVideo && (
        <div className="flex justify-center items-center h-48 bg-gray-100 mb-4">
          <div className="text-center text-gray-500">
            <Youtube size={48} className="mx-auto mb-2 opacity-50" />
            <p>Selecione um vídeo para começar a reproduzir</p>
          </div>
        </div>
      )}

      {/* Lista de vídeos */}
      {!isFullscreen && (
        <div className="flex-1 overflow-y-auto p-4">
          {/* Vídeos disponíveis */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              {searchQuery ? `Resultados para "${searchQuery}"` : 'Vídeos Lofi Recomendados'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex gap-3 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => playVideo(video)}
                >
                  <div className="relative w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                      <Play size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium line-clamp-2 mb-1">{video.title}</h4>
                    <p className="text-xs text-gray-600">{video.channel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vídeos recentes */}
          {recentVideos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Reproduzidos recentemente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recentVideos.map((video) => (
                  <div
                    key={video.id}
                    className="flex gap-3 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => playVideo(video)}
                  >
                    <div className="relative w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                        <Play size={16} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-2 mb-1">{video.title}</h4>
                      <p className="text-xs text-gray-600">{video.channel}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default YouTubePlayer;
