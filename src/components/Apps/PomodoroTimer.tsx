
import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, PauseCircle, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const POMODORO_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [progress, setProgress] = useState(100);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimeRef = useRef(POMODORO_TIME);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create the audio element
    audioRef.current = new Audio("https://freesound.org/data/previews/219/219244_4082826-lq.mp3");
    
    return () => {
      // Clean up
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    let totalTime;
    switch (mode) {
      case 'pomodoro':
        totalTime = POMODORO_TIME;
        break;
      case 'shortBreak':
        totalTime = SHORT_BREAK_TIME;
        break;
      case 'longBreak':
        totalTime = LONG_BREAK_TIME;
        break;
      default:
        totalTime = POMODORO_TIME;
    }
    
    totalTimeRef.current = totalTime;
    setTimeLeft(totalTime);
    setProgress(100);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    }
  }, [mode]);
  
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer complete
            if (audioRef.current) {
              audioRef.current.play().catch(error => {
                console.error("Audio playback failed:", error);
              });
            }
            
            clearInterval(timerRef.current!);
            setIsRunning(false);
            
            // Handle cycle completion
            if (mode === 'pomodoro') {
              const newCycles = cycles + 1;
              setCycles(newCycles);
              
              if (newCycles % 4 === 0) {
                setMode('longBreak');
              } else {
                setMode('shortBreak');
              }
            } else {
              setMode('pomodoro');
            }
            
            return 0;
          }
          
          const newTime = prevTime - 1;
          setProgress((newTime / totalTimeRef.current) * 100);
          return newTime;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, mode, cycles]);
  
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };
  
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setTimeLeft(totalTimeRef.current);
    setProgress(100);
    setIsRunning(false);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center space-x-2 mb-4">
        <Button 
          variant={mode === 'pomodoro' ? 'default' : 'outline'} 
          onClick={() => setMode('pomodoro')}
          className="text-sm"
        >
          Pomodoro
        </Button>
        <Button 
          variant={mode === 'shortBreak' ? 'default' : 'outline'} 
          onClick={() => setMode('shortBreak')}
          className="text-sm"
        >
          Pausa Curta
        </Button>
        <Button 
          variant={mode === 'longBreak' ? 'default' : 'outline'} 
          onClick={() => setMode('longBreak')}
          className="text-sm"
        >
          Pausa Longa
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="text-5xl font-semibold mb-6">
          {formatTime(timeLeft)}
        </div>
        
        <Progress value={progress} className="w-full mb-6" />
        
        <div className="flex space-x-4">
          <Button 
            size="icon" 
            variant="outline" 
            onClick={toggleTimer}
          >
            {isRunning ? <PauseCircle size={24} /> : <PlayCircle size={24} />}
          </Button>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={resetTimer}
          >
            <RotateCcw size={24} />
          </Button>
        </div>
      </div>
      
      <div className="text-center mt-4 text-sm text-muted-foreground">
        Ciclos completos hoje: {cycles}
      </div>
    </div>
  );
};

export default PomodoroTimer;
