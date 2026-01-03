import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './dto';
import { RoomStatus } from '@prisma/client';
export declare class RoomsService {
    private prisma;
    private roomPlayers;
    constructor(prisma: PrismaService);
    private generateRoomCode;
    create(createRoomDto: CreateRoomDto): Promise<{
        host: {
            username: string | null;
            firstName: string;
            lastName: string | null;
            avatarUrl: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        hostId: string;
        minPlayers: number;
        maxPlayers: number;
        discussionTime: number;
        votingTime: number;
        nightTime: number;
        storyVariant: import("@prisma/client").$Enums.StoryVariant;
        code: string;
        status: import("@prisma/client").$Enums.RoomStatus;
    }>;
    findByCode(code: string): Promise<{
        host: {
            username: string | null;
            firstName: string;
            lastName: string | null;
            avatarUrl: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        hostId: string;
        minPlayers: number;
        maxPlayers: number;
        discussionTime: number;
        votingTime: number;
        nightTime: number;
        storyVariant: import("@prisma/client").$Enums.StoryVariant;
        code: string;
        status: import("@prisma/client").$Enums.RoomStatus;
    }>;
    findById(id: string): Promise<{
        host: {
            username: string | null;
            firstName: string;
            lastName: string | null;
            avatarUrl: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        hostId: string;
        minPlayers: number;
        maxPlayers: number;
        discussionTime: number;
        votingTime: number;
        nightTime: number;
        storyVariant: import("@prisma/client").$Enums.StoryVariant;
        code: string;
        status: import("@prisma/client").$Enums.RoomStatus;
    }>;
    findAvailableRooms(): Promise<{
        currentPlayers: number;
        host: {
            username: string | null;
            firstName: string;
            lastName: string | null;
            avatarUrl: string | null;
            id: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        hostId: string;
        minPlayers: number;
        maxPlayers: number;
        discussionTime: number;
        votingTime: number;
        nightTime: number;
        storyVariant: import("@prisma/client").$Enums.StoryVariant;
        code: string;
        status: import("@prisma/client").$Enums.RoomStatus;
    }[]>;
    findAvailable(): Promise<{
        currentPlayers: number;
        host: {
            username: string | null;
            firstName: string;
            lastName: string | null;
            avatarUrl: string | null;
            id: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        hostId: string;
        minPlayers: number;
        maxPlayers: number;
        discussionTime: number;
        votingTime: number;
        nightTime: number;
        storyVariant: import("@prisma/client").$Enums.StoryVariant;
        code: string;
        status: import("@prisma/client").$Enums.RoomStatus;
    }[]>;
    addPlayer(roomId: string, playerId: string): Promise<{
        room: {
            host: {
                username: string | null;
                firstName: string;
                lastName: string | null;
                avatarUrl: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            hostId: string;
            minPlayers: number;
            maxPlayers: number;
            discussionTime: number;
            votingTime: number;
            nightTime: number;
            storyVariant: import("@prisma/client").$Enums.StoryVariant;
            code: string;
            status: import("@prisma/client").$Enums.RoomStatus;
        };
        currentPlayers: number;
    }>;
    removePlayer(roomId: string, playerId: string): Promise<{
        roomId: string;
        currentPlayers: number;
    }>;
    joinRoom(roomId: string, userId: string): Promise<{
        room: {
            host: {
                username: string | null;
                firstName: string;
                lastName: string | null;
                avatarUrl: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            hostId: string;
            minPlayers: number;
            maxPlayers: number;
            discussionTime: number;
            votingTime: number;
            nightTime: number;
            storyVariant: import("@prisma/client").$Enums.StoryVariant;
            code: string;
            status: import("@prisma/client").$Enums.RoomStatus;
        };
        currentPlayers: number;
    }>;
    leaveRoom(roomId: string, userId: string): Promise<{
        roomId: string;
        currentPlayers: number;
    }>;
    getPlayersCount(roomId: string): number;
    getPlayerIds(roomId: string): string[];
    updateStatus(roomId: string, status: RoomStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        hostId: string;
        minPlayers: number;
        maxPlayers: number;
        discussionTime: number;
        votingTime: number;
        nightTime: number;
        storyVariant: import("@prisma/client").$Enums.StoryVariant;
        code: string;
        status: import("@prisma/client").$Enums.RoomStatus;
    }>;
    update(roomId: string, updateDto: UpdateRoomDto): Promise<{
        host: {
            username: string | null;
            firstName: string;
            lastName: string | null;
            avatarUrl: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        hostId: string;
        minPlayers: number;
        maxPlayers: number;
        discussionTime: number;
        votingTime: number;
        nightTime: number;
        storyVariant: import("@prisma/client").$Enums.StoryVariant;
        code: string;
        status: import("@prisma/client").$Enums.RoomStatus;
    }>;
    delete(roomId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        hostId: string;
        minPlayers: number;
        maxPlayers: number;
        discussionTime: number;
        votingTime: number;
        nightTime: number;
        storyVariant: import("@prisma/client").$Enums.StoryVariant;
        code: string;
        status: import("@prisma/client").$Enums.RoomStatus;
    }>;
}
