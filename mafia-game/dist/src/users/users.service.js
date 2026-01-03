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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOrCreateByTelegramId(telegramData) {
        const existingUser = await this.prisma.user.findUnique({
            where: { telegramId: BigInt(telegramData.telegramId) },
        });
        if (existingUser) {
            return this.prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    username: telegramData.username,
                    firstName: telegramData.firstName,
                    lastName: telegramData.lastName,
                    avatarUrl: telegramData.avatarUrl,
                },
            });
        }
        return this.prisma.user.create({
            data: {
                telegramId: BigInt(telegramData.telegramId),
                username: telegramData.username,
                firstName: telegramData.firstName,
                lastName: telegramData.lastName,
                avatarUrl: telegramData.avatarUrl,
            },
        });
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Foydalanuvchi topilmadi: ${id}`);
        }
        return user;
    }
    async findByTelegramId(telegramId) {
        return this.prisma.user.findUnique({
            where: { telegramId: BigInt(telegramId) },
        });
    }
    async updateSettings(userId, settings) {
        return this.prisma.user.update({
            where: { id: userId },
            data: settings,
        });
    }
    async updateStats(userId, stats) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                gamesPlayed: { increment: stats.gamesPlayed || 0 },
                gamesWon: { increment: stats.gamesWon || 0 },
                gamesAsMafia: { increment: stats.gamesAsMafia || 0 },
                gamesAsCivilian: { increment: stats.gamesAsCivilian || 0 },
                gamesAsDoctor: { increment: stats.gamesAsDoctor || 0 },
                gamesAsSheriff: { increment: stats.gamesAsSheriff || 0 },
                gamesAsDon: { increment: stats.gamesAsDon || 0 },
                mafiaWins: { increment: stats.mafiaWins || 0 },
                civilianWins: { increment: stats.civilianWins || 0 },
            },
        });
    }
    async getLeaderboard(limit = 20) {
        return this.prisma.user.findMany({
            orderBy: [
                { gamesWon: 'desc' },
                { gamesPlayed: 'desc' },
            ],
            take: limit,
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                gamesPlayed: true,
                gamesWon: true,
                mafiaWins: true,
                civilianWins: true,
            },
        });
    }
    async getUserStats(userId) {
        const user = await this.findById(userId);
        const winRate = user.gamesPlayed > 0
            ? ((user.gamesWon / user.gamesPlayed) * 100).toFixed(1)
            : '0';
        return {
            gamesPlayed: user.gamesPlayed,
            gamesWon: user.gamesWon,
            winRate: `${winRate}%`,
            roleStats: {
                mafia: user.gamesAsMafia,
                civilian: user.gamesAsCivilian,
                doctor: user.gamesAsDoctor,
                sheriff: user.gamesAsSheriff,
                don: user.gamesAsDon,
            },
            teamWins: {
                mafia: user.mafiaWins,
                civilian: user.civilianWins,
            },
        };
    }
    toJSON(user) {
        return {
            ...user,
            telegramId: user.telegramId.toString(),
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map