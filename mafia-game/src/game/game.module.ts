import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [RoomsModule, UsersModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
