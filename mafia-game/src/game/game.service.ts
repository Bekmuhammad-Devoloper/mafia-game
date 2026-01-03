import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoomsService } from '../rooms/rooms.service';
import { UsersService } from '../users/users.service';
import { 
  GamePhase, 
  PlayerRole, 
  TeamType, 
  RoomStatus,
  EliminationType,
  NightActionType,
  EventType,
} from '@prisma/client';

// Rol taqsimlash konfiguratsiyasi
const ROLE_CONFIG: Record<number, { mafia: number; don: number; sheriff: number; doctor: number }> = {
  6: { mafia: 1, don: 1, sheriff: 1, doctor: 1 },   // 6 kishi: 2 mafia, 1 sheriff, 1 doctor, 2 civilian
  7: { mafia: 2, don: 1, sheriff: 1, doctor: 1 },   // 7 kishi: 3 mafia, 1 sheriff, 1 doctor, 2 civilian
  8: { mafia: 2, don: 1, sheriff: 1, doctor: 1 },   // 8 kishi: 3 mafia, 1 sheriff, 1 doctor, 3 civilian
  9: { mafia: 2, don: 1, sheriff: 1, doctor: 1 },   // 9 kishi: 3 mafia, 1 sheriff, 1 doctor, 4 civilian
  10: { mafia: 3, don: 1, sheriff: 1, doctor: 1 },  // 10 kishi: 4 mafia, 1 sheriff, 1 doctor, 4 civilian
  11: { mafia: 3, don: 1, sheriff: 1, doctor: 1 },  // 11 kishi: 4 mafia, 1 sheriff, 1 doctor, 5 civilian
  12: { mafia: 3, don: 1, sheriff: 1, doctor: 1 },  // 12 kishi: 4 mafia, 1 sheriff, 1 doctor, 6 civilian
};

@Injectable()
export class GameService {
  // Active o'yinlar holati (memory)
  private gameStates: Map<string, {
    mafiaTarget?: string;
    doctorTarget?: string;
    sheriffTarget?: string;
    donTarget?: string;
    votes: Map<string, string>;
    timer?: NodeJS.Timeout;
    audioVariant: number;
  }> = new Map();

  constructor(
    private prisma: PrismaService,
    private roomsService: RoomsService,
    private usersService: UsersService,
  ) {}

  /**
   * Arrayni shuffle qilish (Fisher-Yates)
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Rollarni taqsimlash
   */
  private assignRoles(playerIds: string[]): Map<string, PlayerRole> {
    const count = playerIds.length;
    const config = ROLE_CONFIG[count] || ROLE_CONFIG[12];
    
    const roles: PlayerRole[] = [];
    
    // Don (mafia boshlig'i)
    roles.push(PlayerRole.DON);
    
    // Mafia a'zolari
    for (let i = 0; i < config.mafia; i++) {
      roles.push(PlayerRole.MAFIA);
    }
    
    // Sheriff (komissar)
    roles.push(PlayerRole.SHERIFF);
    
    // Doctor
    roles.push(PlayerRole.DOCTOR);
    
    // Qolganlar civilian
    while (roles.length < count) {
      roles.push(PlayerRole.CIVILIAN);
    }
    
    // Shuffle
    const shuffledRoles = this.shuffleArray(roles);
    const shuffledPlayers = this.shuffleArray(playerIds);
    
    const roleMap = new Map<string, PlayerRole>();
    shuffledPlayers.forEach((playerId, index) => {
      roleMap.set(playerId, shuffledRoles[index]);
    });
    
    return roleMap;
  }

  /**
   * O'yinni boshlash
   */
  async startGame(roomId: string) {
    const room = await this.roomsService.findById(roomId);
    const playerIds = this.roomsService.getPlayerIds(roomId);

    if (playerIds.length < room.minPlayers) {
      throw new BadRequestException(
        `Kam o'yinchi: ${playerIds.length}/${room.minPlayers} minimum kerak`
      );
    }

    // Xona holatini yangilash
    await this.roomsService.updateStatus(roomId, RoomStatus.IN_GAME);

    // Rollarni taqsimlash
    const roleAssignments = this.assignRoles(playerIds);
    const audioVariant = Math.floor(Math.random() * 5) + 1;

    // O'yin yaratish
    const game = await this.prisma.game.create({
      data: {
        roomId,
        phase: GamePhase.ROLE_ASSIGNMENT,
        audioVariant,
        players: {
          create: playerIds.map(userId => ({
            userId,
            role: roleAssignments.get(userId)!,
          })),
        },
      },
      include: {
        players: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
        room: true,
      },
    });

    // Game state ni initialize qilish
    this.gameStates.set(game.id, {
      votes: new Map(),
      audioVariant,
    });

    // Event yaratish
    await this.createEvent(game.id, EventType.GAME_STARTED, GamePhase.ROLE_ASSIGNMENT, 0);

    return game;
  }

