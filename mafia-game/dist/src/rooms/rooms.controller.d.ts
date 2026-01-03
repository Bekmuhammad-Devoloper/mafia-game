import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto } from './dto';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
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
    getAvailableRooms(): Promise<{
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
    findByCode(code: string): Promise<{
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
    }>;
    findById(id: string): Promise<{
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
    }>;
    joinRoom(id: string, body: {
        userId: string;
    }): Promise<{
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
    leaveRoom(id: string, body: {
        userId: string;
    }): Promise<{
        roomId: string;
        currentPlayers: number;
    }>;
    update(id: string, updateRoomDto: UpdateRoomDto): Promise<{
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
    delete(id: string): Promise<{
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
