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
exports.GameStateDto = exports.VoteDto = exports.NightActionDto = exports.StartGameDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class StartGameDto {
    roomId;
}
exports.StartGameDto = StartGameDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Xona ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StartGameDto.prototype, "roomId", void 0);
class NightActionDto {
    gameId;
    playerId;
    targetId;
}
exports.NightActionDto = NightActionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'O\'yin ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NightActionDto.prototype, "gameId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Harakat qiluvchi o\'yinchi ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NightActionDto.prototype, "playerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nishon o\'yinchi ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NightActionDto.prototype, "targetId", void 0);
class VoteDto {
    gameId;
    fromPlayerId;
    toPlayerId;
}
exports.VoteDto = VoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'O\'yin ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoteDto.prototype, "gameId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ovoz beruvchi o\'yinchi ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoteDto.prototype, "fromPlayerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ovoz berilgan o\'yinchi ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoteDto.prototype, "toPlayerId", void 0);
class GameStateDto {
    gameId;
    phase;
    dayNumber;
    players;
    currentAudio;
    timer;
}
exports.GameStateDto = GameStateDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GameStateDto.prototype, "gameId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GameStateDto.prototype, "phase", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GameStateDto.prototype, "dayNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], GameStateDto.prototype, "players", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], GameStateDto.prototype, "currentAudio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], GameStateDto.prototype, "timer", void 0);
//# sourceMappingURL=index.js.map