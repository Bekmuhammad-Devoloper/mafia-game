import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { GamePage } from './pages/GamePage';
import { LobbyPage } from './pages/LobbyPage';
import { SettingsPage } from './pages/SettingsPage';
import { StatsPage } from './pages/StatsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { RulesPage } from './pages/RulesPage';
import { CreateRoomPage } from './pages/CreateRoomPage';
import { useUserStore, useUIStore } from './store';
import { socketService } from './services/socket.service';
import { AudioPlayer } from './components/AudioPlayer/AudioPlayer';
import './App.css';

// Telegram Web App SDK
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
        };
      };
    };
  }
}

const App: React.FC = () => {
  const { setUser } = useUserStore();
  const { error, setError } = useUIStore();

  useEffect(() => {
    // Initialize Telegram Web App
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      // Get user from Telegram
      const tgUser = tg.initDataUnsafe.user;
      if (tgUser) {
        setUser({
          id: tgUser.id.toString(),
          telegramId: tgUser.id.toString(),
          firstName: tgUser.first_name,
          lastName: tgUser.last_name,
          username: tgUser.username,
          voiceType: 'MALE_1',
          voiceSpeed: 1.0,
          volume: 80,
          subtitlesEnabled: true,
          autoPlayEnabled: true,
          atmosphereEnabled: true,
        });
      }
    } else {
      // Development mode - mock user
      console.log('Running in development mode without Telegram');
      setUser({
        id: 'dev-user-123',
        telegramId: '123456789',
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        voiceType: 'MALE_1',
        voiceSpeed: 1.0,
        volume: 80,
        subtitlesEnabled: true,
        autoPlayEnabled: true,
        atmosphereEnabled: true,
      });
    }

    // Connect socket
    socketService.connect();

    // Cleanup
    return () => {
      socketService.disconnect();
    };
  }, [setUser]);

  // Auto-hide error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(undefined);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  return (
    <BrowserRouter>
      <div className="app">
        {/* Global Error Toast */}
        {error && (
          <div className="error-toast">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(undefined)}>✕</button>
          </div>
        )}

        {/* Audio Player - Global */}
        <AudioPlayer />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-room" element={<CreateRoomPage />} />
          <Route path="/lobby/:roomId" element={<LobbyPage />} />
          <Route path="/game/:roomId" element={<GamePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
