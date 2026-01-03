import { ConfigService } from '@nestjs/config';
export interface TtsProvider {
    generateAudio(text: string, voiceId: string): Promise<Buffer>;
}
export declare class TtsService {
    private configService;
    private readonly logger;
    private readonly audioPath;
    constructor(configService: ConfigService);
    private ensureDirectory;
    generateAudio(text: string, voiceType?: 'MALE_1' | 'MALE_2' | 'FEMALE_1' | 'FEMALE_2'): Promise<string>;
    private elevenLabsGenerate;
    googleTtsGenerate(text: string, voiceType: string): Promise<Buffer>;
    getAudioFile(fileName: string): Promise<Buffer | null>;
    deleteAudioFile(fileName: string): Promise<boolean>;
    getAudioUrl(fileName: string): string;
}
