import { Controller, Get, Post, Param, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import type { Response } from 'express';
import { AudioService } from './audio.service';
import { TtsService } from './tts.service';
import { AudioCategory, VoiceType } from '@prisma/client';

@ApiTags('Audio')
@Controller('audio')
export class AudioController {
  constructor(
    private readonly audioService: AudioService,
    private readonly ttsService: TtsService,
  ) {}

  @Get('script/:category')
  @ApiOperation({ summary: 'Kategoriya bo\'yicha audio olish' })
  @ApiQuery({ name: 'variant', required: false, type: Number })
  @ApiQuery({ name: 'voiceType', required: false, enum: VoiceType })
  async getAudio(
    @Param('category') category: AudioCategory,
    @Query('variant') variant?: number,
    @Query('voiceType') voiceType?: VoiceType,
  ) {
    return this.audioService.getOrGenerateAudio(
      category,
      variant || 1,
      voiceType || VoiceType.MALE_1,
    );
  }

  @Get('pack/:variant')
  @ApiOperation({ summary: 'O\'yin uchun audio to\'plami' })
  @ApiQuery({ name: 'voiceType', required: false, enum: VoiceType })
  async getAudioPack(
    @Param('variant') variant: number,
    @Query('voiceType') voiceType?: VoiceType,
  ) {
    return this.audioService.getGameAudioPack(
      variant,
      voiceType || VoiceType.MALE_1,
    );
  }

  @Get('file/:fileName')
  @ApiOperation({ summary: 'Audio faylni yuklab olish' })
  async getAudioFile(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    const audioBuffer = await this.ttsService.getAudioFile(fileName);
    
    if (!audioBuffer) {
      return res.status(404).json({ error: 'Audio topilmadi' });
    }

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
    });
    
    return res.send(audioBuffer);
  }

  @Get('atmosphere')
  @ApiOperation({ summary: 'Atmosfera tovushlari' })
  @ApiQuery({ name: 'category', required: false })
  async getAtmosphereSounds(@Query('category') category?: string) {
    return this.audioService.getAtmosphereSounds(category);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Skriptlarni DB ga yuklash' })
  async seedScripts() {
    return this.audioService.seedScripts();
  }

  @Post('generate-all')
  @ApiOperation({ summary: 'Barcha audiolarni generatsiya qilish' })
  @ApiQuery({ name: 'voiceType', required: true, enum: VoiceType })
  async generateAllAudios(@Query('voiceType') voiceType: VoiceType) {
    return this.audioService.generateAllAudios(voiceType);
  }
}
