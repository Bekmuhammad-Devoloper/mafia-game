import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services';
import { useTranslation } from '../../i18n';
import './LeaderboardPage.css';

interface LeaderboardUser {
  id: string;
  firstName: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  rank: number;
}

type TimeFilter = 'all' | 'month' | 'week';

export const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  useEffect(() => {
    loadLeaderboard();
  }, [timeFilter]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await apiService.getLeaderboard(timeFilter);
      if (Array.isArray(data) && data.length > 0) {
        setLeaders(data as LeaderboardUser[]);
      } else {
        // Demo data agar bo'sh bo'lsa
        setLeaders(getDemoData());
      }
    } catch (error) {
      console.error('Leaderboard error:', error);
      // Demo data
      setLeaders(getDemoData());
    } finally {
      setLoading(false);
    }
  };

  const getDemoData = (): LeaderboardUser[] => [
    { id: '1', firstName: 'Sardor', username: 'sardor_pro', gamesPlayed: 150, gamesWon: 98, winRate: 65, rank: 1 },
    { id: '2', firstName: 'Aziza', username: 'aziza_mafia', gamesPlayed: 120, gamesWon: 72, winRate: 60, rank: 2 },
    { id: '3', firstName: 'Bobur', username: 'bobur_don', gamesPlayed: 100, gamesWon: 55, winRate: 55, rank: 3 },
    { id: '4', firstName: 'Dilnoza', username: 'dilnoza', gamesPlayed: 89, gamesWon: 45, winRate: 51, rank: 4 },
    { id: '5', firstName: 'Eldor', username: 'eldor_sheriff', gamesPlayed: 75, gamesWon: 37, winRate: 49, rank: 5 },
    { id: '6', firstName: 'Farrux', username: 'farrux', gamesPlayed: 60, gamesWon: 28, winRate: 47, rank: 6 },
    { id: '7', firstName: 'Gulnora', username: 'gulnora', gamesPlayed: 50, gamesWon: 22, winRate: 44, rank: 7 },
    { id: '8', firstName: 'Husniddin', username: 'husniddin', gamesPlayed: 45, gamesWon: 18, winRate: 40, rank: 8 },
    { id: '9', firstName: 'Iroda', username: 'iroda', gamesPlayed: 40, gamesWon: 15, winRate: 38, rank: 9 },
    { id: '10', firstName: 'Javohir', username: 'javohir', gamesPlayed: 35, gamesWon: 12, winRate: 34, rank: 10 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankClass = (rank: number) => {
    if (rank === 1) return 'leader-item--gold';
    if (rank === 2) return 'leader-item--silver';
    if (rank === 3) return 'leader-item--bronze';
    return '';
  };

  if (loading) {
    return (
      <div className="leaderboard-page leaderboard-page--loading">
        <img src="/images/logo.png" alt="Loading" className="loader-logo" />
        <p>{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      <header className="leaderboard-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          {t.back}
        </button>
        <h1>🏆 {t.leaderboard.title}</h1>
      </header>

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${timeFilter === 'all' ? 'filter-tab--active' : ''}`}
          onClick={() => setTimeFilter('all')}
        >
          {t.leaderboard.allTime}
        </button>
        <button 
          className={`filter-tab ${timeFilter === 'month' ? 'filter-tab--active' : ''}`}
          onClick={() => setTimeFilter('month')}
        >
          {t.leaderboard.thisMonth}
        </button>
        <button 
          className={`filter-tab ${timeFilter === 'week' ? 'filter-tab--active' : ''}`}
          onClick={() => setTimeFilter('week')}
        >
          {t.leaderboard.thisWeek}
        </button>
      </div>

      {/* Top 3 Podium */}
      <div className="podium">
        {leaders.slice(0, 3).map((leader, index) => (
          <div 
            key={leader.id} 
            className={`podium-item podium-item--${index + 1} podium-order--${index + 1}`}
          >
            <div className="podium-item__avatar">
              {leader.avatarUrl ? (
                <img src={leader.avatarUrl} alt={leader.firstName} />
              ) : (
                <span>{leader.firstName.charAt(0)}</span>
              )}
            </div>
            <div className="podium-item__rank">{getRankIcon(index + 1)}</div>
            <div className="podium-item__name">{leader.firstName}</div>
            <div className="podium-item__stats">
              <span>{leader.gamesWon} {t.leaderboard.wins}</span>
              <span>{leader.winRate}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Full List */}
      <div className="leaders-list">
        {leaders.map((leader) => (
          <div key={leader.id} className={`leader-item ${getRankClass(leader.rank)}`}>
            <div className="leader-item__rank">{getRankIcon(leader.rank)}</div>
            <div className="leader-item__avatar">
              {leader.avatarUrl ? (
                <img src={leader.avatarUrl} alt={leader.firstName} />
              ) : (
                <span>{leader.firstName.charAt(0)}</span>
              )}
            </div>
            <div className="leader-item__info">
              <div className="leader-item__name">{leader.firstName} {leader.lastName || ''}</div>
              <div className="leader-item__username">@{leader.username || 'user'}</div>
            </div>
            <div className="leader-item__stats">
              <div className="leader-item__wins">{leader.gamesWon} 🏆</div>
              <div className="leader-item__rate">{leader.winRate}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
