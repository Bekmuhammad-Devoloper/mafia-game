import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services';
import './LeaderboardPage.css';

interface LeaderboardUser {
  id: string;
  firstName: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
  totalGames: number;
  wins: number;
  winRate: number;
  rank: number;
}

type TimeFilter = 'all' | 'month' | 'week';

export const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
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
      setLeaders(data as LeaderboardUser[]);
    } catch (error) {
      console.error('Leaderboard error:', error);
      // Demo data
      setLeaders([
        { id: '1', firstName: 'Sardor', username: 'sardor_pro', totalGames: 150, wins: 98, winRate: 65, rank: 1 },
        { id: '2', firstName: 'Aziza', username: 'aziza_mafia', totalGames: 120, wins: 72, winRate: 60, rank: 2 },
        { id: '3', firstName: 'Bobur', username: 'bobur_don', totalGames: 100, wins: 55, winRate: 55, rank: 3 },
        { id: '4', firstName: 'Dilnoza', username: 'dilnoza', totalGames: 89, wins: 45, winRate: 51, rank: 4 },
        { id: '5', firstName: 'Eldor', username: 'eldor_sheriff', totalGames: 75, wins: 37, winRate: 49, rank: 5 },
        { id: '6', firstName: 'Farrux', username: 'farrux', totalGames: 60, wins: 28, winRate: 47, rank: 6 },
        { id: '7', firstName: 'Gulnora', username: 'gulnora', totalGames: 50, wins: 22, winRate: 44, rank: 7 },
        { id: '8', firstName: 'Husniddin', username: 'husniddin', totalGames: 45, wins: 18, winRate: 40, rank: 8 },
        { id: '9', firstName: 'Iroda', username: 'iroda', totalGames: 40, wins: 15, winRate: 38, rank: 9 },
        { id: '10', firstName: 'Javohir', username: 'javohir', totalGames: 35, wins: 12, winRate: 34, rank: 10 },
      ]);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="loader">🏆</div>
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      <header className="leaderboard-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Orqaga
        </button>
        <h1>🏆 Reyting</h1>
      </header>

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${timeFilter === 'all' ? 'filter-tab--active' : ''}`}
          onClick={() => setTimeFilter('all')}
        >
          Barcha vaqt
        </button>
        <button 
          className={`filter-tab ${timeFilter === 'month' ? 'filter-tab--active' : ''}`}
          onClick={() => setTimeFilter('month')}
        >
          Bu oy
        </button>
        <button 
          className={`filter-tab ${timeFilter === 'week' ? 'filter-tab--active' : ''}`}
          onClick={() => setTimeFilter('week')}
        >
          Bu hafta
        </button>
      </div>

      {/* Top 3 Podium */}
      <div className="podium">
        {leaders.slice(0, 3).map((leader, index) => (
          <div 
            key={leader.id} 
            className={`podium-item podium-item--${index + 1}`}
            style={{ order: index === 0 ? 2 : index === 1 ? 1 : 3 }}
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
              <span>{leader.wins} g'alaba</span>
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
              <div className="leader-item__wins">{leader.wins} 🏆</div>
              <div className="leader-item__rate">{leader.winRate}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
