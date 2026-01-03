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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const game_service_1 = require("../game/game.service");
const audio_service_1 = require("../audio/audio.service");
const client_1 = require("@prisma/client");
let GameGateway = class GameGateway {
    gameService;
    audioService;
    server;
    logger = new common_1.Logger('GameGateway');
    socketUsers = new Map();
    roomSockets = new Map();
    constructor(gameService, audioService) {
        this.gameService = gameService;
        this.audioService = audioService;
    }
    afterInit(server) {
        this.logger.log('WebSocket Gateway initialized');
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        const userData = this.socketUsers.get(client.id);
        if (userData) {
            const roomSockets = this.roomSockets.get(userData.roomId);
            if (roomSockets) {
                roomSockets.delete(client.id);
            }
            this.server.to(userData.roomId).emit('player_left', {
                oderId: userData.oderId,
            });
            this.socketUsers.delete(client.id);
        }
    }
    handleJoinRoom(client, payload) {
        const { roomId, oderId, userName } = payload;
        client.join(roomId);
        this.socketUsers.set(client.id, { oderId, roomId });
        if (!this.roomSockets.has(roomId)) {
            this.roomSockets.set(roomId, new Set());
        }
        this.roomSockets.get(roomId).add(client.id);
        this.server.to(roomId).emit('player_joined', {
            oderId,
            userName,
            playersCount: this.roomSockets.get(roomId)?.size || 0,
        });
        this.logger.log(`User ${oderId} joined room ${roomId}`);
        return { success: true, roomId };
    }
    handleLeaveRoom(client, payload) {
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
    async handleStartGame(client, payload) {
        try {
            const game = await this.gameService.startGame(payload.roomId);
            this.server.to(payload.roomId).emit('game_started', {
                gameId: game.id,
                phase: game.phase,
                audioVariant: game.audioVariant,
            });
            const audio = await this.audioService.getOrGenerateAudio(client_1.AudioCategory.GAME_START, game.audioVariant, client_1.VoiceType.MALE_1);
            this.server.to(payload.roomId).emit('play_audio', {
                category: 'GAME_START',
                audioUrl: audio.audioUrl,
                text: audio.text,
            });
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
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async handleStartNight(client, payload) {
        try {
            const game = await this.gameService.startNight(payload.gameId);
            const audio = await this.audioService.getOrGenerateAudio(client_1.AudioCategory.NIGHT_START, game.audioVariant, client_1.VoiceType.MALE_1);
            this.server.to(payload.roomId).emit('night_started', {
                dayNumber: game.dayNumber,
                audioUrl: audio.audioUrl,
                text: audio.text,
            });
            setTimeout(() => {
                this.startMafiaPhase(payload.gameId, payload.roomId, game.audioVariant);
            }, 5000);
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async startMafiaPhase(gameId, roomId, audioVariant) {
        await this.gameService.updatePhase(gameId, client_1.GamePhase.MAFIA_TURN);
        const audio = await this.audioService.getOrGenerateAudio(client_1.AudioCategory.MAFIA_WAKE, audioVariant, client_1.VoiceType.MALE_1);
        this.server.to(roomId).emit('phase_changed', {
            phase: 'MAFIA_TURN',
            audioUrl: audio.audioUrl,
            text: audio.text,
        });
    }
    async handleMafiaAction(client, payload) {
        try {
            const result = await this.gameService.mafiaAction(payload.gameId, payload.playerId, payload.targetId);
            return { ...result, success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async handleSheriffAction(client, payload) {
        try {
            const result = await this.gameService.sheriffAction(payload.gameId, payload.playerId, payload.targetId);
            client.emit('sheriff_result', result);
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async handleDoctorAction(client, payload) {
        try {
            const result = await this.gameService.doctorAction(payload.gameId, payload.playerId, payload.targetId);
            return { ...result, success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async handleDonAction(client, payload) {
        try {
            const result = await this.gameService.donAction(payload.gameId, payload.playerId, payload.targetId);
            client.emit('don_result', result);
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async handleResolveNight(client, payload) {
        try {
            const result = await this.gameService.resolveNight(payload.gameId);
            const audioCategory = result.killedPlayer
                ? client_1.AudioCategory.MORNING_DEATH
                : client_1.AudioCategory.MORNING_NO_DEATH;
            const params = result.killedPlayer
                ? { playerName: result.killedPlayer.user.firstName }
                : undefined;
            const audio = await this.audioService.getOrGenerateAudio(audioCategory, payload.audioVariant, client_1.VoiceType.MALE_1, params);
            this.server.to(payload.roomId).emit('morning_announcement', {
                killedPlayer: result.killedPlayer,
                savedByDoctor: result.savedByDoctor,
                audioUrl: audio.audioUrl,
                text: audio.text,
            });
            if (result.winner) {
                await this.handleGameEnd(payload.gameId, payload.roomId, result.winner, payload.audioVariant);
            }
            return { ...result, success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async handleStartDiscussion(client, payload) {
        await this.gameService.updatePhase(payload.gameId, client_1.GamePhase.DISCUSSION);
        const audio = await this.audioService.getOrGenerateAudio(client_1.AudioCategory.DISCUSSION, payload.audioVariant, client_1.VoiceType.MALE_1, { time: String(payload.time / 60) });
        this.server.to(payload.roomId).emit('discussion_started', {
            duration: payload.time,
            audioUrl: audio.audioUrl,
            text: audio.text,
        });
        return { success: true };
    }
    async handleStartVoting(client, payload) {
        await this.gameService.updatePhase(payload.gameId, client_1.GamePhase.VOTING);
        const audio = await this.audioService.getOrGenerateAudio(client_1.AudioCategory.VOTING, payload.audioVariant, client_1.VoiceType.MALE_1);
        this.server.to(payload.roomId).emit('voting_started', {
            audioUrl: audio.audioUrl,
            text: audio.text,
        });
        return { success: true };
    }
    async handleVote(client, payload) {
        try {
            await this.gameService.vote(payload.gameId, payload.fromPlayerId, payload.toPlayerId);
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async handleResolveVoting(client, payload) {
        try {
            const result = await this.gameService.resolveVoting(payload.gameId);
            if (result.eliminatedPlayer) {
                const audio = await this.audioService.getOrGenerateAudio(client_1.AudioCategory.ELIMINATION, payload.audioVariant, client_1.VoiceType.MALE_1, { playerName: result.eliminatedPlayer?.user?.firstName || 'O\'yinchi' });
                this.server.to(payload.roomId).emit('player_eliminated', {
                    player: result.eliminatedPlayer,
                    voteResults: result.voteResults,
                    audioUrl: audio.audioUrl,
                    text: audio.text,
                });
            }
            else {
                this.server.to(payload.roomId).emit('no_elimination', {
                    voteResults: result.voteResults,
                });
            }
            if (result.winner) {
                await this.handleGameEnd(payload.gameId, payload.roomId, result.winner, payload.audioVariant);
            }
            return { ...result, success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async handleGameEnd(gameId, roomId, winner, audioVariant) {
        const audioCategory = winner === 'CIVILIAN'
            ? client_1.AudioCategory.WIN_CIVILIANS
            : client_1.AudioCategory.WIN_MAFIA;
        const audio = await this.audioService.getOrGenerateAudio(audioCategory, audioVariant, client_1.VoiceType.MALE_1);
        const game = await this.gameService.getGameState(gameId);
        this.server.to(roomId).emit('game_ended', {
            winner,
            players: game.players,
            audioUrl: audio.audioUrl,
            text: audio.text,
        });
    }
    findSocketByUserId(oderId) {
        for (const [socketId, data] of this.socketUsers) {
            if (data.oderId === oderId) {
                return this.server.sockets.sockets.get(socketId) || null;
            }
        }
        return null;
    }
    async broadcastAudio(roomId, audioUrl, text, category) {
        this.server.to(roomId).emit('play_audio', {
            category,
            audioUrl,
            text,
        });
    }
    sendTimer(roomId, seconds, type) {
        this.server.to(roomId).emit('timer', {
            type,
            seconds,
        });
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('start_game'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleStartGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('start_night'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleStartNight", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mafia_action'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleMafiaAction", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sheriff_action'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleSheriffAction", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('doctor_action'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleDoctorAction", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('don_action'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleDonAction", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('resolve_night'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleResolveNight", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('start_discussion'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleStartDiscussion", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('start_voting'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleStartVoting", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('vote'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleVote", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('resolve_voting'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleResolveVoting", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: '/game',
    }),
    __metadata("design:paramtypes", [game_service_1.GameService,
        audio_service_1.AudioService])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map