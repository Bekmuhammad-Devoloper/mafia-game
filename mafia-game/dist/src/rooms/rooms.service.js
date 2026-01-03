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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let RoomsService = class RoomsService {
    prisma;
    roomPlayers = new Map();
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateRoomCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    async create(createRoomDto) {
        let code = this.generateRoomCode();
        let existingRoom = await this.prisma.room.findUnique({ where: { code } });
        while (existingRoom) {
            code = this.generateRoomCode();
            existingRoom = await this.prisma.room.findUnique({ where: { code } });
        }
        const room = await this.prisma.room.create({
            data: {
                code,
                name: createRoomDto.name,
                hostId: createRoomDto.hostId,
                minPlayers: createRoomDto.minPlayers || 6,
                maxPlayers: createRoomDto.maxPlayers || 12,
                discussionTime: createRoomDto.discussionTime || 120,
                votingTime: createRoomDto.votingTime || 60,
                nightTime: createRoomDto.nightTime || 30,
                storyVariant: createRoomDto.storyVariant || 'CLASSIC',
            },
            include: {
                host: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
            },
        });
        this.roomPlayers.set(room.id, new Set([createRoomDto.hostId]));
        return room;
    }
    async findByCode(code) {
        const room = await this.prisma.room.findUnique({
            where: { code: code.toUpperCase() },
            include: {
                host: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
            },
        });
        if (!room) {
            throw new common_1.NotFoundException(`Xona topilmadi: ${code}`);
        }
        return room;
    }
    async findById(id) {
        const room = await this.prisma.room.findUnique({
            where: { id },
            include: {
                host: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
            },
        });
        if (!room) {
            throw new common_1.NotFoundException(`Xona topilmadi: ${id}`);
        }
        return room;
    }
    async findAvailableRooms() {
        const rooms = await this.prisma.room.findMany({
            where: {
                status: client_1.RoomStatus.WAITING,
            },
            include: {
                host: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
        return rooms.map(room => ({
            ...room,
            currentPlayers: this.getPlayersCount(room.id),
        }));
    }
    async findAvailable() {
        return this.findAvailableRooms();
    }
    async addPlayer(roomId, playerId) {
        const room = await this.findById(roomId);
        if (room.status !== client_1.RoomStatus.WAITING) {
            throw new common_1.BadRequestException('Bu xonaga qo\'shilish mumkin emas');
        }
        const currentPlayers = this.getPlayersCount(roomId);
        if (currentPlayers >= room.maxPlayers) {
            throw new common_1.BadRequestException('Xona to\'lgan');
        }
        if (!this.roomPlayers.has(roomId)) {
            this.roomPlayers.set(roomId, new Set());
        }
        this.roomPlayers.get(roomId).add(playerId);
        return { room, currentPlayers: this.getPlayersCount(roomId) };
    }
    async removePlayer(roomId, playerId) {
        const players = this.roomPlayers.get(roomId);
        if (players) {
            players.delete(playerId);
        }
        return { roomId, currentPlayers: this.getPlayersCount(roomId) };
    }
    async joinRoom(roomId, userId) {
        return this.addPlayer(roomId, userId);
    }
    async leaveRoom(roomId, userId) {
        return this.removePlayer(roomId, userId);
    }
    getPlayersCount(roomId) {
        return this.roomPlayers.get(roomId)?.size || 0;
    }
    getPlayerIds(roomId) {
        return Array.from(this.roomPlayers.get(roomId) || []);
    }
    async updateStatus(roomId, status) {
        return this.prisma.room.update({
            where: { id: roomId },
            data: { status },
        });
    }
    async update(roomId, updateDto) {
        return this.prisma.room.update({
            where: { id: roomId },
            data: updateDto,
            include: {
                host: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    }
    async delete(roomId) {
        this.roomPlayers.delete(roomId);
        return this.prisma.room.delete({ where: { id: roomId } });
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map