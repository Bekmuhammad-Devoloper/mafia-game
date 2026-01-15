import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services';
import { useUIStore } from '../../store';
import { useTranslation } from '../../i18n';
import './HomePage.css';

// Modern SVG Icons
const Icons = {
  create: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  enter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
    </svg>
  ),
  stats: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  ),
  rules: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setLoading, setError } = useUIStore();
  const { t } = useTranslation();
  const [roomCode, setRoomCode] = useState('');
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    loadAvailableRooms();
  }, []);

  const loadAvailableRooms = async () => {
    try {
      const rooms = await apiService.getAvailableRooms();
      setAvailableRooms(rooms as any[]);
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  const handleCreateRoom = () => {
    navigate('/create-room');
  };

  const handleJoinByCode = async () => {
    if (!roomCode.trim()) {
      setError(t.home.enterRoomCode);
      return;
    }
    
    const code = roomCode.toUpperCase().trim();
    
    // Kod formatini tekshirish (6 ta belgi)
    if (code.length < 4 || code.length > 8) {
      setError(t.home.invalidRoomCode);
      return;
    }
    
    try {
      setLoading(true);
      
      // Avval API dan qidiramiz
      try {
        const room = await apiService.getRoomByCode(code);
        if (room) {
          navigate(`/lobby/${(room as any).id}`);
          return;
        }
      } catch {
        // API ishlamasa, demo rejimga o'tamiz
        console.log('API not available, using demo mode');
      }
      
      // Demo rejim - xona kodiga to'g'ridan-to'g'ri o'tish
      navigate(`/lobby/${code}`);
      
    } catch (error: any) {
      setError(error.message || t.home.roomNotFound);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    navigate(`/lobby/${roomId}`);
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-logo">
          {!logoError ? (
            <img 
              src="/images/logo.png" 
              alt="Mafiya" 
              onError={() => setLogoError(true)} 
            />
          ) : (
            <div className="logo-fallback">
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" stroke="url(#logoGradient)" strokeWidth="4"/>
                <path d="M30 65 L50 30 L70 65 Z" fill="url(#logoGradient)"/>
                <circle cx="50" cy="55" r="8" fill="#1a1a2e"/>
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff6b6b"/>
                    <stop offset="100%" stopColor="#c44569"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}
        </div>
        <h1>MAFIYA</h1>
        <p className="home-subtitle">{t.home.subtitle}</p>
      </header>

      <section className="home-section">
        <h2>{t.home.quickAccess}</h2>
        
        <button className="btn btn--primary btn--large" onClick={handleCreateRoom}>
          <span className="btn-icon">{Icons.create}</span>
          {t.home.createRoom}
        </button>
        
        <div className="join-code">
          <input
            type="text"
            placeholder={t.home.roomCodePlaceholder}
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={6}
          />
          <button className="btn btn--secondary" onClick={handleJoinByCode}>
            <span className="btn-icon">{Icons.enter}</span>
            {t.home.join}
          </button>
        </div>
      </section>

      {availableRooms.length > 0 && (
        <section className="home-section">
          <h2>{t.home.openRooms}</h2>
          <div className="rooms-list">
            {availableRooms.map((room) => (
              <div key={room.id} className="room-item" onClick={() => handleJoinRoom(room.id)}>
                <div className="room-item__info">
                  <h3>{room.name}</h3>
                  <p>
                    <span className="room-item__icon">{Icons.user}</span> {room.host?.firstName || 'Noma\'lum'} | 
                    <span className="room-item__icon">{Icons.users}</span> {room.currentPlayers || 0}/{room.maxPlayers}
                  </p>
                </div>
                <div className="room-item__code">{room.code}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <nav className="home-nav">
        <button onClick={() => navigate('/stats')}>
          <span className="nav-icon">{Icons.stats}</span>
          <span className="nav-label">{t.home.stats}</span>
        </button>
        <button onClick={() => navigate('/leaderboard')}>
          <span className="nav-icon">{Icons.trophy}</span>
          <span className="nav-label">{t.home.leaderboard}</span>
        </button>
        <button onClick={() => navigate('/rules')}>
          <span className="nav-icon">{Icons.rules}</span>
          <span className="nav-label">{t.home.rules}</span>
        </button>
        <button onClick={() => navigate('/settings')}>
          <span className="nav-icon">{Icons.settings}</span>
          <span className="nav-label">{t.home.settings}</span>
        </button>
      </nav>
    </div>
  );
};
