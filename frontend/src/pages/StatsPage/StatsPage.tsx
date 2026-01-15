import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store';
import { apiService } from '../../services';
import { useTranslation } from '../../i18n';
import './StatsPage.css';

interface UserStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  mafiaGames: number;
  mafiaWins: number;
  civilianGames: number;
  civilianWins: number;
  sheriffGames: number;
  doctorGames: number;
  donGames: number;
  bestStreak: number;
  currentStreak: number;
}

export const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      if (user) {
        const data = await apiService.getUserStats(user.id);
        setStats(data as UserStats);
      } else {
        // Demo stats
        setStats({
          totalGames: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          mafiaGames: 0,
          mafiaWins: 0,
          civilianGames: 0,
          civilianWins: 0,
          sheriffGames: 0,
          doctorGames: 0,
          donGames: 0,
          bestStreak: 0,
          currentStreak: 0,
        });
      }
    } catch (error) {
      console.error('Stats error:', error);
      setStats({
        totalGames: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        mafiaGames: 0,
        mafiaWins: 0,
        civilianGames: 0,
        civilianWins: 0,
        sheriffGames: 0,
        doctorGames: 0,
        donGames: 0,
        bestStreak: 0,
        currentStreak: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stats-page stats-page--loading">
        <img src="/images/logo.png" alt="Loading" className="loader-logo" />
        <p>{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <header className="stats-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          {t.back}
        </button>
        <h1><img src="/images/icon-stats.svg" alt="" className="header-icon" /> {t.stats.title}</h1>
      </header>

      <div className="stats-user">
        <div className="stats-user__avatar">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.firstName} />
          ) : (
            <div className="stats-user__avatar-placeholder">
              {user?.firstName?.charAt(0)?.toUpperCase() || '👤'}
            </div>
          )}
        </div>
        <div className="stats-user__info">
          <h2>{user?.firstName} {user?.lastName || ''}</h2>
          <p>@{user?.username || 'noaniq'}</p>
        </div>
      </div>

      <section className="stats-overview">
        <h3><span className="section-icon">📊</span> {t.stats.overview}</h3>
        <div className="stats-grid">
          <div className="stat-card stat-card--primary">
            <img src="/images/icon-games.svg" alt="" className="stat-card__icon" />
            <span className="stat-card__value">{stats?.totalGames || 0}</span>
            <span className="stat-card__label">{t.stats.totalGames}</span>
          </div>
          <div className="stat-card stat-card--success">
            <img src="/images/icon-wins.svg" alt="" className="stat-card__icon" />
            <span className="stat-card__value">{stats?.wins || 0}</span>
            <span className="stat-card__label">{t.stats.wins}</span>
          </div>
          <div className="stat-card stat-card--danger">
            <img src="/images/icon-losses.svg" alt="" className="stat-card__icon" />
            <span className="stat-card__value">{stats?.losses || 0}</span>
            <span className="stat-card__label">{t.stats.losses}</span>
          </div>
          <div className="stat-card stat-card--info">
            <img src="/images/icon-percent.svg" alt="" className="stat-card__icon" />
            <span className="stat-card__value">{stats?.winRate || 0}%</span>
            <span className="stat-card__label">{t.stats.winRate}</span>
          </div>
        </div>
      </section>

      <section className="stats-roles">
        <h3><span className="section-icon">🎭</span> {t.stats.byRole}</h3>
        <div className="role-stats">
          <div className="role-stat">
            <img src="/images/role.oddiyaholi.png" alt={t.rules.civilian} className="role-stat__icon-img" />
            <div className="role-stat__info">
              <span className="role-stat__name">{t.rules.civilian}</span>
              <span className="role-stat__value">{stats?.civilianGames || 0} {t.stats.totalGames.toLowerCase()}, {stats?.civilianWins || 0} {t.stats.wins.toLowerCase()}</span>
            </div>
          </div>
          <div className="role-stat">
            <img src="/images/role.mafiya.png" alt={t.rules.mafia} className="role-stat__icon-img" />
            <div className="role-stat__info">
              <span className="role-stat__name">{t.rules.mafia}</span>
              <span className="role-stat__value">{stats?.mafiaGames || 0} {t.stats.totalGames.toLowerCase()}, {stats?.mafiaWins || 0} {t.stats.wins.toLowerCase()}</span>
            </div>
          </div>
          <div className="role-stat">
            <img src="/images/role.don.png" alt={t.rules.don} className="role-stat__icon-img" />
            <div className="role-stat__info">
              <span className="role-stat__name">{t.rules.don}</span>
              <span className="role-stat__value">{stats?.donGames || 0} {t.stats.totalGames.toLowerCase()}</span>
            </div>
          </div>
          <div className="role-stat">
            <img src="/images/role.kamissar.png" alt={t.rules.sheriff} className="role-stat__icon-img" />
            <div className="role-stat__info">
              <span className="role-stat__name">{t.rules.sheriff}</span>
              <span className="role-stat__value">{stats?.sheriffGames || 0} {t.stats.totalGames.toLowerCase()}</span>
            </div>
          </div>
          <div className="role-stat">
            <img src="/images/role.doctor.png" alt={t.rules.doctor} className="role-stat__icon-img" />
            <div className="role-stat__info">
              <span className="role-stat__name">{t.rules.doctor}</span>
              <span className="role-stat__value">{stats?.doctorGames || 0} {t.stats.totalGames.toLowerCase()}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-streaks">
        <h3><img src="/images/icon-streak.svg" alt="" className="section-icon" /> {t.stats.streaks}</h3>
        <div className="streak-cards">
          <div className="streak-card">
            <img src="/images/icon-trophy.svg" alt="" className="streak-card__icon-img" />
            <span className="streak-card__value">{stats?.bestStreak || 0}</span>
            <span className="streak-card__label">{t.stats.bestStreak}</span>
          </div>
          <div className="streak-card">
            <img src="/images/icon-lightning.svg" alt="" className="streak-card__icon-img" />
            <span className="streak-card__value">{stats?.currentStreak || 0}</span>
            <span className="streak-card__label">{t.stats.currentStreak}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StatsPage;
