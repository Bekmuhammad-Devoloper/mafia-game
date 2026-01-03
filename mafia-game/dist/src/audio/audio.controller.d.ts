import type { Response } from 'express';
import { AudioService } from './audio.service';
import { TtsService } from './tts.service';
import { AudioCategory, VoiceType } from '@prisma/client';
export declare class AudioController {
    private readonly audioService;
    private readonly ttsService;
    constructor(audioService: AudioService, ttsService: TtsService);
    getAudio(category: AudioCategory, variant?: number, voiceType?: VoiceType): Promise<{
        audioUrl: string;
        text: string;
        duration: number | null;
    }>;
    getAudioPack(variant: number, voiceType?: VoiceType): Promise<Record<string, any>>;
    getAudioFile(fileName: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getAtmosphereSounds(category?: string): Promise<{
        id: string;
        name: string;
        category: import("@prisma/client").$Enums.AtmosphereCategory;
        duration: number;
        isActive: boolean;
        audioUrl: string;
        isLoop: boolean;
    }[]>;
    seedScripts(): Promise<{
        seeded: number;
    }>;
    generateAllAudios(voiceType: VoiceType): Promise<{
        generated: number;
        total: number;
    }>;
}
