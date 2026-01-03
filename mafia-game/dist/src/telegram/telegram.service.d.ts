import { Telegraf, Context } from 'telegraf';
import { UsersService } from '../users/users.service';
export declare class TelegramService {
    private bot;
    private usersService;
    private readonly logger;
    constructor(bot: Telegraf<Context>, usersService: UsersService);
    sendWebAppButton(chatId: number, text: string, webAppUrl: string): Promise<void>;
    sendMessage(chatId: number, text: string): Promise<void>;
    sendMessageWithButtons(chatId: number, text: string, buttons: {
        text: string;
        callback_data: string;
    }[][]): Promise<void>;
    sendRoleNotification(chatId: number, role: string, gameId: string): Promise<void>;
    sendGameResult(chatId: number, winner: 'MAFIA' | 'CIVILIAN', userRole: string, isWinner: boolean): Promise<void>;
    getOrCreateUser(telegramUser: {
        id: number;
        username?: string;
        first_name: string;
        last_name?: string;
    }): Promise<{
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
    }>;
}
