import React from 'react';
import type { Player } from '../../store';
import './PlayerCard.css';

interface PlayerCardProps {
  player: Player;
  isCurrentUser?: boolean;
  isSelected?: boolean;
  showRole?: boolean;
  canSelect?: boolean;
  onSelect?: () => void;
}

const ROLE_ICONS: Record<string, string> = {
  CIVILIAN: '👤',
  MAFIA: '🔫',
  DON: '🎩',
  SHERIFF: '🔍',
  DOCTOR: '💉',
};

const ROLE_NAMES: Record<string, string> = {
  CIVILIAN: 'Tinch aholi',
  MAFIA: 'Mafia',
  DON: 'Don',
  SHERIFF: 'Komissar',
  DOCTOR: 'Doktor',
};

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isCurrentUser,
  isSelected,
  showRole,
  canSelect,
  onSelect,
}) => {
  const getClassNames = () => {
    const classes = ['player-card'];
    
    if (!player.isAlive) classes.push('player-card--dead');
    if (isCurrentUser) classes.push('player-card--current');
    if (isSelected) classes.push('player-card--selected');
    if (canSelect) classes.push('player-card--selectable');
    
    return classes.join(' ');
  };

  return (
    <div 
      className={getClassNames()} 
      onClick={canSelect && player.isAlive ? onSelect : undefined}
    >
      <div className="player-card__avatar">
        {player.user.avatarUrl ? (
          <img src={player.user.avatarUrl} alt={player.user.firstName} />
        ) : (
          <div className="player-card__avatar-placeholder">
            {player.user.firstName.charAt(0).toUpperCase()}
          </div>
        )}
        
        {!player.isAlive && (
          <div className="player-card__dead-overlay">💀</div>
        )}
      </div>
      
      <div className="player-card__info">
        <div className="player-card__name">
          {player.user.firstName}
          {player.user.lastName && ` ${player.user.lastName.charAt(0)}.`}
          {isCurrentUser && ' (Siz)'}
        </div>
        
        {showRole && player.role && (
          <div className={`player-card__role player-card__role--${player.role.toLowerCase()}`}>
            {ROLE_ICONS[player.role]} {ROLE_NAMES[player.role]}
          </div>
        )}
        
        {player.user.username && (
          <div className="player-card__username">@{player.user.username}</div>
        )}
      </div>
      
      {isSelected && (
        <div className="player-card__check">✓</div>
      )}
    </div>
  );
};
