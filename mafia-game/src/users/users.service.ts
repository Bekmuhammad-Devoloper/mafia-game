import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UpdateUserSettingsDto } from './dto';
import { VoiceType } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Telegram ID orqali foydalanuvchi topish yoki yaratish
   */
  async findOrCreateByTelegramId(telegramData: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { telegramId: BigInt(telegramData.telegramId) },
    });

    if (existingUser) {
      // Mavjud foydalanuvchini yangilash
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

    // Yangi foydalanuvchi yaratish
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

  /**
   * ID bo'yicha foydalanuvchi topish
   */
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Foydalanuvchi topilmadi: ${id}`);
    }

    return user;
  }

  /**
   * Telegram ID bo'yicha foydalanuvchi topish
   */
  async findByTelegramId(telegramId: string | number) {
    return this.prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) },
    });
  }

  /**
   * Foydalanuvchi sozlamalarini yangilash
   */
  async updateSettings(userId: string, settings: UpdateUserSettingsDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: settings,
    });
  }

  /**
   * Foydalanuvchi statistikasini yangilash
   */
  async updateStats(
    userId: string,
    stats: {
      gamesPlayed?: number;
      gamesWon?: number;
      gamesAsMafia?: number;
      gamesAsCivilian?: number;
      gamesAsDoctor?: number;
      gamesAsSheriff?: number;
      gamesAsDon?: number;
      mafiaWins?: number;
      civilianWins?: number;
    },
  ) {
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

  /**
   * Liderlar jadvali
   */
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

  /**
   * Foydalanuvchi statistikasi
   */
  async getUserStats(userId: string) {
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

  /**
   * Foydalanuvchi JSON formatda
   */
  toJSON(user: any) {
    return {
      ...user,
      telegramId: user.telegramId.toString(),
    };
  }
}
