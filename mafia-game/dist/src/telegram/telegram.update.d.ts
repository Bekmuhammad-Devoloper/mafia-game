import { Context } from 'telegraf';
import { TelegramService } from './telegram.service';
import { RoomsService } from '../rooms/rooms.service';
import { ConfigService } from '@nestjs/config';
export declare class TelegramUpdate {
    private telegramService;
    private roomsService;
    private configService;
    constructor(telegramService: TelegramService, roomsService: RoomsService, configService: ConfigService);
    onStart(ctx: Context): Promise<void>;
    onHelp(ctx: Context): Promise<void>;
    onPlay(ctx: Context): Promise<void>;
    onStats(ctx: Context): Promise<void>;
    onRules(ctx: Context): Promise<void>;
    onSettings(ctx: Context): Promise<void>;
    onNewRoom(ctx: Context): Promise<void>;
    onRooms(ctx: Context): Promise<void>;
    onStartGame(ctx: Context): Promise<void>;
    onJoin(ctx: Context): Promise<void>;
    onLeave(ctx: Context): Promise<void>;
    onWebAppData(ctx: Context): Promise<void>;
    onRoomAction(ctx: Context): Promise<void>;
}
