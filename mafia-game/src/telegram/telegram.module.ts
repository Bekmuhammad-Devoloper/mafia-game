import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';

// TelegramService va TelegramUpdate olib tashlandi
// Bot handler'lar main.ts'da manual sozlanadi

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    RoomsModule,
  ],
  providers: [],
  exports: [],
})
export class TelegramModule {}
