import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TtsService } from './tts.service';
import { AudioScriptsService, AudioScript } from './audio-scripts.service';
import { AudioCategory, VoiceType } from '@prisma/client';

@Injectable()
export class AudioService {
  constructor(
    private prisma: PrismaService,
    private ttsService: TtsService,
    private scriptsService: AudioScriptsService,
  ) {}

  /**
   * Kategoriya bo'yicha audio olish yoki generatsiya qilish
   */
  async getOrGenerateAudio(
    category: AudioCategory,
    variant: number,
    voiceType: VoiceType,
    params?: Record<string, string>,
  ) {
    // Mavjud audio bormi tekshirish
    const existingAudio = await this.prisma.audioScript.findUnique({
      where: {
        category_variant: { category, variant },
      },
    });

    const voiceField = this.getVoiceField(voiceType);
    
    if (existingAudio && existingAudio[voiceField]) {
      return {
        audioUrl: this.ttsService.getAudioUrl(existingAudio[voiceField]),
        text: params 
          ? this.scriptsService.fillTemplate(existingAudio.textUz, params)
          : existingAudio.textUz,
        duration: existingAudio.duration,
      };
    }

    // Skript olish
    const script = this.scriptsService.getScript(category, variant);
    if (!script) {
      throw new NotFoundException(`Script topilmadi: ${category} - ${variant}`);
    }

    // Audio generatsiya qilish
    const text = params 
      ? this.scriptsService.fillTemplate(script.textUz, params)
      : script.textUz;
    
    const audioFileName = await this.ttsService.generateAudio(text, voiceType);
    
    // DB ga saqlash
    await this.prisma.audioScript.upsert({
      where: {
        category_variant: { category, variant },
      },
      create: {
        category,
        variant,
        textUz: script.textUz,
        [voiceField]: audioFileName,
      },
      update: {
        [voiceField]: audioFileName,
      },
    });

    return {
      audioUrl: this.ttsService.getAudioUrl(audioFileName),
      text,
      duration: null,
    };
  }

  /**
   * O'yin uchun audio to'plamini olish
   */
  async getGameAudioPack(
    variant: number,
    voiceType: VoiceType,
  ) {
    const categories = [
      AudioCategory.GAME_START,
      AudioCategory.NIGHT_START,
      AudioCategory.MAFIA_WAKE,
      AudioCategory.SHERIFF_WAKE,
      AudioCategory.DOCTOR_WAKE,
      AudioCategory.DON_WAKE,
      AudioCategory.MORNING_NO_DEATH,
      AudioCategory.MORNING_DEATH,
      AudioCategory.DISCUSSION,
      AudioCategory.VOTING,
      AudioCategory.ELIMINATION,
      AudioCategory.WIN_CIVILIANS,
      AudioCategory.WIN_MAFIA,
    ];

    const audioPack: Record<string, any> = {};

    for (const category of categories) {
      try {
        audioPack[category] = await this.getOrGenerateAudio(
          category, 
          variant, 
          voiceType
        );
      } catch (error) {
        audioPack[category] = null;
      }
    }

    return audioPack;
  }

  /**
   * Barcha skriptlarni DB ga yuklash (seed)
   */
  async seedScripts() {
    const scripts = this.scriptsService.getAllScripts();
    
    for (const script of scripts) {
      await this.prisma.audioScript.upsert({
        where: {
          category_variant: {
            category: script.category,
            variant: script.variant,
          },
        },
        create: {
          category: script.category,
          variant: script.variant,
          textUz: script.textUz,
          textRu: script.textRu,
        },
        update: {
          textUz: script.textUz,
          textRu: script.textRu,
        },
      });
    }

    return { seeded: scripts.length };
  }

  /**
   * Barcha audiolarni generatsiya qilish
   */
  async generateAllAudios(voiceType: VoiceType) {
    const scripts = await this.prisma.audioScript.findMany({
      where: { isActive: true },
    });

    const voiceField = this.getVoiceField(voiceType);
    let generated = 0;

    for (const script of scripts) {
      if (!script[voiceField]) {
        const audioFileName = await this.ttsService.generateAudio(
          script.textUz, 
          voiceType
        );
        
        await this.prisma.audioScript.update({
          where: { id: script.id },
          data: { [voiceField]: audioFileName },
        });
        
        generated++;
      }
    }

    return { generated, total: scripts.length };
  }

  /**
   * Voice field nomini olish
   */
  private getVoiceField(voiceType: VoiceType): string {
    const mapping: Record<VoiceType, string> = {
      [VoiceType.MALE_1]: 'audioMale1',
      [VoiceType.MALE_2]: 'audioMale2',
      [VoiceType.FEMALE_1]: 'audioFemale1',
      [VoiceType.FEMALE_2]: 'audioFemale2',
    };
    return mapping[voiceType];
  }

  /**
   * Atmosfera tovushlarini olish
   */
  async getAtmosphereSounds(category?: string) {
    const where = category ? { category: category as any } : {};
    
    return this.prisma.atmosphereSound.findMany({
      where: { ...where, isActive: true },
    });
  }
}
