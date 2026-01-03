import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from '../game/game.service';
import { AudioService } from '../audio/audio.service';
interface JoinRoomPayload {
    roomId: string;
    oderId: string;
    userName: string;
}
interface GameActionPayload {
    gameId: string;
    playerId: string;
    targetId?: string;
}
interface VotePayload {
    gameId: string;
    fromPlayerId: string;
    toPlayerId: string;
}
export declare class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private gameService;
    private audioService;
    server: Server;
    private logger;
    private socketUsers;
    private roomSockets;
    constructor(gameService: GameService, audioService: AudioService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, payload: JoinRoomPayload): {
        success: boolean;
        roomId: string;
    };
    handleLeaveRoom(client: Socket, payload: {
        roomId: string;
        oderId: string;
    }): {
        success: boolean;
    };
    handleStartGame(client: Socket, payload: {
        roomId: string;
    }): Promise<{
        success: boolean;
        gameId: string;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        gameId?: undefined;
    }>;
    handleStartNight(client: Socket, payload: {
        gameId: string;
        roomId: string;
    }): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
    }>;
    private startMafiaPhase;
    handleMafiaAction(client: Socket, payload: GameActionPayload): Promise<{
        success: boolean;
        targetId: string;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
    }>;
    handleSheriffAction(client: Socket, payload: GameActionPayload): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
    }>;
    handleDoctorAction(client: Socket, payload: GameActionPayload): Promise<{
        success: boolean;
        targetId: string;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
    }>;
    handleDonAction(client: Socket, payload: GameActionPayload): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
    }>;
    handleResolveNight(client: Socket, payload: {
        gameId: string;
        roomId: string;
        audioVariant: number;
    }): Promise<{
        success: boolean;
        killedPlayer: any;
        savedByDoctor: boolean;
        winner: import("@prisma/client").$Enums.TeamType | null;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
    }>;
    handleStartDiscussion(client: Socket, payload: {
        gameId: string;
        roomId: string;
        audioVariant: number;
        time: number;
    }): Promise<{
        success: boolean;
    }>;
    handleStartVoting(client: Socket, payload: {
        gameId: string;
        roomId: string;
        audioVariant: number;
    }): Promise<{
        success: boolean;
    }>;
    handleVote(client: Socket, payload: VotePayload): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
    }>;
    handleResolveVoting(client: Socket, payload: {
        gameId: string;
        roomId: string;
        audioVariant: number;
    }): Promise<{
        success: boolean;
        eliminatedPlayer: any;
        voteResults: {
            [k: string]: number;
        };
        winner: import("@prisma/client").$Enums.TeamType | null;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
    }>;
    private handleGameEnd;
    private findSocketByUserId;
    broadcastAudio(roomId: string, audioUrl: string, text: string, category: string): Promise<void>;
    sendTimer(roomId: string, seconds: number, type: string): void;
}
export {};
