import React from 'react';
import { useAudioStore } from '../../store';
import { useAudioPlayer } from '../../hooks';
import './AudioPlayer.css';

export const AudioPlayer: React.FC = () => {
  const { volume, subtitlesEnabled } = useAudioStore();
  const { isPlaying, currentAudio, pauseAudio, resumeAudio, stopAudio, setVolume } = useAudioPlayer();

  if (!currentAudio) return null;

  return (
    <div className="audio-player">
      <div className="audio-player__controls">
        <button 
          className="audio-player__btn"
          onClick={isPlaying ? pauseAudio : resumeAudio}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <button 
          className="audio-player__btn audio-player__btn--stop"
          onClick={stopAudio}
        >
          ⏹️
        </button>
        
        <div className="audio-player__volume">
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="audio-player__slider"
          />
          <span>{volume}%</span>
        </div>
      </div>
      
      {subtitlesEnabled && currentAudio.text && (
        <div className="audio-player__subtitles">
          <p>{currentAudio.text}</p>
        </div>
      )}
    </div>
  );
};
