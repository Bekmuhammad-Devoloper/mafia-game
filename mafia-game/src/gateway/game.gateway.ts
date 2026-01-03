import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GameService } from '../game/game.service';
import { AudioService } from '../audio/audio.service';
import { AudioCategory, VoiceType, GamePhase } from '@prisma/client';

interface JoinRoomPayload {
  roomId: string;
  oderId: string;
  userName: string;
}

interface GameActionPayload {
  gameId: string;
  playerId: string;
  targetId?: string;
}

interface VotePayload {
  gameId: string;
  fromPlayerId: string;
  toPlayerId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/game',
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('GameGateway');
  
  // Socket ID -> User mapping
  private socketUsers: Map<string, { oderId: string; roomId: string }> = new Map();
  
  // Room -> Sockets mapping
  private roomSockets: Map<string, Set<string>> = new Map();

  constructor(
    private gameService: GameService,
    private audioService: AudioService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    const userData = this.socketUsers.get(client.id);
    if (userData) {
      // Xonadan chiqarish
      const roomSockets = this.roomSockets.get(userData.roomId);
      if (roomSockets) {
        roomSockets.delete(client.id);
      }
      
      // Boshqa o'yinchilarga xabar berish
      this.server.to(userData.roomId).emit('player_left', {
        oderId: userData.oderId,
      });
      
      this.socketUsers.delete(client.id);
    }
  }