  /**
   * O'yin holatini olish
   */
  async getGameState(gameId: string) {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        players: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
        room: true,
      },
    });

    if (!game) {
      throw new NotFoundException(`O'yin topilmadi: ${gameId}`);
    }

    const state = this.gameStates.get(gameId);

    return {
      ...game,
      voteCount: state?.votes.size || 0,
    };
  }

  /**
   * O'yin fazasini yangilash
   */
  async updatePhase(gameId: string, phase: GamePhase) {
    const game = await this.prisma.game.update({
      where: { id: gameId },
      data: { phase },
      include: {
        players: {
          include: {
            user: true,
          },
        },
        room: true,
      },
    });

    return game;
  }

  /**
   * Tunni boshlash
   */
  async startNight(gameId: string) {
    const game = await this.prisma.game.update({
      where: { id: gameId },
      data: { 
        phase: GamePhase.NIGHT,
        dayNumber: { increment: 1 },
      },
    });

    // State ni tozalash
    const state = this.gameStates.get(gameId);
    if (state) {
      state.mafiaTarget = undefined;
      state.doctorTarget = undefined;
      state.sheriffTarget = undefined;
      state.donTarget = undefined;
    }

    await this.createEvent(gameId, EventType.NIGHT_STARTED, GamePhase.NIGHT, game.dayNumber);

    return game;
  }

  /**
   * Mafia harakati
   */
  async mafiaAction(gameId: string, mafiaPlayerId: string, targetId: string) {
    const player = await this.getPlayer(gameId, mafiaPlayerId);
    
    if (player.role !== PlayerRole.MAFIA && player.role !== PlayerRole.DON) {
      throw new BadRequestException('Siz mafia emassiz');
    }

    const state = this.gameStates.get(gameId);
    if (state) {
      state.mafiaTarget = targetId;
    }

    await this.createNightAction(gameId, mafiaPlayerId, targetId, NightActionType.MAFIA_KILL);

    return { success: true, targetId };
  }

  /**
   * Sheriff tekshiruvi
   */
  async sheriffAction(gameId: string, sheriffPlayerId: string, targetId: string) {
    const player = await this.getPlayer(gameId, sheriffPlayerId);
    
    if (player.role !== PlayerRole.SHERIFF) {
      throw new BadRequestException('Siz sheriff emassiz');
    }

    const targetPlayer = await this.getPlayer(gameId, targetId);
    const isMafia = targetPlayer.role === PlayerRole.MAFIA || targetPlayer.role === PlayerRole.DON;

    const state = this.gameStates.get(gameId);
    if (state) {
      state.sheriffTarget = targetId;
    }

    await this.createNightAction(gameId, sheriffPlayerId, targetId, NightActionType.SHERIFF_CHECK, {
      isMafia,
    });

    return { 
      success: true, 
      targetId,
      result: isMafia ? 'MAFIA' : 'CIVILIAN',
    };
  }

  /**
   * Doktor davolashi
   */
  async doctorAction(gameId: string, doctorPlayerId: string, targetId: string) {
    const player = await this.getPlayer(gameId, doctorPlayerId);
    
    if (player.role !== PlayerRole.DOCTOR) {
      throw new BadRequestException('Siz doktor emassiz');
    }

    const state = this.gameStates.get(gameId);
    if (state) {
      state.doctorTarget = targetId;
    }

    // O'yinchini himoya qilish
    await this.prisma.gamePlayer.update({
      where: { id: targetId },
      data: { isProtected: true },
    });

    await this.createNightAction(gameId, doctorPlayerId, targetId, NightActionType.DOCTOR_HEAL);

    return { success: true, targetId };
  }

  /**
   * Don tekshiruvi (sheriffni topish)
   */
  async donAction(gameId: string, donPlayerId: string, targetId: string) {
    const player = await this.getPlayer(gameId, donPlayerId);
    
    if (player.role !== PlayerRole.DON) {
      throw new BadRequestException('Siz don emassiz');
    }

    const targetPlayer = await this.getPlayer(gameId, targetId);
    const isSheriff = targetPlayer.role === PlayerRole.SHERIFF;

    const state = this.gameStates.get(gameId);
    if (state) {
      state.donTarget = targetId;
    }

    await this.createNightAction(gameId, donPlayerId, targetId, NightActionType.DON_CHECK, {
      isSheriff,
    });

    return { 
      success: true, 
      targetId,
      result: isSheriff ? 'SHERIFF' : 'NOT_SHERIFF',
    };
  }

  /**
   * Tun natijalarini hisoblash
   */
  async resolveNight(gameId: string) {
    const state = this.gameStates.get(gameId);
    const game = await this.getGameState(gameId);
    
    let killedPlayer: any = null;
    let savedByDoctor = false;

    if (state?.mafiaTarget) {
      const target = game.players.find(p => p.id === state.mafiaTarget);
      
      if (target && target.isAlive) {
        // Doktor qutqardimi?
        if (state.doctorTarget === state.mafiaTarget) {
          savedByDoctor = true;
          await this.createEvent(gameId, EventType.PLAYER_SAVED, GamePhase.MORNING, game.dayNumber);
        } else {
          // O'yinchi o'ldi
          killedPlayer = await this.prisma.gamePlayer.update({
            where: { id: state.mafiaTarget },
            data: {
              isAlive: false,
              eliminatedAt: new Date(),
              eliminatedBy: EliminationType.MAFIA_KILL,
            },
            include: { user: true },
          });

          await this.createEvent(gameId, EventType.PLAYER_KILLED, GamePhase.MORNING, game.dayNumber, {
            playerId: killedPlayer.id,
            playerName: killedPlayer.user.firstName,
          });
        }
      }
    }

    // Himoyani olib tashlash
    await this.prisma.gamePlayer.updateMany({
      where: { gameId },
      data: { isProtected: false },
    });

    // Morning fazasiga o'tish
    await this.updatePhase(gameId, GamePhase.MORNING);

    // G'alaba tekshirish
    const winner = await this.checkWinner(gameId);

    return {
      killedPlayer,
      savedByDoctor,
      winner,
    };
  }

  /**
   * Ovoz berish
   */
  async vote(gameId: string, fromPlayerId: string, toPlayerId: string) {
    const game = await this.getGameState(gameId);
    
    if (game.phase !== GamePhase.VOTING) {
      throw new BadRequestException('Hozir ovoz berish vaqti emas');
    }

    const fromPlayer = game.players.find(p => p.id === fromPlayerId);
    if (!fromPlayer?.isAlive) {
      throw new BadRequestException('O\'lik o\'yinchi ovoz bera olmaydi');
    }

    const state = this.gameStates.get(gameId);
    if (state) {
      state.votes.set(fromPlayerId, toPlayerId);
    }

    // DB ga saqlash
    await this.prisma.vote.upsert({
      where: {
        gameId_fromPlayerId_dayNumber: {
          gameId,
          fromPlayerId,
          dayNumber: game.dayNumber,
        },
      },
      create: {
        gameId,
        fromPlayerId,
        toPlayerId,
        dayNumber: game.dayNumber,
      },
      update: {
        toPlayerId,
      },
    });

    return { success: true };
  }

  /**
   * Ovoz berish natijalarini hisoblash
   */
  async resolveVoting(gameId: string) {
    const game = await this.getGameState(gameId);
    const state = this.gameStates.get(gameId);
    
    if (!state) {
      throw new BadRequestException('O\'yin holati topilmadi');
    }

    // Ovozlarni hisoblash
    const voteCount = new Map<string, number>();
    
    for (const [_, targetId] of state.votes) {
      voteCount.set(targetId, (voteCount.get(targetId) || 0) + 1);
    }

    // Eng ko'p ovoz olgan
    let maxVotes = 0;
    let eliminatedPlayerId: string | null = null;

    for (const [playerId, count] of voteCount) {
      if (count > maxVotes) {
        maxVotes = count;
        eliminatedPlayerId = playerId;
      }
    }

    let eliminatedPlayer: any = null;

    if (eliminatedPlayerId && maxVotes > game.players.filter(p => p.isAlive).length / 2) {
      // O'yinchi eliminatsiya qilindi
      eliminatedPlayer = await this.prisma.gamePlayer.update({
        where: { id: eliminatedPlayerId },
        data: {
          isAlive: false,
          eliminatedAt: new Date(),
          eliminatedBy: EliminationType.VOTED_OUT,
        },
        include: { user: true },
      });

      await this.createEvent(gameId, EventType.PLAYER_ELIMINATED, GamePhase.VOTING, game.dayNumber, {
        playerId: eliminatedPlayer?.id,
        playerName: eliminatedPlayer?.user?.firstName,
        votes: maxVotes,
      });
    }

    // Ovozlarni tozalash
    state.votes.clear();

    // G'alaba tekshirish
    const winner = await this.checkWinner(gameId);

    return {
      eliminatedPlayer,
      voteResults: Object.fromEntries(voteCount),
      winner,
    };
  }

  /**
   * G'alaba tekshirish
   */
  async checkWinner(gameId: string): Promise<TeamType | null> {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: { players: true },
    });

    if (!game) return null;

    const alivePlayers = game.players.filter(p => p.isAlive);
    const aliveMafia = alivePlayers.filter(
      p => p.role === PlayerRole.MAFIA || p.role === PlayerRole.DON
    );
    const aliveCivilians = alivePlayers.filter(
      p => p.role !== PlayerRole.MAFIA && p.role !== PlayerRole.DON
    );

    // Mafia g'alabasi: mafia soni >= civilian soni
    if (aliveMafia.length >= aliveCivilians.length) {
      await this.endGame(gameId, TeamType.MAFIA);
      return TeamType.MAFIA;
    }

    // Civilian g'alabasi: barcha mafia o'ldi
    if (aliveMafia.length === 0) {
      await this.endGame(gameId, TeamType.CIVILIAN);
      return TeamType.CIVILIAN;
    }

    return null;
  }

  /**
   * O'yinni tugatish
   */
  async endGame(gameId: string, winner: TeamType) {
    const game = await this.prisma.game.update({
      where: { id: gameId },
      data: {
        phase: GamePhase.GAME_OVER,
        winner,
        endedAt: new Date(),
      },
      include: {
        players: { include: { user: true } },
        room: true,
      },
    });

    // Xona holatini yangilash
    await this.roomsService.updateStatus(game.roomId, RoomStatus.FINISHED);

    // Statistikani yangilash
    for (const player of game.players) {
      const isWinner = 
        (winner === TeamType.MAFIA && (player.role === PlayerRole.MAFIA || player.role === PlayerRole.DON)) ||
        (winner === TeamType.CIVILIAN && player.role !== PlayerRole.MAFIA && player.role !== PlayerRole.DON);

      await this.usersService.updateStats(player.userId, {
        gamesPlayed: 1,
        gamesWon: isWinner ? 1 : 0,
        gamesAsMafia: player.role === PlayerRole.MAFIA ? 1 : 0,
        gamesAsCivilian: player.role === PlayerRole.CIVILIAN ? 1 : 0,
        gamesAsDoctor: player.role === PlayerRole.DOCTOR ? 1 : 0,
        gamesAsSheriff: player.role === PlayerRole.SHERIFF ? 1 : 0,
        gamesAsDon: player.role === PlayerRole.DON ? 1 : 0,
        mafiaWins: winner === TeamType.MAFIA && (player.role === PlayerRole.MAFIA || player.role === PlayerRole.DON) ? 1 : 0,
        civilianWins: winner === TeamType.CIVILIAN && player.role !== PlayerRole.MAFIA && player.role !== PlayerRole.DON ? 1 : 0,
      });
    }

    await this.createEvent(gameId, EventType.GAME_ENDED, GamePhase.GAME_OVER, game.dayNumber, {
      winner,
    });

    // Cleanup
    this.gameStates.delete(gameId);

    return game;
  }

  /**
   * O'yinchi ma'lumotlarini olish
   */
  private async getPlayer(gameId: string, oderId: string) {
    const player = await this.prisma.gamePlayer.findFirst({
      where: { 
        gameId,
        OR: [
          { id: oderId },
          { userId: oderId },
        ],
      },
      include: { user: true },
    });

    if (!player) {
      throw new NotFoundException('O\'yinchi topilmadi');
    }

    return player;
  }

  /**
   * Event yaratish
   */
  private async createEvent(
    gameId: string,
    type: EventType,
    phase: GamePhase,
    dayNumber: number,
    data?: any,
  ) {
    return this.prisma.gameEvent.create({
      data: {
        gameId,
        type,
        phase,
        dayNumber,
        data,
      },
    });
  }

  /**
   * Tun harakati yaratish
   */
  private async createNightAction(
    gameId: string,
    fromPlayerId: string,
    toPlayerId: string,
    actionType: NightActionType,
    result?: any,
  ) {
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    
    return this.prisma.nightAction.create({
      data: {
        gameId,
        fromPlayerId,
        toPlayerId,
        actionType,
        nightNumber: game?.dayNumber || 1,
        result,
      },
    });
  }

  /**
   * O'yinchi rolini olish (faqat o'zini)
   */
  async getPlayerRole(gameId: string, oderId: string) {
    const player = await this.getPlayer(gameId, oderId);
    
    return {
      id: player.id,
      oderId: player.userId,
      role: player.role,
      isAlive: player.isAlive,
    };
  }

  /**
   * Mafia a'zolarini ko'rish (faqat mafia uchun)
   */
  async getMafiaMembers(gameId: string, oderId: string) {
    const player = await this.getPlayer(gameId, oderId);
    
    if (player.role !== PlayerRole.MAFIA && player.role !== PlayerRole.DON) {
      throw new BadRequestException('Siz mafia emassiz');
    }

    const mafiaPlayers = await this.prisma.gamePlayer.findMany({
      where: {
        gameId,
        role: { in: [PlayerRole.MAFIA, PlayerRole.DON] },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return mafiaPlayers;
  }
}
