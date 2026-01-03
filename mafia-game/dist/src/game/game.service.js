"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const rooms_service_1 = require("../rooms/rooms.service");
const users_service_1 = require("../users/users.service");
const client_1 = require("@prisma/client");
const ROLE_CONFIG = {
    6: { mafia: 1, don: 1, sheriff: 1, doctor: 1 },
    7: { mafia: 2, don: 1, sheriff: 1, doctor: 1 },
    8: { mafia: 2, don: 1, sheriff: 1, doctor: 1 },
    9: { mafia: 2, don: 1, sheriff: 1, doctor: 1 },
    10: { mafia: 3, don: 1, sheriff: 1, doctor: 1 },
    11: { mafia: 3, don: 1, sheriff: 1, doctor: 1 },
    12: { mafia: 3, don: 1, sheriff: 1, doctor: 1 },
};
let GameService = class GameService {
    prisma;
    roomsService;
    usersService;
    gameStates = new Map();
    constructor(prisma, roomsService, usersService) {
        this.prisma = prisma;
        this.roomsService = roomsService;
        this.usersService = usersService;
    }
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    assignRoles(playerIds) {
        const count = playerIds.length;
        const config = ROLE_CONFIG[count] || ROLE_CONFIG[12];
        const roles = [];
        roles.push(client_1.PlayerRole.DON);
        for (let i = 0; i < config.mafia; i++) {
            roles.push(client_1.PlayerRole.MAFIA);
        }
        roles.push(client_1.PlayerRole.SHERIFF);
        roles.push(client_1.PlayerRole.DOCTOR);
        while (roles.length < count) {
            roles.push(client_1.PlayerRole.CIVILIAN);
        }
        const shuffledRoles = this.shuffleArray(roles);
        const shuffledPlayers = this.shuffleArray(playerIds);
        const roleMap = new Map();
        shuffledPlayers.forEach((playerId, index) => {
            roleMap.set(playerId, shuffledRoles[index]);
        });
        return roleMap;
    }
    async startGame(roomId) {
        const room = await this.roomsService.findById(roomId);
        const playerIds = this.roomsService.getPlayerIds(roomId);
        if (playerIds.length < room.minPlayers) {
            throw new common_1.BadRequestException(`Kam o'yinchi: ${playerIds.length}/${room.minPlayers} minimum kerak`);
        }
        await this.roomsService.updateStatus(roomId, client_1.RoomStatus.IN_GAME);
        const roleAssignments = this.assignRoles(playerIds);
        const audioVariant = Math.floor(Math.random() * 5) + 1;
        const game = await this.prisma.game.create({
            data: {
                roomId,
                phase: client_1.GamePhase.ROLE_ASSIGNMENT,
                audioVariant,
                players: {
                    create: playerIds.map(userId => ({
                        userId,
                        role: roleAssignments.get(userId),
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
        this.gameStates.set(game.id, {
            votes: new Map(),
            audioVariant,
        });
        await this.createEvent(game.id, client_1.EventType.GAME_STARTED, client_1.GamePhase.ROLE_ASSIGNMENT, 0);
        return game;
    }
    async getGameState(gameId) {
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
            throw new common_1.NotFoundException(`O'yin topilmadi: ${gameId}`);
        }
        const state = this.gameStates.get(gameId);
        return {
            ...game,
            voteCount: state?.votes.size || 0,
        };
    }
    async updatePhase(gameId, phase) {
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
    async startNight(gameId) {
        const game = await this.prisma.game.update({
            where: { id: gameId },
            data: {
                phase: client_1.GamePhase.NIGHT,
                dayNumber: { increment: 1 },
            },
        });
        const state = this.gameStates.get(gameId);
        if (state) {
            state.mafiaTarget = undefined;
            state.doctorTarget = undefined;
            state.sheriffTarget = undefined;
            state.donTarget = undefined;
        }
        await this.createEvent(gameId, client_1.EventType.NIGHT_STARTED, client_1.GamePhase.NIGHT, game.dayNumber);
        return game;
    }
    async mafiaAction(gameId, mafiaPlayerId, targetId) {
        const player = await this.getPlayer(gameId, mafiaPlayerId);
        if (player.role !== client_1.PlayerRole.MAFIA && player.role !== client_1.PlayerRole.DON) {
            throw new common_1.BadRequestException('Siz mafia emassiz');
        }
        const state = this.gameStates.get(gameId);
        if (state) {
            state.mafiaTarget = targetId;
        }
        await this.createNightAction(gameId, mafiaPlayerId, targetId, client_1.NightActionType.MAFIA_KILL);
        return { success: true, targetId };
    }
    async sheriffAction(gameId, sheriffPlayerId, targetId) {
        const player = await this.getPlayer(gameId, sheriffPlayerId);
        if (player.role !== client_1.PlayerRole.SHERIFF) {
            throw new common_1.BadRequestException('Siz sheriff emassiz');
        }
        const targetPlayer = await this.getPlayer(gameId, targetId);
        const isMafia = targetPlayer.role === client_1.PlayerRole.MAFIA || targetPlayer.role === client_1.PlayerRole.DON;
        const state = this.gameStates.get(gameId);
        if (state) {
            state.sheriffTarget = targetId;
        }
        await this.createNightAction(gameId, sheriffPlayerId, targetId, client_1.NightActionType.SHERIFF_CHECK, {
            isMafia,
        });
        return {
            success: true,
            targetId,
            result: isMafia ? 'MAFIA' : 'CIVILIAN',
        };
    }
    async doctorAction(gameId, doctorPlayerId, targetId) {
        const player = await this.getPlayer(gameId, doctorPlayerId);
        if (player.role !== client_1.PlayerRole.DOCTOR) {
            throw new common_1.BadRequestException('Siz doktor emassiz');
        }
        const state = this.gameStates.get(gameId);
        if (state) {
            state.doctorTarget = targetId;
        }
        await this.prisma.gamePlayer.update({
            where: { id: targetId },
            data: { isProtected: true },
        });
        await this.createNightAction(gameId, doctorPlayerId, targetId, client_1.NightActionType.DOCTOR_HEAL);
        return { success: true, targetId };
    }
    async donAction(gameId, donPlayerId, targetId) {
        const player = await this.getPlayer(gameId, donPlayerId);
        if (player.role !== client_1.PlayerRole.DON) {
            throw new common_1.BadRequestException('Siz don emassiz');
        }
        const targetPlayer = await this.getPlayer(gameId, targetId);
        const isSheriff = targetPlayer.role === client_1.PlayerRole.SHERIFF;
        const state = this.gameStates.get(gameId);
        if (state) {
            state.donTarget = targetId;
        }
        await this.createNightAction(gameId, donPlayerId, targetId, client_1.NightActionType.DON_CHECK, {
            isSheriff,
        });
        return {
            success: true,
            targetId,
            result: isSheriff ? 'SHERIFF' : 'NOT_SHERIFF',
        };
    }
    async resolveNight(gameId) {
        const state = this.gameStates.get(gameId);
        const game = await this.getGameState(gameId);
        let killedPlayer = null;
        let savedByDoctor = false;
        if (state?.mafiaTarget) {
            const target = game.players.find(p => p.id === state.mafiaTarget);
            if (target && target.isAlive) {
                if (state.doctorTarget === state.mafiaTarget) {
                    savedByDoctor = true;
                    await this.createEvent(gameId, client_1.EventType.PLAYER_SAVED, client_1.GamePhase.MORNING, game.dayNumber);
                }
                else {
                    killedPlayer = await this.prisma.gamePlayer.update({
                        where: { id: state.mafiaTarget },
                        data: {
                            isAlive: false,
                            eliminatedAt: new Date(),
                            eliminatedBy: client_1.EliminationType.MAFIA_KILL,
                        },
                        include: { user: true },
                    });
                    await this.createEvent(gameId, client_1.EventType.PLAYER_KILLED, client_1.GamePhase.MORNING, game.dayNumber, {
                        playerId: killedPlayer.id,
                        playerName: killedPlayer.user.firstName,
                    });
                }
            }
        }
        await this.prisma.gamePlayer.updateMany({
            where: { gameId },
            data: { isProtected: false },
        });
        await this.updatePhase(gameId, client_1.GamePhase.MORNING);
        const winner = await this.checkWinner(gameId);
        return {
            killedPlayer,
            savedByDoctor,
            winner,
        };
    }
    async vote(gameId, fromPlayerId, toPlayerId) {
        const game = await this.getGameState(gameId);
        if (game.phase !== client_1.GamePhase.VOTING) {
            throw new common_1.BadRequestException('Hozir ovoz berish vaqti emas');
        }
        const fromPlayer = game.players.find(p => p.id === fromPlayerId);
        if (!fromPlayer?.isAlive) {
            throw new common_1.BadRequestException('O\'lik o\'yinchi ovoz bera olmaydi');
        }
        const state = this.gameStates.get(gameId);
        if (state) {
            state.votes.set(fromPlayerId, toPlayerId);
        }
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
    async resolveVoting(gameId) {
        const game = await this.getGameState(gameId);
        const state = this.gameStates.get(gameId);
        if (!state) {
            throw new common_1.BadRequestException('O\'yin holati topilmadi');
        }
        const voteCount = new Map();
        for (const [_, targetId] of state.votes) {
            voteCount.set(targetId, (voteCount.get(targetId) || 0) + 1);
        }
        let maxVotes = 0;
        let eliminatedPlayerId = null;
        for (const [playerId, count] of voteCount) {
            if (count > maxVotes) {
                maxVotes = count;
                eliminatedPlayerId = playerId;
            }
        }
        let eliminatedPlayer = null;
        if (eliminatedPlayerId && maxVotes > game.players.filter(p => p.isAlive).length / 2) {
            eliminatedPlayer = await this.prisma.gamePlayer.update({
                where: { id: eliminatedPlayerId },
                data: {
                    isAlive: false,
                    eliminatedAt: new Date(),
                    eliminatedBy: client_1.EliminationType.VOTED_OUT,
                },
                include: { user: true },
            });
            await this.createEvent(gameId, client_1.EventType.PLAYER_ELIMINATED, client_1.GamePhase.VOTING, game.dayNumber, {
                playerId: eliminatedPlayer?.id,
                playerName: eliminatedPlayer?.user?.firstName,
                votes: maxVotes,
            });
        }
        state.votes.clear();
        const winner = await this.checkWinner(gameId);
        return {
            eliminatedPlayer,
            voteResults: Object.fromEntries(voteCount),
            winner,
        };
    }
    async checkWinner(gameId) {
        const game = await this.prisma.game.findUnique({
            where: { id: gameId },
            include: { players: true },
        });
        if (!game)
            return null;
        const alivePlayers = game.players.filter(p => p.isAlive);
        const aliveMafia = alivePlayers.filter(p => p.role === client_1.PlayerRole.MAFIA || p.role === client_1.PlayerRole.DON);
        const aliveCivilians = alivePlayers.filter(p => p.role !== client_1.PlayerRole.MAFIA && p.role !== client_1.PlayerRole.DON);
        if (aliveMafia.length >= aliveCivilians.length) {
            await this.endGame(gameId, client_1.TeamType.MAFIA);
            return client_1.TeamType.MAFIA;
        }
        if (aliveMafia.length === 0) {
            await this.endGame(gameId, client_1.TeamType.CIVILIAN);
            return client_1.TeamType.CIVILIAN;
        }
        return null;
    }
    async endGame(gameId, winner) {
        const game = await this.prisma.game.update({
            where: { id: gameId },
            data: {
                phase: client_1.GamePhase.GAME_OVER,
                winner,
                endedAt: new Date(),
            },
            include: {
                players: { include: { user: true } },
                room: true,
            },
        });
        await this.roomsService.updateStatus(game.roomId, client_1.RoomStatus.FINISHED);
        for (const player of game.players) {
            const isWinner = (winner === client_1.TeamType.MAFIA && (player.role === client_1.PlayerRole.MAFIA || player.role === client_1.PlayerRole.DON)) ||
                (winner === client_1.TeamType.CIVILIAN && player.role !== client_1.PlayerRole.MAFIA && player.role !== client_1.PlayerRole.DON);
            await this.usersService.updateStats(player.userId, {
                gamesPlayed: 1,
                gamesWon: isWinner ? 1 : 0,
                gamesAsMafia: player.role === client_1.PlayerRole.MAFIA ? 1 : 0,
                gamesAsCivilian: player.role === client_1.PlayerRole.CIVILIAN ? 1 : 0,
                gamesAsDoctor: player.role === client_1.PlayerRole.DOCTOR ? 1 : 0,
                gamesAsSheriff: player.role === client_1.PlayerRole.SHERIFF ? 1 : 0,
                gamesAsDon: player.role === client_1.PlayerRole.DON ? 1 : 0,
                mafiaWins: winner === client_1.TeamType.MAFIA && (player.role === client_1.PlayerRole.MAFIA || player.role === client_1.PlayerRole.DON) ? 1 : 0,
                civilianWins: winner === client_1.TeamType.CIVILIAN && player.role !== client_1.PlayerRole.MAFIA && player.role !== client_1.PlayerRole.DON ? 1 : 0,
            });
        }
        await this.createEvent(gameId, client_1.EventType.GAME_ENDED, client_1.GamePhase.GAME_OVER, game.dayNumber, {
            winner,
        });
        this.gameStates.delete(gameId);
        return game;
    }
    async getPlayer(gameId, oderId) {
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
            throw new common_1.NotFoundException('O\'yinchi topilmadi');
        }
        return player;
    }
    async createEvent(gameId, type, phase, dayNumber, data) {
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
    async createNightAction(gameId, fromPlayerId, toPlayerId, actionType, result) {
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
    async getPlayerRole(gameId, oderId) {
        const player = await this.getPlayer(gameId, oderId);
        return {
            id: player.id,
            oderId: player.userId,
            role: player.role,
            isAlive: player.isAlive,
        };
    }
    async getMafiaMembers(gameId, oderId) {
        const player = await this.getPlayer(gameId, oderId);
        if (player.role !== client_1.PlayerRole.MAFIA && player.role !== client_1.PlayerRole.DON) {
            throw new common_1.BadRequestException('Siz mafia emassiz');
        }
        const mafiaPlayers = await this.prisma.gamePlayer.findMany({
            where: {
                gameId,
                role: { in: [client_1.PlayerRole.MAFIA, client_1.PlayerRole.DON] },
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
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        rooms_service_1.RoomsService,
        users_service_1.UsersService])
], GameService);
//# sourceMappingURL=game.service.js.map