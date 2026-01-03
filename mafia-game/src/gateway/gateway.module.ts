import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameModule } from '../game/game.module';
import { AudioModule } from '../audio/audio.module';

@Module({
  imports: [GameModule, AudioModule],
  providers: [GameGateway],
  exports: [GameGateway],
})
export class GatewayModule {}
