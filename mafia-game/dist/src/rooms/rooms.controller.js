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
exports.RoomsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rooms_service_1 = require("./rooms.service");
const dto_1 = require("./dto");
let RoomsController = class RoomsController {
    roomsService;
    constructor(roomsService) {
        this.roomsService = roomsService;
    }
    async create(createRoomDto) {
        return this.roomsService.create(createRoomDto);
    }
    async getAvailableRooms() {
        return this.roomsService.findAvailableRooms();
    }
    async findByCode(code) {
        const room = await this.roomsService.findByCode(code);
        return {
            ...room,
            currentPlayers: this.roomsService.getPlayersCount(room.id),
        };
    }
    async findById(id) {
        const room = await this.roomsService.findById(id);
        return {
            ...room,
            currentPlayers: this.roomsService.getPlayersCount(room.id),
        };
    }
    async joinRoom(id, body) {
        return this.roomsService.joinRoom(id, body.userId);
    }
    async leaveRoom(id, body) {
        return this.roomsService.leaveRoom(id, body.userId);
    }
    async update(id, updateRoomDto) {
        return this.roomsService.update(id, updateRoomDto);
    }
    async delete(id) {
        return this.roomsService.delete(id);
    }
};
exports.RoomsController = RoomsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Yangi xona yaratish' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Xona yaratildi' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateRoomDto]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('available'),
    (0, swagger_1.ApiOperation)({ summary: 'Ochiq xonalar ro\'yxati' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "getAvailableRooms", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    (0, swagger_1.ApiOperation)({ summary: 'Kod bo\'yicha xona topish' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'ID bo\'yicha xona topish' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(':id/join'),
    (0, swagger_1.ApiOperation)({ summary: 'Xonaga qo\'shilish' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "joinRoom", null);
__decorate([
    (0, common_1.Post)(':id/leave'),
    (0, swagger_1.ApiOperation)({ summary: 'Xonadan chiqish' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "leaveRoom", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Xona sozlamalarini yangilash' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateRoomDto]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Xonani o\'chirish' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "delete", null);
exports.RoomsController = RoomsController = __decorate([
    (0, swagger_1.ApiTags)('Rooms'),
    (0, common_1.Controller)('rooms'),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService])
], RoomsController);
//# sourceMappingURL=rooms.controller.js.map