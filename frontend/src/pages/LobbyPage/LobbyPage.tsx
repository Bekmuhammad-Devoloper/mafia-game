import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomStore, useUserStore, useUIStore } from '../../store';
import { socketService } from '../../services/socket.service';
import './LobbyPage.css';

// Modern SVG Icons
const Icons = {
  back: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  copy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  userPlus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
      <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
    </svg>
  ),
  crown: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  loader: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

const LobbyPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { currentRoom, setCurrentRoom, updateRoom, room } = useRoomStore();
  const { setError } = useUIStore();
  const [copied, setCopied] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Agar currentRoom yo'q bo'lsa, room dan olamiz yoki demo yaratamiz
  const activeRoom = currentRoom || room;

  useEffect(() => {
    // Socket ulanishini boshlash
    socketService.connect();
    
    if (!roomId) {
      navigate('/');
      return;
    }

    // Agar xona yo'q bo'lsa, darhol lokal xona yaratamiz
    if (!activeRoom && user) {
      const localRoom = {
        id: roomId,
        code: roomId,
        name: `${user.firstName || 'Mehmon'}ning xonasi`,
        hostId: user.id,
        host: {
          id: user.id,
          firstName: user.firstName || 'Mehmon',
        },
        minPlayers: 4,
        maxPlayers: 10,
        discussionTime: 120,
        votingTime: 60,
        nightTime: 30,
        storyVariant: '1',
        status: 'WAITING' as const,
        players: [{
          id: '1',
          oderId: '1',
          userId: user.id,
          user: {
            id: user.id,
            firstName: user.firstName || 'Siz',
          }
        }],
      };
      setCurrentRoom(localRoom);
    }

    // Socket orqali xonaga qo'shilish
    const joinRoom = () => {
      if (!user || isJoining) return;
      
      setIsJoining(true);
      
      socketService.emit('join_room', {
        roomId: roomId,
        oderId: user.id,
        userName: user.firstName || user.username || 'Mehmon',
      });
      
      // Server bilan sinxronlash urinib ko'riladi (background)
      socketService.emit('create_room', {
        roomId: roomId,
        name: `${user.firstName || 'Mehmon'}ning xonasi`,
        hostId: user.id,
        hostName: user.firstName || user.username || 'Mehmon',
        minPlayers: 4,
        maxPlayers: 10,
      });
    };

    if (user) {
      joinRoom();
    }

    // Socket events - backend event nomlari: room_players, player_joined, player_left
    
    // Xonaga kirganda barcha o'yinchilar ro'yxatini olish
    socketService.on('room_players', (data: any) => {
      console.log('Room players received:', data);
      if (data.players) {
        const formattedPlayers = data.players.map((p: any, index: number) => ({
          id: p.oderId,
          oderId: (index + 1).toString(),
          userId: p.oderId,
          user: {
            id: p.oderId,
            firstName: p.userName || 'Mehmon',
          }
        }));
        updateRoom({ players: formattedPlayers });
      }
    });
    
    // Yangi o'yinchi qo'shilganda
    socketService.on('player_joined', (data: any) => {
      console.log('Player joined:', data);
      // Barcha o'yinchilar ro'yxatini yangilash
      if (data.players && activeRoom) {
        const formattedPlayers = data.players.map((p: any, index: number) => ({
          id: p.oderId,
          oderId: (index + 1).toString(),
          userId: p.oderId,
          user: {
            id: p.oderId,
            firstName: p.userName || 'Mehmon',
          }
        }));
        updateRoom({ players: formattedPlayers });
      }
    });

    // O'yinchi ketganda
    socketService.on('player_left', (data: any) => {
      console.log('Player left:', data);
      if (data.players && activeRoom) {
        const formattedPlayers = data.players.map((p: any, index: number) => ({
          id: p.oderId,
          oderId: (index + 1).toString(),
          userId: p.oderId,
          user: {
            id: p.oderId,
            firstName: p.userName || 'Mehmon',
          }
        }));
        updateRoom({ players: formattedPlayers });
      }
    });

    socketService.on('game_started', (_data: any) => {
      navigate(`/game/${roomId}`);
    });

    socketService.on('error', (data: any) => {
      setError(data.message);
    });

    return () => {
      socketService.off('room_players');
      socketService.off('player_joined');
      socketService.off('player_left');
      socketService.off('game_started');
      socketService.off('error');
    };
  }, [roomId, navigate, setCurrentRoom, updateRoom, setError, activeRoom, user]);

  const displayRoom = activeRoom;

  const handleStartGame = () => {
    if (!displayRoom) return;
    
    // Demo mode - o'yinchilar kam bo'lsa ham o'tkazamiz
    navigate(`/game/${roomId}`);
  };

  const handleLeaveRoom = () => {
    navigate('/');
  };

  const handleCopyLink = () => {
    const link = `https://t.me/MafiaVoiceUzBot?start=${roomId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHost = displayRoom?.hostId === user?.id || true; // Demo uchun hamma host
  const canStart = displayRoom && displayRoom.players.length >= 1; // Demo uchun 1 kishi yetarli

  if (!displayRoom) {
    return (
      <div className="lobby-page lobby-page--loading">
        <img src="/images/logo.png" alt="Loading" className="loader-logo" />
        <p>Xona yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="lobby-page">
      {/* Header */}
      <div className="lobby-header">
        <button className="btn-back" onClick={handleLeaveRoom}>
          {Icons.back} Chiqish
        </button>
        <h1 className="lobby-title">{displayRoom.name}</h1>
      </div>

      {/* Room Info */}
      <div className="room-info">
        <div className="room-info__item">
          <span className="room-info__label">O'yinchilar</span>
          <span className="room-info__value">
            {displayRoom.players.length} / {displayRoom.maxPlayers}
          </span>
        </div>
        <div className="room-info__item">
          <span className="room-info__label">Min o'yinchi</span>
          <span className="room-info__value">{displayRoom.minPlayers}</span>
        </div>
        <div className="room-info__item">
          <span className="room-info__label">Status</span>
          <span className="room-info__status">Kutilmoqda</span>
        </div>
      </div>

      {/* Invite Section */}
      <div className="invite-section">
        <h3><span className="invite-icon">{Icons.link}</span> Do'stlaringizni taklif qiling</h3>
        <div className="invite-actions">
          <button className="btn-invite" onClick={handleCopyLink}>
            {copied ? Icons.check : Icons.copy}
            {copied ? ' Nusxalandi!' : ' Linkni nusxalash'}
          </button>
        </div>
        <p className="room-code">
          Xona kodi: <strong>{roomId?.slice(0, 8)}</strong>
        </p>
      </div>

      {/* Players List */}
      <div className="players-section">
        <h3><span className="section-icon">{Icons.users}</span> O'yinchilar ({displayRoom.players.length})</h3>
        <div className="players-list">
          {displayRoom.players.map((player) => (
            <div key={player.id} className={`player-slot ${player.userId === displayRoom.hostId ? 'player-slot--host' : ''}`}>
              <span className="player-slot__icon">{Icons.user}</span>
              <span className="player-slot__text">
                {player.user?.firstName || 'O\'yinchi'}
                {player.userId === displayRoom.hostId && <span className="host-badge"> {Icons.crown}</span>}
              </span>
            </div>
          ))}
          
          {/* Empty slots */}
          {Array.from({ length: displayRoom.maxPlayers - displayRoom.players.length }).map((_, index) => (
            <div key={`empty-${index}`} className="player-slot player-slot--empty">
              <span className="player-slot__icon">{Icons.userPlus}</span>
              <span className="player-slot__text">Bo'sh joy</span>
            </div>
          ))}
        </div>
      </div>

      {/* Minimum players warning */}
      {displayRoom.players.length < displayRoom.minPlayers && (
        <div className="warning-message">
          ⚠️ O'yinni boshlash uchun kamida {displayRoom.minPlayers} ta o'yinchi kerak
          <span>Yana {displayRoom.minPlayers - displayRoom.players.length} ta o'yinchi kutilmoqda</span>
        </div>
      )}

      {/* Start Button (only for host) */}
      {isHost && (
        <div className="action-bar">
          <button
            className={`btn-start ${canStart ? '' : 'btn-start--disabled'}`}
            onClick={handleStartGame}
            disabled={!canStart}
          >
            {canStart ? (
              <><span className="btn-icon">{Icons.play}</span> O'yinni boshlash</>
            ) : (
              <><span className="btn-icon">{Icons.clock}</span> Kutilmoqda ({displayRoom.players.length}/{displayRoom.minPlayers})</>
            )}
          </button>
        </div>
      )}

      {/* Waiting message for non-host */}
      {!isHost && (
        <div className="waiting-message">
          <span className="waiting-icon">{Icons.loader}</span>
          <span>Xona egasi o'yinni boshlashini kuting...</span>
        </div>
      )}
    </div>
  );
};

export default LobbyPage;
