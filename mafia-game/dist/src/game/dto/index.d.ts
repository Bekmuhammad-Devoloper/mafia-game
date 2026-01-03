export declare class StartGameDto {
    roomId: string;
}
export declare class NightActionDto {
    gameId: string;
    playerId: string;
    targetId: string;
}
export declare class VoteDto {
    gameId: string;
    fromPlayerId: string;
    toPlayerId: string;
}
export declare class GameStateDto {
    gameId: string;
    phase: string;
    dayNumber: number;
    players: any[];
    currentAudio?: string;
    timer?: number;
}
