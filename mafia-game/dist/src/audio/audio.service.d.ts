import { PrismaService } from '../prisma/prisma.service';
import { TtsService } from './tts.service';
import { AudioScriptsService } from './audio-scripts.service';
import { AudioCategory, VoiceType } from '@prisma/client';
export declare class AudioService {
    private prisma;
    private ttsService;
    private scriptsService;
    constructor(prisma: PrismaService, ttsService: TtsService, scriptsService: AudioScriptsService);
    getOrGenerateAudio(category: AudioCategory, variant: number, voiceType: VoiceType, params?: Record<string, string>): Promise<{
        audioUrl: string;
        text: string;
        duration: number | null;
    }>;
    getGameAudioPack(variant: number, voiceType: VoiceType): Promise<Record<string, any>>;
    seedScripts(): Promise<{
        seeded: number;
    }>;
    generateAllAudios(voiceType: VoiceType): Promise<{
        generated: number;
        total: number;
    }>;
    private getVoiceField;
    getAtmosphereSounds(category?: string): Promise<{
        id: string;
        name: string;
        category: import("@prisma/client").$Enums.AtmosphereCategory;
        duration: number;
        isActive: boolean;
        audioUrl: string;
        isLoop: boolean;
    }[]>;
}
