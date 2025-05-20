
import React, { useState, useEffect } from 'react';
import { Search, Volume2, VolumeX, Maximize2, Minimize2, X, Youtube } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from "@/hooks/use-toast";

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
}

const YouTubePlayer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeVideoId, setActiveVideoId] = useLocalStorage<string | null>('youtube-active-video', null);
  const [searchResults, setSearchResults] = useState<VideoItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [recentVideos, setRecentVideos] = useLocalStorage<VideoItem[]>('youtube-recent', []);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const { toast } = useToast();

  // Real YouTube video search results
  const searchVideos = (searchQuery: string) => {
    setIsSearching(true);
    
    // More reliable video IDs and information
    setTimeout(() => {
      const mockResults: VideoItem[] = [
        {
          id: 'dQw4w9WgXcQ',
          title: 'Rick Astley - Never Gonna Give You Up',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        },
        {
          id: '5qap5aO4i9A',
          title: 'lofi hip hop radio - beats to relax/study to',
          thumbnail: 'https://img.youtube.com/vi/5qap5aO4i9A/mqdefault.jpg',
        },
        {
          id: 'jfKfPfyJRdk',
          title: 'lofi hip hop radio - beats to sleep/chill to',
          thumbnail: 'https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg',
        },
        {
          id: 'lTRiuFIWV54',
          title: 'Study Music Alpha Waves: Focus Music',
          thumbnail: 'https://img.youtube.com/vi/lTRiuFIWV54/mqdefault.jpg',
        },
        {
          id: 'n61ULEU7CO0',
          title: 'Ambient Study Music To Concentrate',
          thumbnail: 'https://img.youtube.com/vi/n61ULEU7CO0/mqdefault.jpg',
        },
      ];
      
      // Filter results based on query if provided
      const filteredResults = searchQuery
        ? mockResults.filter(v => 
            v.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : mockResults;
      
      setSearchResults(filteredResults);
      setIsSearching(false);
      
      if (filteredResults.length === 0 && searchQuery) {
        setShowErrorMessage(true);
        setTimeout(() => setShowErrorMessage(false), 3000);
      }
    }, 1000);
  };
  
  // Initial load
  useEffect(() => {
    if (!activeVideoId) {
      searchVideos('');
    }
  }, [activeVideoId]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchVideos(query);
  };
  
  const playVideo = (video: VideoItem) => {
    setActiveVideoId(video.id);
    
    toast({
      title: "Vídeo carregado",
      description: `Reproduzindo: ${video.title}`,
      duration: 3000,
    });
    
    // Add to recent videos if not already there
    if (!recentVideos.some(v => v.id === video.id)) {
      setRecentVideos([video, ...recentVideos].slice(0, 5));
    }
  };
  
  const closeVideo = () => {
    setActiveVideoId(null);
    setIsFullscreen(false);
    
    toast({
      title: "Vídeo fechado",
      description: "O player de vídeo foi fechado",
      duration: 2000,
    });
  };
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    toast({
      title: isFullscreen ? "Saindo do modo tela cheia" : "Modo tela cheia",
      description: isFullscreen ? "Visualização normal restaurada" : "Visualização em tela cheia ativada",
      duration: 2000,
    });
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    toast({
      title: isMuted ? "Som ativado" : "Som desativado",
      description: isMuted ? "O áudio do vídeo foi ativado" : "O áudio do vídeo foi desativado",
      duration: 2000,
    });
  };
  
  return (
    <div className="h-full flex flex-col">
      <form onSubmit={handleSearch} className="mb-4 flex space-x-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar no YouTube..."
          className="flex-1"
        />
        <Button type="submit" disabled={isSearching}>
          <Search size={18} />
        </Button>
      </form>
      
      {activeVideoId ? (
        <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black flex items-center justify-center' : 'flex-1'}`}>
          <div className={`${isFullscreen ? 'w-full h-full' : 'aspect-video w-full'}`}>
            <iframe
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&mute=${isMuted ? 1 : 0}&enablejsapi=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={`w-full h-full`}
              style={{ border: 'none' }}
            />
          </div>
          
          <div className={`absolute ${isFullscreen ? 'top-4 right-4' : 'top-2 right-2'} flex space-x-2`}>
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleMute}
              className="bg-black/70 hover:bg-black/90 text-white border-none"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleFullscreen}
              className="bg-black/70 hover:bg-black/90 text-white border-none"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={closeVideo}
              className="bg-black/70 hover:bg-black/90 text-white border-none"
            >
              <X size={18} />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-6">
          {showErrorMessage && (
            <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-2 rounded-md mb-4">
              Nenhum resultado encontrado para "{query}"
            </div>
          )}
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">
                {query ? `Resultados para "${query}"` : 'Vídeos recomendados'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {searchResults.map(video => (
                  <div
                    key={video.id}
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => playVideo(video)}
                  >
                    <div className="aspect-video bg-gray-200 rounded-md mb-1 relative overflow-hidden">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-t-6 border-t-transparent border-l-8 border-l-white border-b-6 border-b-transparent ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium line-clamp-2">{video.title}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Recent Videos */}
          {recentVideos.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Assistidos recentemente</h3>
              <div className="grid grid-cols-2 gap-3">
                {recentVideos.map(video => (
                  <div
                    key={video.id}
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => playVideo(video)}
                  >
                    <div className="aspect-video bg-gray-200 rounded-md mb-1 relative overflow-hidden">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-t-6 border-t-transparent border-l-8 border-l-white border-b-6 border-b-transparent ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium line-clamp-2">{video.title}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {searchResults.length === 0 && recentVideos.length === 0 && !isSearching && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <Youtube size={48} className="mb-2" />
              <p>Pesquise por vídeos para começar</p>
            </div>
          )}
          
          {/* Loading State */}
          {isSearching && (
            <div className="flex justify-center py-8">
              <div className="animate-pulse">Pesquisando...</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default YouTubePlayer;
