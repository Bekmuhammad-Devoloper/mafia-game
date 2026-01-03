import { useEffect } from 'react';
import { socketService } from '../services';
import { useGameStore, useRoomStore } from '../store';
import { useAudioPlayer } from './useAudioPlayer';

export function useGameSocket(roomId?: string, userId?: string) {
  const { setGame, setMyRole, updatePlayer } = useGameStore();
  const { addPlayer, removePlayer } = useRoomStore();
  const { playAudio } = useAudioPlayer();

  useEffect(() => {
    // Connect to socket
    socketService.connect();

    // Player events
    socketService.on('player_joined', (data: any) => {
      console.log('Player joined:', data);
      addPlayer(data.userId);
    });

    socketService.on('player_left', (data: any) => {
      console.log('Player left:', data);
      removePlayer(data.userId);
    });

    // Game events
    socketService.on('game_started', (data: any) => {
      console.log('Game started:', data);
      setGame(data);
    });

    socketService.on('role_assigned', (data: any) => {
      console.log('Role assigned:', data);
      setMyRole(data.role);
    });

    socketService.on('phase_changed', (data: any) => {
      console.log('Phase changed:', data);
      if (data.audioUrl) {
        playAudio(data.audioUrl, data.text, data.phase);
      }
    });

    // Night events
    socketService.on('night_started', (data: any) => {
      console.log('Night started:', data);
      if (data.audioUrl) {
        playAudio(data.audioUrl, data.text, 'NIGHT_START');
      }
    });

    socketService.on('sheriff_result', (data: any) => {
      console.log('Sheriff result:', data);
      // Show result only to sheriff
    });

    socketService.on('don_result', (data: any) => {
      console.log('Don result:', data);
      // Show result only to don
    });

    // Morning events
    socketService.on('morning_announcement', (data: any) => {
      console.log('Morning announcement:', data);
      if (data.killedPlayer) {
        updatePlayer(data.killedPlayer.id, { isAlive: false });
      }
      if (data.audioUrl) {
        playAudio(data.audioUrl, data.text, 'MORNING');
      }
    });

    // Discussion events
    socketService.on('discussion_started', (data: any) => {
      console.log('Discussion started:', data);
      if (data.audioUrl) {
        playAudio(data.audioUrl, data.text, 'DISCUSSION');
      }
    });

    // Voting events
    socketService.on('voting_started', (data: any) => {
      console.log('Voting started:', data);
      if (data.audioUrl) {
        playAudio(data.audioUrl, data.text, 'VOTING');
      }
    });

    socketService.on('player_eliminated', (data: any) => {
      console.log('Player eliminated:', data);
      if (data.player) {
        updatePlayer(data.player.id, { isAlive: false });
      }
      if (data.audioUrl) {
        playAudio(data.audioUrl, data.text, 'ELIMINATION');
      }
    });

    socketService.on('no_elimination', (data: any) => {
      console.log('No elimination:', data);
    });

    // Game end events
    socketService.on('game_ended', (data: any) => {
      console.log('Game ended:', data);
      if (data.audioUrl) {
        playAudio(data.audioUrl, data.text, data.winner === 'CIVILIAN' ? 'WIN_CIVILIANS' : 'WIN_MAFIA');
      }
    });

    // Play audio events
    socketService.on('play_audio', (data: any) => {
      console.log('Play audio:', data);
      if (data.audioUrl) {
        playAudio(data.audioUrl, data.text, data.category);
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  // Join room when roomId and userId are available
  useEffect(() => {
    if (roomId && userId) {
      socketService.joinRoom(roomId, userId, 'Player');
    }
  }, [roomId, userId]);

  return {
    joinRoom: socketService.joinRoom.bind(socketService),
    leaveRoom: socketService.leaveRoom.bind(socketService),
    startGame: socketService.startGame.bind(socketService),
    startNight: socketService.startNight.bind(socketService),
    mafiaAction: socketService.mafiaAction.bind(socketService),
    sheriffAction: socketService.sheriffAction.bind(socketService),
    doctorAction: socketService.doctorAction.bind(socketService),
    donAction: socketService.donAction.bind(socketService),
    vote: socketService.vote.bind(socketService),
  };
}
