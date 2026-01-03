import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store';
import { apiService } from '../../services';
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
        <div className="loader">📊</div>
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <header className="stats-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Orqaga
        </button>
        <h1>📊 Statistika</h1>
      </header>

      <div className="stats-user">
        <div className="stats-user__avatar">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.firstName} />
          ) : (
            <span>{user?.firstName?.charAt(0) || '👤'}</span>
          )}
        </div>
        <div className="stats-user__info">
          <h2>{user?.firstName || 'Mehmon'}</h2>
          <p>@{user?.username || 'username'}</p>
        </div>
      </div>

      <section className="stats-overview">
        <h3>Umumiy natijalar</h3>
        <div className="stats-grid">
          <div className="stat-card stat-card--primary">
            <span className="stat-card__value">{stats?.totalGames || 0}</span>
            <span className="stat-card__label">Jami o'yinlar</span>
          </div>
          <div className="stat-card stat-card--success">
            <span className="stat-card__value">{stats?.wins || 0}</span>
            <span className="stat-card__label">G'alabalar</span>
          </div>
          <div className="stat-card stat-card--danger">
            <span className="stat-card__value">{stats?.losses || 0}</span>
            <span className="stat-card__label">Mag'lubiyatlar</span>
          </div>
          <div className="stat-card stat-card--info">
            <span className="stat-card__value">{stats?.winRate || 0}%</span>
            <span className="stat-card__label">G'alaba foizi</span>
          </div>
        </div>
      </section>

      <section className="stats-roles">
        <h3>🎭 Rollar bo'yicha</h3>
        <div className="role-stats">
          <div className="role-stat">
            <span className="role-stat__icon">👤</span>
            <div className="role-stat__info">
              <span className="role-stat__name">Tinch aholi</span>
              <span className="role-stat__value">{stats?.civilianGames || 0} o'yin, {stats?.civilianWins || 0} g'alaba</span>
            </div>
          </div>
          <div className="role-stat">
            <span className="role-stat__icon">🔫</span>
            <div className="role-stat__info">
              <span className="role-stat__name">Mafia</span>
              <span className="role-stat__value">{stats?.mafiaGames || 0} o'yin, {stats?.mafiaWins || 0} g'alaba</span>
            </div>
          </div>
          <div className="role-stat">
            <span className="role-stat__icon">🎩</span>
            <div className="role-stat__info">
              <span className="role-stat__name">Don</span>
              <span className="role-stat__value">{stats?.donGames || 0} o'yin</span>
            </div>
          </div>
          <div className="role-stat">
            <span className="role-stat__icon">🔍</span>
            <div className="role-stat__info">
              <span className="role-stat__name">Komissar</span>
              <span className="role-stat__value">{stats?.sheriffGames || 0} o'yin</span>
            </div>
          </div>
          <div className="role-stat">
            <span className="role-stat__icon">💉</span>
            <div className="role-stat__info">
              <span className="role-stat__name">Doktor</span>
              <span className="role-stat__value">{stats?.doctorGames || 0} o'yin</span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-streaks">
        <h3>🔥 Seriyalar</h3>
        <div className="streak-cards">
          <div className="streak-card">
            <span className="streak-card__icon">🏆</span>
            <span className="streak-card__value">{stats?.bestStreak || 0}</span>
            <span className="streak-card__label">Eng yaxshi seriya</span>
          </div>
          <div className="streak-card">
            <span className="streak-card__icon">⚡</span>
            <span className="streak-card__value">{stats?.currentStreak || 0}</span>
            <span className="streak-card__label">Joriy seriya</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StatsPage;
