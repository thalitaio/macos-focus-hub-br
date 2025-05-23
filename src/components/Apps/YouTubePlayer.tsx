import React, { useState } from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const YouTubePlayer: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'relative flex-1'}`}>
        <div className={`${isFullscreen ? 'w-full h-full' : 'aspect-video w-full h-full'} relative`}>
          <iframe
            src={`https://www.youtube.com/embed/sF80I-TQiW0?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1`}
            title="Lofi Hip Hop Radio"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer;
