import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services';
import { useUserStore, useGameStore, useRoomStore } from '../../store';
import { useGameSocket } from '../../hooks';
import { AudioPlayer, PlayerCard } from '../../components';
import './GamePage.css';

export const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { game, myRole, selectedTarget, setSelectedTarget, mafiaMembers } = useGameStore();
  const { room } = useRoomStore();
  
  const [timer] = useState<number>(0);
  const [showRoleModal, setShowRoleModal] = useState(false);
  
  const gameSocket = useGameSocket(room?.id, user?.id);

  useEffect(() => {
    if (gameId) {
      loadGameState();
    }
  }, [gameId]);

  useEffect(() => {
    if (myRole && !showRoleModal) {
      setShowRoleModal(true);
    }
  }, [myRole]);

  const loadGameState = async () => {
    try {
      await apiService.getGameState(gameId!);
      // Update store
    } catch (error) {
      console.error('Error loading game:', error);
    }
  };

  const handleSelectTarget = (playerId: string) => {
    if (selectedTarget === playerId) {
      setSelectedTarget(undefined);
    } else {
      setSelectedTarget(playerId);
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedTarget || !game || !user) return;

    const myPlayer = game.players.find(p => p.user.id === user.id);
    if (!myPlayer) return;

    try {
      switch (game.phase) {
        case 'MAFIA_TURN':
          if (myRole === 'MAFIA' || myRole === 'DON') {
            await gameSocket.mafiaAction(game.id, myPlayer.id, selectedTarget);
          }
          break;
        case 'SHERIFF_TURN':
          if (myRole === 'SHERIFF') {
            await gameSocket.sheriffAction(game.id, myPlayer.id, selectedTarget);
          }
          break;
        case 'DOCTOR_TURN':
          if (myRole === 'DOCTOR') {
            await gameSocket.doctorAction(game.id, myPlayer.id, selectedTarget);
          }
          break;
        case 'DON_TURN':
          if (myRole === 'DON') {
            await gameSocket.donAction(game.id, myPlayer.id, selectedTarget);
          }
          break;
        case 'VOTING':
          await gameSocket.vote(game.id, myPlayer.id, selectedTarget);
          break;
      }
      setSelectedTarget(undefined);
    } catch (error) {
      console.error('Action error:', error);
    }
  };

  const canSelectTarget = () => {
    if (!game || !myRole) return false;
    
    const myPlayer = game.players.find(p => p.user.id === user?.id);
    if (!myPlayer?.isAlive) return false;

    switch (game.phase) {
      case 'MAFIA_TURN':
        return myRole === 'MAFIA' || myRole === 'DON';
      case 'SHERIFF_TURN':
        return myRole === 'SHERIFF';
      case 'DOCTOR_TURN':
        return myRole === 'DOCTOR';
      case 'DON_TURN':
        return myRole === 'DON';
      case 'VOTING':
        return true;
      default:
        return false;
    }
  };

  const getPhaseTitle = () => {
    if (!game) return '';
    
    const phaseTitles: Record<string, string> = {
      'ROLE_ASSIGNMENT': '🎭 Rollar taqsimlanmoqda...',
      'NIGHT': '🌙 Tun',
      'MAFIA_TURN': '🔫 Mafia vaqti',
      'SHERIFF_TURN': '🔍 Komissar vaqti',
      'DOCTOR_TURN': '💉 Doktor vaqti',
      'DON_TURN': '🎩 Don vaqti',
      'MORNING': '☀️ Tong',
      'DISCUSSION': '💬 Muhokama',
      'VOTING': '🗳️ Ovoz berish',
      'LAST_WORD': '💭 So\'nggi so\'z',
      'GAME_OVER': '🏆 O\'yin tugadi',
    };
    
    return phaseTitles[game.phase] || game.phase;
  };

  const getActionButtonText = () => {
    if (!game) return 'Tanlash';
    
    switch (game.phase) {
      case 'MAFIA_TURN':
        return '💀 O\'ldirish';
      case 'SHERIFF_TURN':
        return '🔍 Tekshirish';
      case 'DOCTOR_TURN':
        return '💉 Himoya qilish';
      case 'DON_TURN':
        return '🔍 Sheriff izlash';
      case 'VOTING':
        return '🗳️ Ovoz berish';
      default:
        return 'Tanlash';
    }
  };

  if (!game) {
    return (
      <div className="game-page game-page--loading">
        <div className="loader">🎭</div>
        <p>O'yin yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="game-page">
      <header className="game-header">
        <div className="game-header__phase">{getPhaseTitle()}</div>
        <div className="game-header__day">Kun: {game.dayNumber}</div>
        {timer > 0 && (
          <div className="game-header__timer">{timer}s</div>
        )}
      </header>

      {myRole && (
        <div className={`role-badge role-badge--${myRole.toLowerCase()}`}>
          {myRole === 'CIVILIAN' && '👤 Tinch aholi'}
          {myRole === 'MAFIA' && '🔫 Mafia'}
          {myRole === 'DON' && '🎩 Don'}
          {myRole === 'SHERIFF' && '🔍 Komissar'}
          {myRole === 'DOCTOR' && '💉 Doktor'}
        </div>
      )}

      <section className="players-section">
        <h3>O'yinchilar ({game.players.filter(p => p.isAlive).length} tirik)</h3>
        <div className="players-grid">
          {game.players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isCurrentUser={player.user.id === user?.id}
              isSelected={selectedTarget === player.id}
              showRole={game.phase === 'GAME_OVER' || player.user.id === user?.id}
              canSelect={canSelectTarget() && player.user.id !== user?.id && player.isAlive}
              onSelect={() => handleSelectTarget(player.id)}
            />
          ))}
        </div>
      </section>

      {/* Mafia members (only for mafia) */}
      {(myRole === 'MAFIA' || myRole === 'DON') && mafiaMembers.length > 0 && (
        <section className="mafia-section">
          <h3>🤝 Sizning sheriklaringiz</h3>
          <div className="mafia-members">
            {mafiaMembers.map((member) => (
              <span key={member.id}>{member.user.firstName}</span>
            ))}
          </div>
        </section>
      )}

      {/* Action Button */}
      {canSelectTarget() && selectedTarget && (
        <div className="action-bar">
          <button 
            className="btn btn--action"
            onClick={handleConfirmAction}
          >
            {getActionButtonText()}
          </button>
        </div>
      )}

      {/* Game Over */}
      {game.phase === 'GAME_OVER' && (
        <div className="game-over">
          <h2>
            {game.winner === 'CIVILIAN' ? '👥 Tinch aholi g\'alaba qozondi!' : '🔫 Mafia g\'alaba qozondi!'}
          </h2>
          <button className="btn btn--primary" onClick={() => navigate('/')}>
            Bosh sahifaga qaytish
          </button>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && myRole && (
        <div className="modal-overlay" onClick={() => setShowRoleModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>🎭 Sizning rolingiz</h2>
            <div className={`role-display role-display--${myRole.toLowerCase()}`}>
              {myRole === 'CIVILIAN' && '👤 Tinch aholi'}
              {myRole === 'MAFIA' && '🔫 Mafia'}
              {myRole === 'DON' && '🎩 Don'}
              {myRole === 'SHERIFF' && '🔍 Komissar'}
              {myRole === 'DOCTOR' && '💉 Doktor'}
            </div>
            <p className="role-description">
              {myRole === 'CIVILIAN' && 'Mafialarni toping va ovoz berish orqali ularni yo\'q qiling!'}
              {myRole === 'MAFIA' && 'Har kecha tinch aholidan birini o\'ldiring. Kunduzi o\'zingizni yashiring!'}
              {myRole === 'DON' && 'Siz mafia boshlig\'isiz. Sheriffni topib, uni yo\'q qiling!'}
              {myRole === 'SHERIFF' && 'Har kecha birini tekshiring va mafialarni aniqlang!'}
              {myRole === 'DOCTOR' && 'Har kecha birini himoya qiling. U mafia hujumidan omon qoladi!'}
            </p>
            <button className="btn btn--primary" onClick={() => setShowRoleModal(false)}>
              Tushunarli
            </button>
          </div>
        </div>
      )}

      <AudioPlayer />
    </div>
  );
};
