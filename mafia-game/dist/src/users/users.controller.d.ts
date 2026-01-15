import { UsersService } from './users.service';
import { UpdateUserSettingsDto } from './dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getLeaderboard(limit?: number, period?: string): Promise<{
        rank: number;
        winRate: number;
        username: string | null;
        firstName: string;
        lastName: string | null;
        avatarUrl: string | null;
        id: string;
        gamesPlayed: number;
        gamesWon: number;
        mafiaWins: number;
        civilianWins: number;
    }[]>;
    getUser(id: string): Promise<any>;
    getUserStats(id: string): Promise<{
        gamesPlayed: number;
        gamesWon: number;
        winRate: string;
        roleStats: {
            mafia: number;
            civilian: number;
            doctor: number;
            sheriff: number;
            don: number;
        };
        teamWins: {
            mafia: number;
            civilian: number;
        };
    }>;
    updateSettings(id: string, settings: UpdateUserSettingsDto): Promise<any>;
}
