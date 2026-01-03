import { UsersService } from './users.service';
import { UpdateUserSettingsDto } from './dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getLeaderboard(limit?: number): Promise<any[]>;
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
