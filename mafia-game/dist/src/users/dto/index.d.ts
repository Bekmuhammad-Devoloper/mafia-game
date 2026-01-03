import { VoiceType } from '@prisma/client';
export declare class CreateUserDto {
    telegramId: string;
    username?: string;
    firstName: string;
    lastName?: string;
    avatarUrl?: string;
}
export declare class UpdateUserDto {
    username?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
}
export declare class UpdateUserSettingsDto {
    voiceType?: VoiceType;
    voiceSpeed?: number;
    volume?: number;
    subtitlesEnabled?: boolean;
    autoPlayEnabled?: boolean;
    atmosphereEnabled?: boolean;
}
