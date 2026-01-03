import { GameService } from './game.service';
import { StartGameDto, NightActionDto, VoteDto } from './dto';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    startGame(startGameDto: StartGameDto): Promise<{
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
    getGameState(id: string): Promise<{
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
    getPlayerRole(gameId: string, userId: string): Promise<{
        id: string;
        oderId: string;
        role: import("@prisma/client").$Enums.PlayerRole;
        isAlive: boolean;
    }>;
    getMafiaMembers(gameId: string, userId: string): Promise<({
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
    mafiaAction(dto: NightActionDto): Promise<{
        success: boolean;
        targetId: string;
    }>;
    sheriffAction(dto: NightActionDto): Promise<{
        success: boolean;
        targetId: string;
        result: string;
    }>;
    doctorAction(dto: NightActionDto): Promise<{
        success: boolean;
        targetId: string;
    }>;
    donAction(dto: NightActionDto): Promise<{
        success: boolean;
        targetId: string;
        result: string;
    }>;
    resolveNight(gameId: string): Promise<{
        killedPlayer: any;
        savedByDoctor: boolean;
        winner: import("@prisma/client").$Enums.TeamType | null;
    }>;
    vote(dto: VoteDto): Promise<{
        success: boolean;
    }>;
    resolveVoting(gameId: string): Promise<{
        eliminatedPlayer: any;
        voteResults: {
            [k: string]: number;
        };
        winner: import("@prisma/client").$Enums.TeamType | null;
    }>;
    updatePhase(gameId: string, phase: string): Promise<{
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
}