  // ============================================
  // XONA EVENTLARI
  // ============================================

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinRoomPayload,
  ) {
    const { roomId, oderId, userName } = payload;
    
    // Socket ni xonaga qo'shish
    client.join(roomId);
    
    // Mappinglarni yangilash
    this.socketUsers.set(client.id, { oderId, roomId });
    
    if (!this.roomSockets.has(roomId)) {
      this.roomSockets.set(roomId, new Set());
    }
    this.roomSockets.get(roomId)!.add(client.id);
    
    // Boshqa o'yinchilarga xabar berish
    this.server.to(roomId).emit('player_joined', {
      oderId,
      userName,
      playersCount: this.roomSockets.get(roomId)?.size || 0,
    });
    
    this.logger.log(`User ${oderId} joined room ${roomId}`);
    
    return { success: true, roomId };
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; oderId: string },
  ) {
    client.leave(payload.roomId);
    
    const roomSockets = this.roomSockets.get(payload.roomId);
    if (roomSockets) {
      roomSockets.delete(client.id);
    }
    
    this.socketUsers.delete(client.id);
    
    this.server.to(payload.roomId).emit('player_left', {
      oderId: payload.oderId,
      playersCount: roomSockets?.size || 0,
    });
    
    return { success: true };
  }

  // ============================================
  // O'YIN BOSHLANISHI
  // ============================================

  @SubscribeMessage('start_game')
  async handleStartGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string },
  ) {
    try {
      const game = await this.gameService.startGame(payload.roomId);
      
      // Barcha o'yinchilarga o'yin boshlandi xabarini yuborish
      this.server.to(payload.roomId).emit('game_started', {
        gameId: game.id,
        phase: game.phase,
        audioVariant: game.audioVariant,
      });
      
      // Audio yuborish
      const audio = await this.audioService.getOrGenerateAudio(
        AudioCategory.GAME_START,
        game.audioVariant,
        VoiceType.MALE_1,
      );
      
      this.server.to(payload.roomId).emit('play_audio', {
        category: 'GAME_START',
        audioUrl: audio.audioUrl,
        text: audio.text,
      });
      
      // Har bir o'yinchiga uning rolini maxfiy yuborish
      for (const player of game.players) {
        const playerSocket = this.findSocketByUserId(player.userId);
        if (playerSocket) {
          playerSocket.emit('role_assigned', {
            role: player.role,
            gameId: game.id,
          });
        }
      }
      
      return { success: true, gameId: game.id };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // ============================================
  // TUN FAZASI
  // ============================================

  @SubscribeMessage('start_night')
  async handleStartNight(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { gameId: string; roomId: string },
  ) {
    try {
      const game = await this.gameService.startNight(payload.gameId);
      
      // Audio yuborish
      const audio = await this.audioService.getOrGenerateAudio(
        AudioCategory.NIGHT_START,
        game.audioVariant,
        VoiceType.MALE_1,
      );
      
      this.server.to(payload.roomId).emit('night_started', {
        dayNumber: game.dayNumber,
        audioUrl: audio.audioUrl,
        text: audio.text,
      });
      
      // Mafia fazasini boshlash (5 soniyadan keyin)
      setTimeout(() => {
        this.startMafiaPhase(payload.gameId, payload.roomId, game.audioVariant);
      }, 5000);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private async startMafiaPhase(gameId: string, roomId: string, audioVariant: number) {
    await this.gameService.updatePhase(gameId, GamePhase.MAFIA_TURN);
    
    const audio = await this.audioService.getOrGenerateAudio(
      AudioCategory.MAFIA_WAKE,
      audioVariant,
      VoiceType.MALE_1,
    );
    
    this.server.to(roomId).emit('phase_changed', {
      phase: 'MAFIA_TURN',
      audioUrl: audio.audioUrl,
      text: audio.text,
    });
  }

  @SubscribeMessage('mafia_action')
  async handleMafiaAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: GameActionPayload,
  ) {
    try {
      const result = await this.gameService.mafiaAction(
        payload.gameId,
        payload.playerId,
        payload.targetId!,
      );
      
      return { ...result, success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  @SubscribeMessage('sheriff_action')
  async handleSheriffAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: GameActionPayload,
  ) {
    try {
      const result = await this.gameService.sheriffAction(
        payload.gameId,
        payload.playerId,
        payload.targetId!,
      );
      
      // Faqat sheriffga natijani yuborish
      client.emit('sheriff_result', result);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  @SubscribeMessage('doctor_action')
  async handleDoctorAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: GameActionPayload,
  ) {
    try {
      const result = await this.gameService.doctorAction(
        payload.gameId,
        payload.playerId,
        payload.targetId!,
      );
      
      return { ...result, success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  @SubscribeMessage('don_action')
  async handleDonAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: GameActionPayload,
  ) {
    try {
      const result = await this.gameService.donAction(
        payload.gameId,
        payload.playerId,
        payload.targetId!,
      );
      
      // Faqat donga natijani yuborish
      client.emit('don_result', result);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // ============================================
  // TUN TUGASHI / TONG
  // ============================================

  @SubscribeMessage('resolve_night')
  async handleResolveNight(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { gameId: string; roomId: string; audioVariant: number },
  ) {
    try {
      const result = await this.gameService.resolveNight(payload.gameId);
      
      // Audio tanlash
      const audioCategory = result.killedPlayer 
        ? AudioCategory.MORNING_DEATH 
        : AudioCategory.MORNING_NO_DEATH;
      
      const params: Record<string, string> | undefined = result.killedPlayer 
        ? { playerName: result.killedPlayer.user.firstName }
        : undefined;
      
      const audio = await this.audioService.getOrGenerateAudio(
        audioCategory,
        payload.audioVariant,
        VoiceType.MALE_1,
        params,
      );
      
      this.server.to(payload.roomId).emit('morning_announcement', {
        killedPlayer: result.killedPlayer,
        savedByDoctor: result.savedByDoctor,
        audioUrl: audio.audioUrl,
        text: audio.text,
      });
      
      // G'alaba tekshirish
      if (result.winner) {
        await this.handleGameEnd(payload.gameId, payload.roomId, result.winner, payload.audioVariant);
      }
      
      return { ...result, success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // ============================================
  // MUHOKAMA VA OVOZ BERISH
  // ============================================

  @SubscribeMessage('start_discussion')
  async handleStartDiscussion(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { gameId: string; roomId: string; audioVariant: number; time: number },
  ) {
    await this.gameService.updatePhase(payload.gameId, GamePhase.DISCUSSION);
    
    const audio = await this.audioService.getOrGenerateAudio(
      AudioCategory.DISCUSSION,
      payload.audioVariant,
      VoiceType.MALE_1,
      { time: String(payload.time / 60) },
    );
    
    this.server.to(payload.roomId).emit('discussion_started', {
      duration: payload.time,
      audioUrl: audio.audioUrl,
      text: audio.text,
    });
    
    return { success: true };
  }

  @SubscribeMessage('start_voting')
  async handleStartVoting(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { gameId: string; roomId: string; audioVariant: number },
  ) {
    await this.gameService.updatePhase(payload.gameId, GamePhase.VOTING);
    
    const audio = await this.audioService.getOrGenerateAudio(
      AudioCategory.VOTING,
      payload.audioVariant,
      VoiceType.MALE_1,
    );
    
    this.server.to(payload.roomId).emit('voting_started', {
      audioUrl: audio.audioUrl,
      text: audio.text,
    });
    
    return { success: true };
  }

  @SubscribeMessage('vote')
  async handleVote(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: VotePayload,
  ) {
    try {
      await this.gameService.vote(
        payload.gameId,
        payload.fromPlayerId,
        payload.toPlayerId,
      );
      
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  @SubscribeMessage('resolve_voting')
  async handleResolveVoting(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { gameId: string; roomId: string; audioVariant: number },
  ) {
    try {
      const result = await this.gameService.resolveVoting(payload.gameId);
      
      if (result.eliminatedPlayer) {
        const audio = await this.audioService.getOrGenerateAudio(
          AudioCategory.ELIMINATION,
          payload.audioVariant,
          VoiceType.MALE_1,
          { playerName: result.eliminatedPlayer?.user?.firstName || 'O\'yinchi' },
        );
        
        this.server.to(payload.roomId).emit('player_eliminated', {
          player: result.eliminatedPlayer,
          voteResults: result.voteResults,
          audioUrl: audio.audioUrl,
          text: audio.text,
        });
      } else {
        this.server.to(payload.roomId).emit('no_elimination', {
          voteResults: result.voteResults,
        });
      }
      
      // G'alaba tekshirish
      if (result.winner) {
        await this.handleGameEnd(payload.gameId, payload.roomId, result.winner, payload.audioVariant);
      }
      
      return { ...result, success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // ============================================
  // O'YIN TUGASHI
  // ============================================

  private async handleGameEnd(
    gameId: string, 
    roomId: string, 
    winner: string, 
    audioVariant: number
  ) {
    const audioCategory = winner === 'CIVILIAN' 
      ? AudioCategory.WIN_CIVILIANS 
      : AudioCategory.WIN_MAFIA;
    
    const audio = await this.audioService.getOrGenerateAudio(
      audioCategory,
      audioVariant,
      VoiceType.MALE_1,
    );
    
    const game = await this.gameService.getGameState(gameId);
    
    this.server.to(roomId).emit('game_ended', {
      winner,
      players: game.players,
      audioUrl: audio.audioUrl,
      text: audio.text,
    });
  }

  // ============================================
  // YORDAMCHI METODLAR
  // ============================================

  private findSocketByUserId(oderId: string): Socket | null {
    for (const [socketId, data] of this.socketUsers) {
      if (data.oderId === oderId) {
        return this.server.sockets.sockets.get(socketId) || null;
      }
    }
    return null;
  }

  /**
   * Xonaga audio yuborish
   */
  async broadcastAudio(roomId: string, audioUrl: string, text: string, category: string) {
    this.server.to(roomId).emit('play_audio', {
      category,
      audioUrl,
      text,
    });
  }

  /**
   * Timer yuborish
   */
  sendTimer(roomId: string, seconds: number, type: string) {
    this.server.to(roomId).emit('timer', {
      type,
      seconds,
    });
  }
}
