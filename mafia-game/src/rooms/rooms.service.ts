import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './dto';
import { RoomStatus } from '@prisma/client';

@Injectable()
export class RoomsService {
  // Xonalardagi o'yinchilar (memory - real-time)
  private roomPlayers: Map<string, Set<string>> = new Map();

  constructor(private prisma: PrismaService) {}

  /**
   * 6 ta belgili tasodifiy kod yaratish
   */
  private generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Yangi xona yaratish
   */
  async create(createRoomDto: CreateRoomDto) {
    // Unique kod yaratish
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

    // O'yinchilar ro'yxatini boshlash
    this.roomPlayers.set(room.id, new Set([createRoomDto.hostId]));

    return room;
  }

  /**
   * Kod bo'yicha xona topish
   */
  async findByCode(code: string) {
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
      throw new NotFoundException(`Xona topilmadi: ${code}`);
    }

    return room;
  }

  /**
   * ID bo'yicha xona topish
   */
  async findById(id: string) {
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
      throw new NotFoundException(`Xona topilmadi: ${id}`);
    }

    return room;
  }

  /**
   * Ochiq xonalar ro'yxati
   */
  async findAvailableRooms() {
    const rooms = await this.prisma.room.findMany({
      where: {
        status: RoomStatus.WAITING,
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

  /**
   * Ochiq xonalar ro'yxati (alias)
   */
  async findAvailable() {
    return this.findAvailableRooms();
  }

  /**
   * O'yinchini xonaga qo'shish
   */
  async addPlayer(roomId: string, playerId: string) {
    const room = await this.findById(roomId);

    if (room.status !== RoomStatus.WAITING) {
      throw new BadRequestException('Bu xonaga qo\'shilish mumkin emas');
    }

    const currentPlayers = this.getPlayersCount(roomId);
    if (currentPlayers >= room.maxPlayers) {
      throw new BadRequestException('Xona to\'lgan');
    }

    if (!this.roomPlayers.has(roomId)) {
      this.roomPlayers.set(roomId, new Set());
    }
    this.roomPlayers.get(roomId)!.add(playerId);

    return { room, currentPlayers: this.getPlayersCount(roomId) };
  }

  /**
   * O'yinchini xonadan chiqarish
   */
  async removePlayer(roomId: string, playerId: string) {
    const players = this.roomPlayers.get(roomId);
    if (players) {
      players.delete(playerId);
    }
    return { roomId, currentPlayers: this.getPlayersCount(roomId) };
  }

  /**
   * Xonaga qo'shilish
   */
  async joinRoom(roomId: string, userId: string) {
    return this.addPlayer(roomId, userId);
  }

  /**
   * Xonadan chiqish (alias)
   */
  async leaveRoom(roomId: string, userId: string) {
    return this.removePlayer(roomId, userId);
  }

  /**
   * Xonadagi o'yinchilar soni
   */
  getPlayersCount(roomId: string): number {
    return this.roomPlayers.get(roomId)?.size || 0;
  }

  /**
   * Xonadagi o'yinchilar ID lari
   */
  getPlayerIds(roomId: string): string[] {
    return Array.from(this.roomPlayers.get(roomId) || []);
  }

  /**
   * Xona holatini yangilash
   */
  async updateStatus(roomId: string, status: RoomStatus) {
    return this.prisma.room.update({
      where: { id: roomId },
      data: { status },
    });
  }

  /**
   * Xona sozlamalarini yangilash
   */
  async update(roomId: string, updateDto: UpdateRoomDto) {
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

  /**
   * Xonani o'chirish
   */
  async delete(roomId: string) {
    this.roomPlayers.delete(roomId);
    return this.prisma.room.delete({ where: { id: roomId } });
  }
}
