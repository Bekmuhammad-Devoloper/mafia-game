import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore, useRoomStore, useUIStore } from '../../store';
import { ROLES, calculateRoles } from '../../constants';
import './CreateRoomPage.css';

interface RoomSettings {
  name: string;
  minPlayers: number;
  maxPlayers: number;
  discussionTime: number;
  votingTime: number;
  nightTime: number;
  storyVariant: number;
}

// Tasodifiy xona kodi yaratish
const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const CreateRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { setRoom } = useRoomStore();
  const { setLoading, setError } = useUIStore();
  
  const [settings, setSettings] = useState<RoomSettings>({
    name: `${user?.firstName || 'Mehmon'}ning xonasi`,
    minPlayers: 6,
    maxPlayers: 10,
    discussionTime: 120,
    votingTime: 60,
    nightTime: 30,
    storyVariant: Math.floor(Math.random() * 50) + 1,
  });

  // Rollar taqsimotini hisoblash
  const roles = calculateRoles(settings.maxPlayers);

  const handleChange = (key: keyof RoomSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateRoom = async () => {
    if (!settings.name.trim()) {
      setError('Xona nomini kiriting');
      return;
    }

    try {
      setLoading(true);
      
      // Demo rejim - lokal xona yaratish
      const roomId = generateRoomCode();
      const newRoom = {
        id: roomId,
        code: roomId,
        name: settings.name,
        hostId: user?.id || 'demo-user',
        host: {
          id: user?.id || 'demo-user',
          firstName: user?.firstName || 'Mehmon',
        },
        minPlayers: settings.minPlayers,
        maxPlayers: settings.maxPlayers,
        discussionTime: settings.discussionTime,
        votingTime: settings.votingTime,
        nightTime: settings.nightTime,
        storyVariant: String(settings.storyVariant),
        status: 'WAITING' as const,
        players: [],
      };
      
      setRoom(newRoom);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      navigate(`/lobby/${roomId}`);
    } catch (error: any) {
      setError(error.message || 'Xona yaratishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-room-page">
      <header className="create-room-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Orqaga
        </button>
        <h1>➕ Yangi xona</h1>
      </header>

      <div className="create-room-form">
        {/* Room Name */}
        <div className="form-group">
          <label>Xona nomi</label>
          <input
            type="text"
            value={settings.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Masalan: Do'stlar bilan o'yin"
            maxLength={30}
          />
        </div>

        {/* Players Count */}
        <div className="form-group">
          <label>O'yinchilar soni</label>
          <div className="player-count">
            <div className="player-count__item">
              <span className="player-count__label">Minimum</span>
              <div className="number-input">
                <button 
                  onClick={() => handleChange('minPlayers', Math.max(4, settings.minPlayers - 1))}
                  disabled={settings.minPlayers <= 4}
                >
                  -
                </button>
                <span>{settings.minPlayers}</span>
                <button 
                  onClick={() => handleChange('minPlayers', Math.min(settings.maxPlayers, settings.minPlayers + 1))}
                  disabled={settings.minPlayers >= settings.maxPlayers}
                >
                  +
                </button>
              </div>
            </div>
            <div className="player-count__item">
              <span className="player-count__label">Maximum</span>
              <div className="number-input">
                <button 
                  onClick={() => handleChange('maxPlayers', Math.max(settings.minPlayers, settings.maxPlayers - 1))}
                  disabled={settings.maxPlayers <= settings.minPlayers}
                >
                  -
                </button>
                <span>{settings.maxPlayers}</span>
                <button 
                  onClick={() => handleChange('maxPlayers', Math.min(15, settings.maxPlayers + 1))}
                  disabled={settings.maxPlayers >= 15}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Time Settings */}
        <div className="form-group">
          <label>⏱️ Vaqt sozlamalari</label>
          
          <div className="time-setting">
            <div className="time-setting__info">
              <span className="time-setting__icon">💬</span>
              <span className="time-setting__label">Muhokama vaqti</span>
            </div>
            <select 
              value={settings.discussionTime}
              onChange={(e) => handleChange('discussionTime', Number(e.target.value))}
            >
              <option value={60}>1 daqiqa</option>
              <option value={90}>1.5 daqiqa</option>
              <option value={120}>2 daqiqa</option>
              <option value={180}>3 daqiqa</option>
              <option value={300}>5 daqiqa</option>
            </select>
          </div>

          <div className="time-setting">
            <div className="time-setting__info">
              <span className="time-setting__icon">🗳️</span>
              <span className="time-setting__label">Ovoz berish vaqti</span>
            </div>
            <select 
              value={settings.votingTime}
              onChange={(e) => handleChange('votingTime', Number(e.target.value))}
            >
              <option value={30}>30 soniya</option>
              <option value={45}>45 soniya</option>
              <option value={60}>1 daqiqa</option>
              <option value={90}>1.5 daqiqa</option>
            </select>
          </div>

          <div className="time-setting">
            <div className="time-setting__info">
              <span className="time-setting__icon">🌙</span>
              <span className="time-setting__label">Tun vaqti</span>
            </div>
            <select 
              value={settings.nightTime}
              onChange={(e) => handleChange('nightTime', Number(e.target.value))}
            >
              <option value={20}>20 soniya</option>
              <option value={30}>30 soniya</option>
              <option value={45}>45 soniya</option>
              <option value={60}>1 daqiqa</option>
            </select>
          </div>
        </div>

        {/* Story Variant */}
        <div className="form-group">
          <label>🎭 Hikoya varianti</label>
          <div className="story-variant">
            <button 
              className="story-variant__btn"
              onClick={() => handleChange('storyVariant', Math.floor(Math.random() * 50) + 1)}
            >
              🎲 Tasodifiy
            </button>
            <span className="story-variant__current">
              Variant #{settings.storyVariant}
            </span>
          </div>
          <p className="form-hint">
            50 dan ortiq turli hikoya varianti mavjud. Har safar yangi tajriba!
          </p>
        </div>

        {/* Roles Preview */}
        <div className="form-group">
          <label>🎭 Rollar taqsimoti ({settings.maxPlayers} o'yinchi uchun)</label>
          <div className="roles-preview">
            <div className="role-preview role-preview--civilian">
              <div className="role-preview__icon-wrap">
                <img src={ROLES.CIVILIAN.image} alt={ROLES.CIVILIAN.name} />
              </div>
              <span className="role-preview__count">{roles.civilian}</span>
              <span className="role-preview__name">{ROLES.CIVILIAN.name}</span>
            </div>
            <div className="role-preview role-preview--mafia">
              <div className="role-preview__icon-wrap">
                <img src={ROLES.MAFIA.image} alt={ROLES.MAFIA.name} />
              </div>
              <span className="role-preview__count">{roles.mafia}</span>
              <span className="role-preview__name">{ROLES.MAFIA.name}</span>
            </div>
            <div className="role-preview role-preview--don">
              <div className="role-preview__icon-wrap">
                <img src={ROLES.DON.image} alt={ROLES.DON.name} />
              </div>
              <span className="role-preview__count">{roles.don}</span>
              <span className="role-preview__name">{ROLES.DON.name}</span>
            </div>
            <div className="role-preview role-preview--sheriff">
              <div className="role-preview__icon-wrap">
                <img src={ROLES.SHERIFF.image} alt={ROLES.SHERIFF.name} />
              </div>
              <span className="role-preview__count">{roles.sheriff}</span>
              <span className="role-preview__name">{ROLES.SHERIFF.name}</span>
            </div>
            <div className="role-preview role-preview--doctor">
              <div className="role-preview__icon-wrap">
                <img src={ROLES.DOCTOR.image} alt={ROLES.DOCTOR.name} />
              </div>
              <span className="role-preview__count">{roles.doctor}</span>
              <span className="role-preview__name">{ROLES.DOCTOR.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Create Button */}
      <div className="create-room-actions">
        <button className="btn-create" onClick={handleCreateRoom}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
          Xona yaratish
        </button>
      </div>
    </div>
  );
};

export default CreateRoomPage;
