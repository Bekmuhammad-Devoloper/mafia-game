import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUserStore();
  
  const [settings, setSettings] = useState({
    soundEnabled: user?.settings?.soundEnabled ?? true,
    musicEnabled: user?.settings?.musicEnabled ?? true,
    volume: user?.settings?.volume ?? 80,
    vibrationEnabled: user?.settings?.vibrationEnabled ?? true,
    language: user?.settings?.language ?? 'uz',
    voiceType: user?.settings?.voiceType ?? 'male',
    autoPlay: user?.settings?.autoPlay ?? true,
    notifications: user?.settings?.notifications ?? true,
  });

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    // Save settings to user profile
    if (user) {
      updateUser({ settings });
      // TODO: API call to save settings
    }
    navigate(-1);
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Orqaga
        </button>
        <h1 className="settings-title">⚙️ Sozlamalar</h1>
      </div>

      {/* Audio Settings */}
      <div className="settings-section">
        <h2 className="settings-section__title">🔊 Ovoz sozlamalari</h2>
        
        <div className="setting-item">
          <div className="setting-item__info">
            <span className="setting-item__label">Ovoz effektlari</span>
            <span className="setting-item__desc">O'yin ovozlarini yoqish/o'chirish</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => handleChange('soundEnabled', e.target.checked)}
            />
            <span className="toggle__slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-item__info">
            <span className="setting-item__label">Fon musiqasi</span>
            <span className="setting-item__desc">Fon musiqasini yoqish/o'chirish</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.musicEnabled}
              onChange={(e) => handleChange('musicEnabled', e.target.checked)}
            />
            <span className="toggle__slider"></span>
          </label>
        </div>

        <div className="setting-item setting-item--column">
          <div className="setting-item__info">
            <span className="setting-item__label">Balandlik: {settings.volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.volume}
            onChange={(e) => handleChange('volume', parseInt(e.target.value))}
            className="volume-slider"
          />
        </div>

        <div className="setting-item">
          <div className="setting-item__info">
            <span className="setting-item__label">Avtomatik o'ynash</span>
            <span className="setting-item__desc">Ovozli hikoyalarni avtomatik boshlash</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.autoPlay}
              onChange={(e) => handleChange('autoPlay', e.target.checked)}
            />
            <span className="toggle__slider"></span>
          </label>
        </div>
      </div>

      {/* Voice Settings */}
      <div className="settings-section">
        <h2 className="settings-section__title">🎙️ Hikoyachi ovozi</h2>
        
        <div className="voice-options">
          <button
            className={`voice-option ${settings.voiceType === 'male' ? 'voice-option--active' : ''}`}
            onClick={() => handleChange('voiceType', 'male')}
          >
            <span className="voice-option__icon">👨</span>
            <span className="voice-option__label">Erkak ovozi</span>
          </button>
          <button
            className={`voice-option ${settings.voiceType === 'female' ? 'voice-option--active' : ''}`}
            onClick={() => handleChange('voiceType', 'female')}
          >
            <span className="voice-option__icon">👩</span>
            <span className="voice-option__label">Ayol ovozi</span>
          </button>
        </div>
      </div>

      {/* Other Settings */}
      <div className="settings-section">
        <h2 className="settings-section__title">📱 Boshqa sozlamalar</h2>
        
        <div className="setting-item">
          <div className="setting-item__info">
            <span className="setting-item__label">Tebranish</span>
            <span className="setting-item__desc">Telefon tebranishini yoqish</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.vibrationEnabled}
              onChange={(e) => handleChange('vibrationEnabled', e.target.checked)}
            />
            <span className="toggle__slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-item__info">
            <span className="setting-item__label">Bildirishnomalar</span>
            <span className="setting-item__desc">O'yin bildirishnomalarini olish</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleChange('notifications', e.target.checked)}
            />
            <span className="toggle__slider"></span>
          </label>
        </div>
      </div>

      {/* Language Settings */}
      <div className="settings-section">
        <h2 className="settings-section__title">🌐 Til</h2>
        
        <div className="language-options">
          <button
            className={`language-option ${settings.language === 'uz' ? 'language-option--active' : ''}`}
            onClick={() => handleChange('language', 'uz')}
          >
            🇺🇿 O'zbekcha
          </button>
          <button
            className={`language-option ${settings.language === 'ru' ? 'language-option--active' : ''}`}
            onClick={() => handleChange('language', 'ru')}
          >
            🇷🇺 Русский
          </button>
          <button
            className={`language-option ${settings.language === 'en' ? 'language-option--active' : ''}`}
            onClick={() => handleChange('language', 'en')}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      {/* About */}
      <div className="settings-section">
        <h2 className="settings-section__title">ℹ️ Ilova haqida</h2>
        
        <div className="about-info">
          <p><strong>Mafia O'yini</strong></p>
          <p>Versiya: 1.0.0</p>
          <p>Telegram Web App</p>
          <p className="copyright">© 2024 Mafia Game UZ</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="action-bar">
        <button className="btn-save" onClick={handleSave}>
          💾 Saqlash
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
