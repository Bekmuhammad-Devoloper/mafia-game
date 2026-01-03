import { useEffect, useRef, useCallback } from 'react';
import { useAudioStore } from '../store';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { audio, volume, setPlaying, setCurrentAudio } = useAudioStore();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audioElement = audioRef.current;
    audioElement.volume = volume / 100;

    const handleEnded = () => {
      setPlaying(false);
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setPlaying(false);
    };

    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('error', handleError);

    return () => {
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('error', handleError);
    };
  }, [volume, setPlaying]);

  const playAudio = useCallback(async (url: string, text: string, category: string) => {
    if (!audioRef.current) return;

    try {
      // Stop current audio
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      // Set new audio
      audioRef.current.src = url;
      setCurrentAudio({ url, text, category });

      // Play
      await audioRef.current.play();
      setPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlaying(false);
    }
  }, [setCurrentAudio, setPlaying]);

  const stopAudio = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
    setCurrentAudio(undefined);
  }, [setCurrentAudio, setPlaying]);

  const pauseAudio = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setPlaying(false);
  }, [setPlaying]);

  const resumeAudio = useCallback(async () => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch (error) {
      console.error('Error resuming audio:', error);
    }
  }, [setPlaying]);

  const setAudioVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  }, []);

  return {
    isPlaying: audio.isPlaying,
    currentAudio: audio.currentAudio,
    playAudio,
    stopAudio,
    pauseAudio,
    resumeAudio,
    setVolume: setAudioVolume,
  };
}
