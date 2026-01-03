import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { TtsService } from './tts.service';
import { AudioScriptsService } from './audio-scripts.service';

@Module({
  controllers: [AudioController],
  providers: [AudioService, TtsService, AudioScriptsService],
  exports: [AudioService, TtsService, AudioScriptsService],
})
export class AudioModule {}
