import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

// TTS Provider interfeysi
export interface TtsProvider {
  generateAudio(text: string, voiceId: string): Promise<Buffer>;
}

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);
  private readonly audioPath: string;
  
  constructor(private configService: ConfigService) {
    this.audioPath = this.configService.get('AUDIO_STORAGE_PATH') || './storage/audio';
    this.ensureDirectory(this.audioPath);
  }

  /**
   * Papkani yaratish
   */
  private ensureDirectory(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Audio generatsiya qilish (ElevenLabs yoki boshqa TTS)
   */
  async generateAudio(
    text: string, 
    voiceType: 'MALE_1' | 'MALE_2' | 'FEMALE_1' | 'FEMALE_2' = 'MALE_1',
  ): Promise<string> {
    const fileName = `${Date.now()}_${voiceType}.mp3`;
    const filePath = path.join(this.audioPath, fileName);

    // ElevenLabs integration
    const apiKey = this.configService.get('ELEVENLABS_API_KEY');
    
    if (apiKey && apiKey !== 'your-elevenlabs-api-key') {
      try {
        const audioBuffer = await this.elevenLabsGenerate(text, voiceType, apiKey);
        fs.writeFileSync(filePath, audioBuffer);
        return fileName;
      } catch (error) {
        this.logger.error('ElevenLabs error:', error);
      }
    }

    // Google TTS fallback yoki mock
    this.logger.warn('Using mock TTS - no real audio generated');
    
    // Mock audio file yaratish (bo'sh mp3)
    // Real implementatsiyada Google TTS yoki boshqa service ishlatiladi
    fs.writeFileSync(filePath, Buffer.from(''));
    
    return fileName;
  }

  /**
   * ElevenLabs TTS
   */
  private async elevenLabsGenerate(
    text: string, 
    voiceType: string,
    apiKey: string,
  ): Promise<Buffer> {
    // Voice ID mapping
    const voiceIds: Record<string, string> = {
      'MALE_1': 'pNInz6obpgDQGcFmaJgB',   // Adam - deep voice
      'MALE_2': '21m00Tcm4TlvDq8ikWAM',   // Rachel - male
      'FEMALE_1': 'EXAVITQu4vr4xnSDxMaL', // Bella - female
      'FEMALE_2': 'MF3mGyEYCl7XYWbV9V6O', // Elli - female
    };

    const voiceId = voiceIds[voiceType] || voiceIds['MALE_1'];
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Google Cloud TTS (alternative)
   */
  async googleTtsGenerate(text: string, voiceType: string): Promise<Buffer> {
    // Google Cloud TTS implementation
    // Bu yerda Google Cloud Text-to-Speech API ishlatiladi
    throw new Error('Google TTS not implemented yet');
  }

  /**
   * Audio faylni o'qish
   */
  async getAudioFile(fileName: string): Promise<Buffer | null> {
    const filePath = path.join(this.audioPath, fileName);
    
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath);
    }
    
    return null;
  }

  /**
   * Audio faylni o'chirish
   */
  async deleteAudioFile(fileName: string): Promise<boolean> {
    const filePath = path.join(this.audioPath, fileName);
    
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
    } catch (error) {
      this.logger.error('Error deleting audio file:', error);
    }
    
    return false;
  }

  /**
   * Audio URL olish
   */
  getAudioUrl(fileName: string): string {
    const baseUrl = this.configService.get('CDN_BASE_URL') || 'http://localhost:3000/audio';
    return `${baseUrl}/${fileName}`;
  }
}
