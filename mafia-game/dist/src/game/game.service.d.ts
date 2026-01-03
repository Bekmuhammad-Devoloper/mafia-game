import { PrismaService } from '../prisma/prisma.service';
import { RoomsService } from '../rooms/rooms.service';
import { UsersService } from '../users/users.service';
import { GamePhase, TeamType } from '@prisma/client';
export declare class GameService {
    private prisma;
    private roomsService;
    private usersService;
    private gameStates;
    constructor(prisma: PrismaService, roomsService: RoomsService, usersService: UsersService);
    private shuffleArray;
    private assignRoles;
    startGame(roomId: string): Promise<{
        room: {
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
        players: ({
            user: {
                username: string | null;
                firstName: string;
                lastName: string | null;
                avatarUrl: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            role: import("@prisma/client").$Enums.PlayerRole;
            isAlive: boolean;
            isProtected: boolean;
            eliminatedAt: Date | null;
            eliminatedBy: import("@prisma/client").$Enums.EliminationType | null;
            gameId: string;
        })[];
    } & {
        id: string;
        phase: import("@prisma/client").$Enums.GamePhase;
        dayNumber: number;
        audioVariant: number;
        winner: import("@prisma/client").$Enums.TeamType | null;
        startedAt: Date;
        endedAt: Date | null;
        roomId: string;
    }>;
    getGameState(gameId: string): Promise<{
        voteCount: number;
        room: {
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
        players: ({
            user: {
                username: string | null;
                firstName: string;
                lastName: string | null;
                avatarUrl: string | null;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            role: import("@prisma/client").$Enums.PlayerRole;
            isAlive: boolean;
            isProtected: boolean;
            eliminatedAt: Date | null;
            eliminatedBy: import("@prisma/client").$Enums.EliminationType | null;
            gameId: string;
        })[];
        id: string;
        phase: import("@prisma/client").$Enums.GamePhase;
        dayNumber: number;
        audioVariant: number;
        winner: import("@prisma/client").$Enums.TeamType | null;
        startedAt: Date;
        endedAt: Date | null;
        roomId: string;
    }>;
    updatePhase(gameId: string, phase: GamePhase): Promise<{
        room: {
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
        players: ({
            user: {
                telegramId: bigint;
                username: string | null;
                firstName: string;
                lastName: string | null;
                avatarUrl: string | null;
                voiceType: import("@prisma/client").$Enums.VoiceType;
                voiceSpeed: number;
                volume: number;
                subtitlesEnabled: boolean;
                autoPlayEnabled: boolean;
                atmosphereEnabled: boolean;
                id: string;
                gamesPlayed: number;
                gamesWon: number;
                gamesAsMafia: number;
                gamesAsCivilian: number;
                gamesAsDoctor: number;
                gamesAsSheriff: number;
                gamesAsDon: number;
                mafiaWins: number;
                civilianWins: number;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            role: import("@prisma/client").$Enums.PlayerRole;
            isAlive: boolean;
            isProtected: boolean;
            eliminatedAt: Date | null;
            eliminatedBy: import("@prisma/client").$Enums.EliminationType | null;
            gameId: string;
        })[];
    } & {
        id: string;
        phase: import("@prisma/client").$Enums.GamePhase;
        dayNumber: number;
        audioVariant: number;
        winner: import("@prisma/client").$Enums.TeamType | null;
        startedAt: Date;
        endedAt: Date | null;
        roomId: string;
    }>;
    startNight(gameId: string): Promise<{
        id: string;
        phase: import("@prisma/client").$Enums.GamePhase;
        dayNumber: number;
        audioVariant: number;
        winner: import("@prisma/client").$Enums.TeamType | null;
        startedAt: Date;
        endedAt: Date | null;
        roomId: string;
    }>;
    mafiaAction(gameId: string, mafiaPlayerId: string, targetId: string): Promise<{
        success: boolean;
        targetId: string;
    }>;
    sheriffAction(gameId: string, sheriffPlayerId: string, targetId: string): Promise<{
        success: boolean;
        targetId: string;
        result: string;
    }>;
    doctorAction(gameId: string, doctorPlayerId: string, targetId: string): Promise<{
        success: boolean;
        targetId: string;
    }>;
    donAction(gameId: string, donPlayerId: string, targetId: string): Promise<{
        success: boolean;
        targetId: string;
        result: string;
    }>;
    resolveNight(gameId: string): Promise<{
        killedPlayer: any;
        savedByDoctor: boolean;
        winner: import("@prisma/client").$Enums.TeamType | null;
    }>;
    vote(gameId: string, fromPlayerId: string, toPlayerId: string): Promise<{
        success: boolean;
    }>;
    resolveVoting(gameId: string): Promise<{
        eliminatedPlayer: any;
        voteResults: {
            [k: string]: number;
        };
        winner: import("@prisma/client").$Enums.TeamType | null;
    }>;
    checkWinner(gameId: string): Promise<TeamType | null>;
    endGame(gameId: string, winner: TeamType): Promise<{
        room: {
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
        players: ({
            user: {
                telegramId: bigint;
                username: string | null;
                firstName: string;
                lastName: string | null;
                avatarUrl: string | null;
                voiceType: import("@prisma/client").$Enums.VoiceType;
                voiceSpeed: number;
                volume: number;
                subtitlesEnabled: boolean;
                autoPlayEnabled: boolean;
                atmosphereEnabled: boolean;
                id: string;
                gamesPlayed: number;
                gamesWon: number;
                gamesAsMafia: number;
                gamesAsCivilian: number;
                gamesAsDoctor: number;
                gamesAsSheriff: number;
                gamesAsDon: number;
                mafiaWins: number;
                civilianWins: number;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            role: import("@prisma/client").$Enums.PlayerRole;
            isAlive: boolean;
            isProtected: boolean;
            eliminatedAt: Date | null;
            eliminatedBy: import("@prisma/client").$Enums.EliminationType | null;
            gameId: string;
        })[];
    } & {
        id: string;
        phase: import("@prisma/client").$Enums.GamePhase;
        dayNumber: number;
        audioVariant: number;
        winner: import("@prisma/client").$Enums.TeamType | null;
        startedAt: Date;
        endedAt: Date | null;
        roomId: string;
    }>;
    private getPlayer;
    private createEvent;
    private createNightAction;
    getPlayerRole(gameId: string, oderId: string): Promise<{
        id: string;
        oderId: string;
        role: import("@prisma/client").$Enums.PlayerRole;
        isAlive: boolean;
    }>;
    getMafiaMembers(gameId: string, oderId: string): Promise<({
        user: {
            username: string | null;
            firstName: string;
            lastName: string | null;
            avatarUrl: string | null;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        role: import("@prisma/client").$Enums.PlayerRole;
        isAlive: boolean;
        isProtected: boolean;
        eliminatedAt: Date | null;
        eliminatedBy: import("@prisma/client").$Enums.EliminationType | null;
        gameId: string;
    })[]>;
}
