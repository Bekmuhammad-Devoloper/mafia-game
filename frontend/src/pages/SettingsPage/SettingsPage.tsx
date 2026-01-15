import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store';
import { useTranslation, languageNames, languageFlags } from '../../i18n';
import type { Language } from '../../i18n';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUserStore();
  const { t, language, setLanguage } = useTranslation();
  
  const [settings, setSettings] = useState({
    soundEnabled: user?.settings?.soundEnabled ?? true,
    musicEnabled: user?.settings?.musicEnabled ?? true,
    volume: user?.settings?.volume ?? 80,
    vibrationEnabled: user?.settings?.vibrationEnabled ?? true,
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

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
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
          {t.back}
        </button>
        <h1 className="settings-title">{t.settings.title}</h1>
      </div>

      {/* Audio Settings */}
      <div className="settings-section">
        <h2 className="settings-section__title">{t.settings.audio}</h2>
        
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
            <img src="/images/voice.men.png" alt="Erkak ovozi" className="voice-option__icon-img" />
            <span className="voice-option__label">Erkak ovozi</span>
          </button>
          <button
            className={`voice-option ${settings.voiceType === 'female' ? 'voice-option--active' : ''}`}
            onClick={() => handleChange('voiceType', 'female')}
          >
            <img src="/images/voice.women.png" alt="Ayol ovozi" className="voice-option__icon-img" />
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
        <h2 className="settings-section__title">{t.settings.language}</h2>
        
        <div className="language-options">
          {(['uz', 'ru', 'en'] as Language[]).map((lang) => (
            <button
              key={lang}
              className={`language-option ${language === lang ? 'language-option--active' : ''}`}
              onClick={() => handleLanguageChange(lang)}
            >
              {languageFlags[lang]} {languageNames[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="settings-section">
        <h2 className="settings-section__title">{t.settings.about}</h2>
        
        <div className="about-info">
          <p><strong>Mafia O'yini</strong></p>
          <p>{t.settings.version}: 1.0.0</p>
          <p>{t.settings.telegramWebApp}</p>
          <p className="copyright">{t.settings.copyright}</p>
        </div>
      </div>

      {/* Developer - ID Passport Style */}
      <div className="passport-section">
        <h2 className="settings-section__title">
          <img src="/images/icon-developer.svg" alt="" className="section-icon" />
          {t.settings.developer}
        </h2>
        
        <div className="passport-card">
          {/* Passport Header */}
          <div className="passport-header">
            <div className="passport-header__emblem">🇺🇿</div>
            <div className="passport-header__text">
              <span className="passport-header__country">O'ZBEKISTON RESPUBLIKASI</span>
              <span className="passport-header__type">DEVELOPER ID CARD</span>
            </div>
            <div className="passport-header__emblem">💻</div>
          </div>

          {/* Passport Body */}
          <div className="passport-body">
            {/* Photo Section */}
            <div className="passport-photo">
              <img src="/images/dev.profile.jpg" alt="Developer Photo" />
              <div className="passport-photo__id">DEV-001</div>
            </div>

            {/* Info Section */}
            <div className="passport-info">
              <div className="passport-field">
                <span className="passport-field__label">FAMILIYA / SURNAME</span>
                <span className="passport-field__value">SHAKIRJONOV</span>
              </div>
              <div className="passport-field">
                <span className="passport-field__label">ISM / NAME</span>
                <span className="passport-field__value">BEKMUHAMMAD</span>
              </div>
              <div className="passport-field">
                <span className="passport-field__label">MUTAXASSISLIK / SPECIALIZATION</span>
                <span className="passport-field__value passport-field__value--highlight">BACKEND ENGINEER</span>
              </div>
              <div className="passport-field passport-field--tech">
                <span className="passport-field__label">TEXNOLOGIYALAR / TECH STACK</span>
                <div className="passport-tech-stack">
                  <span className="tech-badge tech-badge--nodejs">Node.js</span>
                  <span className="tech-badge tech-badge--nestjs">NestJS</span>
                  <span className="tech-badge tech-badge--express">Express</span>
                  <span className="tech-badge tech-badge--postgres">PostgreSQL</span>
                  <span className="tech-badge tech-badge--mongo">MongoDB</span>
                  <span className="tech-badge tech-badge--prisma">Prisma</span>
                  <span className="tech-badge tech-badge--redis">Redis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="passport-contacts">
            <a href="https://t.me/Khamidov_online" target="_blank" rel="noopener noreferrer" className="passport-contact">
              <img src="/images/icon-telegram.svg" alt="Telegram" />
              <span>@Khamidov_online</span>
            </a>
            <a href="https://github.com/Bekmuhammad-Devoloper" target="_blank" rel="noopener noreferrer" className="passport-contact">
              <img src="/images/icon-github.svg" alt="GitHub" />
              <span>GitHub</span>
            </a>
            <a href="https://bekmuhammad.uz" target="_blank" rel="noopener noreferrer" className="passport-contact">
              <img src="/images/icon-portfolio.svg" alt="Portfolio" />
              <span>bekmuhammad.uz</span>
            </a>
            <a href="https://www.instagram.com/khamidov__online" target="_blank" rel="noopener noreferrer" className="passport-contact">
              <img src="/images/icon-instagram.svg" alt="Instagram" />
              <span>Instagram</span>
            </a>
          </div>

          {/* MRZ Zone (Machine Readable Zone) */}
          <div className="passport-mrz">
            <div className="passport-mrz__line">IDUZB&lt;&lt;SHAKIRJONOV&lt;&lt;BEKMUHAMMAD&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
            <div className="passport-mrz__line">DEV001&lt;&lt;&lt;BACKEND&lt;&lt;ENGINEER&lt;&lt;&lt;2024&lt;&lt;&lt;</div>
          </div>

          {/* Verified Stamp */}
          <div className="passport-stamp">
            <div className="passport-stamp__circle">
              <span className="passport-stamp__text">VERIFIED</span>
              <span className="passport-stamp__check">✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="action-bar">
        <button className="btn-save" onClick={handleSave}>
          {t.save}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
