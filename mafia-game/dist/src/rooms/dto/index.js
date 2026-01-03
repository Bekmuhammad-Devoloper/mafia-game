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
exports.UpdateRoomDto = exports.JoinRoomDto = exports.CreateRoomDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateRoomDto {
    name;
    hostId;
    minPlayers;
    maxPlayers;
    discussionTime;
    votingTime;
    nightTime;
    storyVariant;
}
exports.CreateRoomDto = CreateRoomDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Xona nomi' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Xona egasi ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "hostId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 4, maximum: 6 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(4),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], CreateRoomDto.prototype, "minPlayers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 8, maximum: 16 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(8),
    (0, class_validator_1.Max)(16),
    __metadata("design:type", Number)
], CreateRoomDto.prototype, "maxPlayers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Muhokama vaqti (sekundlarda)', minimum: 60, maximum: 300 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(60),
    (0, class_validator_1.Max)(300),
    __metadata("design:type", Number)
], CreateRoomDto.prototype, "discussionTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ovoz berish vaqti (sekundlarda)', minimum: 30, maximum: 120 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(120),
    __metadata("design:type", Number)
], CreateRoomDto.prototype, "votingTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tun vaqti (sekundlarda)', minimum: 15, maximum: 60 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(15),
    (0, class_validator_1.Max)(60),
    __metadata("design:type", Number)
], CreateRoomDto.prototype, "nightTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.StoryVariant }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StoryVariant),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "storyVariant", void 0);
class JoinRoomDto {
    code;
    userId;
}
exports.JoinRoomDto = JoinRoomDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Xona kodi (6 ta belgi)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JoinRoomDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Foydalanuvchi ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JoinRoomDto.prototype, "userId", void 0);
class UpdateRoomDto {
    name;
    minPlayers;
    maxPlayers;
    discussionTime;
    votingTime;
    nightTime;
    storyVariant;
}
exports.UpdateRoomDto = UpdateRoomDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRoomDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(4),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], UpdateRoomDto.prototype, "minPlayers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(8),
    (0, class_validator_1.Max)(16),
    __metadata("design:type", Number)
], UpdateRoomDto.prototype, "maxPlayers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(60),
    (0, class_validator_1.Max)(300),
    __metadata("design:type", Number)
], UpdateRoomDto.prototype, "discussionTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(120),
    __metadata("design:type", Number)
], UpdateRoomDto.prototype, "votingTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(15),
    (0, class_validator_1.Max)(60),
    __metadata("design:type", Number)
], UpdateRoomDto.prototype, "nightTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.StoryVariant }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.StoryVariant),
    __metadata("design:type", String)
], UpdateRoomDto.prototype, "storyVariant", void 0);
//# sourceMappingURL=index.js.map