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
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const game_service_1 = require("./game.service");
const dto_1 = require("./dto");
let GameController = class GameController {
    gameService;
    constructor(gameService) {
        this.gameService = gameService;
    }
    async startGame(startGameDto) {
        return this.gameService.startGame(startGameDto.roomId);
    }
    async getGameState(id) {
        return this.gameService.getGameState(id);
    }
    async getPlayerRole(gameId, userId) {
        return this.gameService.getPlayerRole(gameId, userId);
    }
    async getMafiaMembers(gameId, userId) {
        return this.gameService.getMafiaMembers(gameId, userId);
    }
    async startNight(gameId) {
        return this.gameService.startNight(gameId);
    }
    async mafiaAction(dto) {
        return this.gameService.mafiaAction(dto.gameId, dto.playerId, dto.targetId);
    }
    async sheriffAction(dto) {
        return this.gameService.sheriffAction(dto.gameId, dto.playerId, dto.targetId);
    }
    async doctorAction(dto) {
        return this.gameService.doctorAction(dto.gameId, dto.playerId, dto.targetId);
    }
    async donAction(dto) {
        return this.gameService.donAction(dto.gameId, dto.playerId, dto.targetId);
    }
    async resolveNight(gameId) {
        return this.gameService.resolveNight(gameId);
    }
    async vote(dto) {
        return this.gameService.vote(dto.gameId, dto.fromPlayerId, dto.toPlayerId);
    }
    async resolveVoting(gameId) {
        return this.gameService.resolveVoting(gameId);
    }
    async updatePhase(gameId, phase) {
        return this.gameService.updatePhase(gameId, phase);
    }
};
exports.GameController = GameController;
__decorate([
    (0, common_1.Post)('start'),
    (0, swagger_1.ApiOperation)({ summary: 'O\'yinni boshlash' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'O\'yin boshlandi' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.StartGameDto]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "startGame", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'O\'yin holati' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getGameState", null);
__decorate([
    (0, common_1.Get)(':id/role/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'O\'yinchi rolini olish' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getPlayerRole", null);
__decorate([
    (0, common_1.Get)(':id/mafia/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Mafia a\'zolari (faqat mafia uchun)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getMafiaMembers", null);
__decorate([
    (0, common_1.Post)(':id/night/start'),
    (0, swagger_1.ApiOperation)({ summary: 'Tunni boshlash' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "startNight", null);
__decorate([
    (0, common_1.Post)(':id/action/mafia'),
    (0, swagger_1.ApiOperation)({ summary: 'Mafia harakati' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.NightActionDto]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "mafiaAction", null);
__decorate([
    (0, common_1.Post)(':id/action/sheriff'),
    (0, swagger_1.ApiOperation)({ summary: 'Sheriff tekshiruvi' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.NightActionDto]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "sheriffAction", null);
__decorate([
    (0, common_1.Post)(':id/action/doctor'),
    (0, swagger_1.ApiOperation)({ summary: 'Doktor davolashi' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.NightActionDto]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "doctorAction", null);
__decorate([
    (0, common_1.Post)(':id/action/don'),
    (0, swagger_1.ApiOperation)({ summary: 'Don tekshiruvi' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.NightActionDto]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "donAction", null);
__decorate([
    (0, common_1.Post)(':id/night/resolve'),
    (0, swagger_1.ApiOperation)({ summary: 'Tun natijalarini hisoblash' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "resolveNight", null);
__decorate([
    (0, common_1.Post)(':id/vote'),
    (0, swagger_1.ApiOperation)({ summary: 'Ovoz berish' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.VoteDto]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "vote", null);
__decorate([
    (0, common_1.Post)(':id/voting/resolve'),
    (0, swagger_1.ApiOperation)({ summary: 'Ovoz berish natijalarini hisoblash' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "resolveVoting", null);
__decorate([
    (0, common_1.Post)(':id/phase/:phase'),
    (0, swagger_1.ApiOperation)({ summary: 'Faza yangilash' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('phase')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "updatePhase", null);
exports.GameController = GameController = __decorate([
    (0, swagger_1.ApiTags)('Game'),
    (0, common_1.Controller)('game'),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameController);
//# sourceMappingURL=game.controller.js.map