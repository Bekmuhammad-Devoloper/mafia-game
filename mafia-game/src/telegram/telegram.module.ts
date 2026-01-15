import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';

// nestjs-telegraf olib tashlandi - bot.launch() 409 xatosiga olib keladi
// Webhook rejimida faqat manual setup kerak (main.ts)

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    RoomsModule,
  ],
  providers: [TelegramService, TelegramUpdate],
  exports: [TelegramService],
})
export class TelegramModule {}
